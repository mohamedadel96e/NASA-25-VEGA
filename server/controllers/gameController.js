const GameProgress = require('../models/GameProgress');
const User = require('../models/User');
const { getLevelById, getAllLevels } = require('../utils/gameLevels');
const { 
  getAvailableComponentsForLevel, 
  getComponentById, 
  validateComponentPlacement,
  getEnvironmentConfig,
  getHabitatModel,
  getComponentModel,
  getAllComponents 
} = require('../utils/simpleComponents');

// @desc    Get user's game progress with 3D environment
// @route   GET /api/game/progress
// @access  Private
const getGameProgress = async (req, res, next) => {
  try {
    let progress = await GameProgress.findOne({ userId: req.user.id });
    
    if (!progress) {
      // Create initial progress if doesn't exist
      progress = await GameProgress.create({
        userId: req.user.id,
        currentLevel: 1,
        completedLevels: [],
        totalScore: 0
      });
    }

    // Get current level data with 3D environment
    const currentLevelData = getLevelById(progress.currentLevel);
    const environment3D = currentLevelData ? getEnvironmentConfig(currentLevelData.environment) : null;
    const availableComponents = getAvailableComponentsForLevel(progress.currentLevel);

    res.status(200).json({
      success: true,
      progress: {
        id: progress._id,
        currentLevel: progress.currentLevel,
        completedLevels: progress.completedLevels,
        levelScores: Object.fromEntries(progress.levelScores),
        totalScore: progress.totalScore,
        achievements: progress.achievements,
        progressPercentage: progress.progressPercentage,
        averageScore: progress.averageScore,
        stats: progress.stats,
        preferences: progress.preferences,
        currentDesign: progress.currentDesign,
        // 3D Game data
        currentLevelInfo: currentLevelData,
        environment3D: environment3D,
        availableComponents: availableComponents.map(comp => ({
          ...comp,
          model3D: comp.model3D
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Start a level
// @route   POST /api/game/level/start
// @access  Private
const startLevel = async (req, res, next) => {
  try {
    const { level } = req.body;

    if (!level || level < 1 || level > 10) {
      return res.status(400).json({
        success: false,
        message: 'Invalid level number. Must be between 1 and 10.'
      });
    }

    let progress = await GameProgress.findOne({ userId: req.user.id });
    
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Game progress not found. Please create a new game.'
      });
    }

    // Check if level is accessible
    if (level > progress.currentLevel && !progress.completedLevels.includes(level - 1)) {
      return res.status(403).json({
        success: false,
        message: 'This level is not yet accessible. Complete previous levels first.'
      });
    }

    // Reset current design for the level
    progress.currentDesign = {
      habitatShape: null,
      dimensions: {},
      components: [],
      crewSize: 2,
      missionDuration: 30
    };

    await progress.save();

    res.status(200).json({
      success: true,
      message: `Level ${level} started successfully`,
      level,
      currentDesign: progress.currentDesign
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete a level
// @route   POST /api/game/level/complete
// @access  Private
const completeLevel = async (req, res, next) => {
  try {
    const { level, score, stars, timeTaken, design } = req.body;

    if (!level || score === undefined || stars === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Level, score, and stars are required'
      });
    }

    if (level < 1 || level > 10) {
      return res.status(400).json({
        success: false,
        message: 'Invalid level number'
      });
    }

    if (score < 0 || score > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Score must be between 0 and 1000'
      });
    }

    if (stars < 0 || stars > 3) {
      return res.status(400).json({
        success: false,
        message: 'Stars must be between 0 and 3'
      });
    }

    let progress = await GameProgress.findOne({ userId: req.user.id });
    
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Game progress not found'
      });
    }

    // Complete the level
    await progress.completeLevel(level, score, stars, timeTaken || 0);

    // Update current design if provided
    if (design) {
      progress.currentDesign = design;
      await progress.save();
    }

    // Update statistics
    progress.stats.componentsPlaced += design?.components?.length || 0;
    progress.stats.designsValidated += 1;
    
    if (timeTaken) {
      progress.stats.totalPlayTime += timeTaken;
    }

    await progress.save();

    // Check for achievements
    await checkAndUnlockAchievements(progress);

    res.status(200).json({
      success: true,
      message: `Level ${level} completed successfully!`,
      progress: {
        currentLevel: progress.currentLevel,
        completedLevels: progress.completedLevels,
        levelScores: Object.fromEntries(progress.levelScores),
        totalScore: progress.totalScore,
        achievements: progress.achievements,
        progressPercentage: progress.progressPercentage,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current design progress
// @route   PUT /api/game/progress
// @access  Private
const updateProgress = async (req, res, next) => {
  try {
    const { currentDesign, preferences } = req.body;

    let progress = await GameProgress.findOne({ userId: req.user.id });
    
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Game progress not found'
      });
    }

    // Update current design
    if (currentDesign) {
      progress.currentDesign = { ...progress.currentDesign, ...currentDesign };
    }

    // Update preferences
    if (preferences) {
      progress.preferences = { ...progress.preferences, ...preferences };
    }

    await progress.save();

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      currentDesign: progress.currentDesign,
      preferences: progress.preferences
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leaderboard
// @route   GET /api/game/leaderboard
// @access  Public
const getLeaderboard = async (req, res, next) => {
  try {
    const { limit = 10, type = 'total' } = req.query;

    let sortField = 'totalScore';
    
    if (type === 'level') {
      const { level } = req.query;
      if (level && level >= 1 && level <= 10) {
        // Get leaderboard for specific level
        const topPlayers = await GameProgress.find({
          [`levelScores.${level}`]: { $exists: true }
        })
        .populate('userId', 'name avatar country')
        .sort({ [`levelScores.${level}.score`]: -1 })
        .limit(parseInt(limit));

        const leaderboard = topPlayers.map((progress, index) => ({
          rank: index + 1,
          user: {
            name: progress.userId.name,
            avatar: progress.userId.avatar,
            country: progress.userId.country
          },
          score: progress.levelScores.get(level.toString())?.score || 0,
          stars: progress.levelScores.get(level.toString())?.stars || 0,
          completedAt: progress.levelScores.get(level.toString())?.completedAt
        }));

        return res.status(200).json({
          success: true,
          leaderboard,
          type: 'level',
          level: parseInt(level)
        });
      }
    }

    // Get total score leaderboard
    const topPlayers = await GameProgress.find()
      .populate('userId', 'name avatar country')
      .sort({ [sortField]: -1 })
      .limit(parseInt(limit));

    const leaderboard = topPlayers.map((progress, index) => ({
      rank: index + 1,
      user: {
        name: progress.userId.name,
        avatar: progress.userId.avatar,
        country: progress.userId.country
      },
      totalScore: progress.totalScore,
      levelsCompleted: progress.completedLevels.length,
      averageScore: progress.averageScore,
    }));

    res.status(200).json({
      success: true,
      leaderboard,
      type: 'total'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's rank
// @route   GET /api/game/rank
// @access  Private
const getUserRank = async (req, res, next) => {
  try {
    const userProgress = await GameProgress.findOne({ userId: req.user.id });
    
    if (!userProgress) {
      return res.status(404).json({
        success: false,
        message: 'Game progress not found'
      });
    }

    // Calculate rank based on total score
    const higherScorePlayers = await GameProgress.countDocuments({
      totalScore: { $gt: userProgress.totalScore }
    });

    const totalPlayers = await GameProgress.countDocuments();
    const rank = higherScorePlayers + 1;
    const percentile = Math.round(((totalPlayers - rank + 1) / totalPlayers) * 100);

    res.status(200).json({
      success: true,
      rank,
      totalPlayers,
      percentile,
      score: userProgress.totalScore,
      levelsCompleted: userProgress.completedLevels.length
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to check and unlock achievements
const checkAndUnlockAchievements = async (progress) => {
  const achievements = [];

  // First Steps - Complete first level
  if (progress.completedLevels.includes(1) && !progress.achievements.find(a => a.id === 'first_steps')) {
    achievements.push({
      id: 'first_steps',
      name: 'First Steps',
      description: 'Complete your first level'
    });
  }

  // Perfect Score - Get 1000 points on any level
  if (progress.stats.perfectScores > 0 && !progress.achievements.find(a => a.id === 'perfect_score')) {
    achievements.push({
      id: 'perfect_score',
      name: 'Perfect Score',
      description: 'Achieve a perfect score of 1000 points'
    });
  }

  // Halfway There - Complete 5 levels
  if (progress.completedLevels.length >= 5 && !progress.achievements.find(a => a.id === 'halfway_there')) {
    achievements.push({
      id: 'halfway_there',
      name: 'Halfway There',
      description: 'Complete 5 levels'
    });
  }

  // Space Architect - Complete all 10 levels
  if (progress.completedLevels.length === 10 && !progress.achievements.find(a => a.id === 'space_architect')) {
    achievements.push({
      id: 'space_architect',
      name: 'Space Architect',
      description: 'Complete all 10 levels'
    });
  }

  // High Scorer - Reach 5000 total points
  if (progress.totalScore >= 5000 && !progress.achievements.find(a => a.id === 'high_scorer')) {
    achievements.push({
      id: 'high_scorer',
      name: 'High Scorer',
      description: 'Reach 5000 total points'
    });
  }

  // Component Master - Place 100 components
  if (progress.stats.componentsPlaced >= 100 && !progress.achievements.find(a => a.id === 'component_master')) {
    achievements.push({
      id: 'component_master',
      name: 'Component Master',
      description: 'Place 100 components'
    });
  }

  // Unlock new achievements
  for (const achievement of achievements) {
    await progress.unlockAchievement(achievement.id, achievement.name, achievement.description);
  }

  return achievements;
};



// @desc    Get all levels information with 3D data
// @route   GET /api/game/levels
// @access  Private
const getAllLevelsInfo = async (req, res, next) => {
  try {
    const levels = getAllLevels();
    
    const levelsWithModels = levels.map(level => ({
      ...level,
      environment3D: getEnvironmentConfig(level.environment),
      availableComponents: getAvailableComponentsForLevel(level.id).map(comp => ({
        id: comp.id,
        name: comp.name,
        description: comp.description,
        category: comp.category,
        icon: comp.icon,
        model3D: comp.model3D
      }))
    }));

    res.status(200).json({
      success: true,
      levels: levelsWithModels
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get component library with 3D models
// @route   GET /api/game/components
// @access  Private
const getComponentLibrary = async (req, res, next) => {
  try {
    const { level } = req.query;
    
    let components;
    if (level) {
      components = getAvailableComponentsForLevel(parseInt(level));
    } else {
      components = getAllComponents();
    }

    const componentsWithModels = components.map(comp => ({
      ...comp,
      model3DPath: `/assets/models/${comp.model3D.fileName}`
    }));

    res.status(200).json({
      success: true,
      components: componentsWithModels
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Validate habitat design with simplified scoring
// @route   POST /api/game/validate-design
// @access  Private
const validateDesign = async (req, res, next) => {
  try {
    const { components, habitatShape, crewSize, level } = req.body;

    if (!components || !habitatShape || !crewSize || !level) {
      return res.status(400).json({
        success: false,
        message: 'Missing required design parameters'
      });
    }

    const levelData = getLevelById(level);
    if (!levelData) {
      return res.status(400).json({
        success: false,
        message: 'Invalid level'
      });
    }

    // Simple validation
    const validation = await simpleScoring(components, habitatShape, crewSize, levelData);

    res.status(200).json({
      success: true,
      validation: validation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get 3D model data for components
// @route   GET /api/game/model/:componentId
// @access  Private
const getModel3D = async (req, res, next) => {
  try {
    const { componentId } = req.params;
    
    const component = getComponentById(componentId);
    if (!component || !component.model3D) {
      return res.status(404).json({
        success: false,
        message: 'Component or 3D model not found'
      });
    }

    res.status(200).json({
      success: true,
      model3D: {
        ...component.model3D,
        path: `/assets/models/${component.model3D.fileName}`,
        component: {
          id: component.id,
          name: component.name,
          category: component.category
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Simplified scoring algorithm for demo purposes
const simpleScoring = async (components, habitatShape, crewSize, levelData) => {
  const scoring = {
    totalScore: 0,
    maxScore: 1000,
    breakdown: {},
    issues: [],
    suggestions: [],
    passed: false
  };

  try {
    // 1. Essential Components Check (400 points max)
    const essentialComponents = ['LIFE_SUPPORT', 'SLEEP_QUARTERS', 'HYGIENE', 'KITCHEN'];
    const placedEssentials = components.filter(comp => essentialComponents.includes(comp.type));
    
    scoring.breakdown.essentials = {
      score: (placedEssentials.length / essentialComponents.length) * 400,
      max: 400,
      details: `${placedEssentials.length}/${essentialComponents.length} essential components`
    };

    if (placedEssentials.length < essentialComponents.length) {
      scoring.issues.push('Missing essential components for crew survival');
    }

    // 2. Crew Accommodation (200 points max)
    const sleepQuarters = components.filter(comp => comp.type === 'SLEEP_QUARTERS').length;
    const accommodationScore = Math.min(sleepQuarters / crewSize, 1) * 200;
    
    scoring.breakdown.accommodation = {
      score: accommodationScore,
      max: 200,
      details: `${sleepQuarters} sleep quarters for ${crewSize} crew members`
    };

    if (sleepQuarters < crewSize) {
      scoring.issues.push(`Need ${crewSize - sleepQuarters} more sleep quarters`);
    }

    // 3. Level Objectives (300 points max)
    let objectiveScore = 0;
    
    if (levelData.objectives) {
      const completedObjectives = levelData.objectives.filter(objective => {
        if (objective.includes('laboratory')) {
          return components.some(comp => comp.type === 'LABORATORY');
        }
        if (objective.includes('exercise')) {
          return components.some(comp => comp.type === 'EXERCISE');
        }
        if (objective.includes('storage')) {
          return components.some(comp => comp.type === 'STORAGE');
        }
        return true; // Basic objectives assumed complete
      });
      
      objectiveScore = (completedObjectives.length / levelData.objectives.length) * 300;
    } else {
      objectiveScore = 200; // Default for basic levels
    }

    scoring.breakdown.objectives = {
      score: objectiveScore,
      max: 300,
      details: 'Level-specific mission objectives'
    };

    // 4. Efficiency and Design (100 points max)
    const totalComponents = components.length;
    const efficiencyBonus = totalComponents >= 6 && totalComponents <= 12 ? 100 : 50;
    
    scoring.breakdown.efficiency = {
      score: efficiencyBonus,
      max: 100,
      details: `${totalComponents} components placed - good balance`
    };

    if (totalComponents < 4) {
      scoring.issues.push('Design too minimal - add more components');
    } else if (totalComponents > 15) {
      scoring.issues.push('Design too complex - may be difficult to manage');
    }

    // Calculate total score
    scoring.totalScore = Math.round(
      scoring.breakdown.essentials.score +
      scoring.breakdown.accommodation.score +
      scoring.breakdown.objectives.score +
      scoring.breakdown.efficiency.score
    );

    // Determine if passed (need at least 600/1000 points)
    scoring.passed = scoring.totalScore >= 600;

    // Add suggestions
    if (scoring.totalScore < 800) {
      scoring.suggestions.push('Consider adding emergency systems for safety');
      scoring.suggestions.push('Include recreational areas for crew well-being');
    }

    if (!components.some(comp => comp.type === 'AIRLOCK')) {
      scoring.suggestions.push('Add an airlock for spacewalks and emergencies');
    }

    return scoring;

  } catch (error) {
    console.error('Scoring error:', error);
    return {
      totalScore: 0,
      maxScore: 1000,
      breakdown: {},
      issues: ['Error calculating score'],
      suggestions: [],
      passed: false
    };
  }
};

module.exports = {
  getGameProgress,
  startLevel,
  completeLevel,
  updateProgress,
  getLeaderboard,
  getUserRank,
  // New simplified game methods
  getAllLevelsInfo,
  getComponentLibrary,
  validateDesign,
  getModel3D,
  simpleScoring
};
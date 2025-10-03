// NASA-compliant 10-level game configuration for Space Habitat Challenge
// Based on NASA Table 17: Minimum Habitable Volumes
// Designed to teach real space habitat design principles

const { NASA_OFFICIAL_VOLUMES } = require('./validation');

const GAME_LEVELS = {
  1: {
    id: 1,
    title: "First Steps in Space",
    description: "Create your first space habitat structure using NASA standards",
    objectives: [
      "Select a habitat shape (Cylinder recommended for structural integrity)",
      "Set minimum dimensions (58m³ volume for 2 crew - NASA minimum)", 
      "Place habitat in the 3D environment"
    ],
    availableComponents: [], // Only habitat shape selection
    requiredComponents: [],
    minVolume: 58, // NASA NIV per crew member (28.96) × 2 crew
    maxVolume: 100,
    scoreTarget: 100,
    difficulty: "Beginner",
    unlocked: true,
    tutorial: "Welcome to space! Start by creating a basic habitat structure. NASA requires minimum 28.96m³ per crew member.",
    environment: {
      scene: "space_void",
      lighting: "ambient",
      camera: "orbital"
    },
    nasa_education: "This level teaches NASA's fundamental volume requirements based on actual space station research.",
    crewSize: 2
  },

  2: {
    id: 2,
    title: "Life Support Systems - NASA Critical",
    description: "Essential life support following NASA safety standards",
    objectives: [
      "Add LIFE_SUPPORT system (8-12m³ minimum per NASA standards)",
      "Position centrally for optimal air circulation",
      "Ensure accessibility for maintenance"
    ],
    availableComponents: ["LIFE_SUPPORT"],
    requiredComponents: ["LIFE_SUPPORT"],
    minVolume: 68, // Previous + life support minimum
    maxVolume: 150,
    scoreTarget: 200,
    difficulty: "Beginner",
    tutorial: "Life support systems are critical - NASA designs these for maximum reliability. Size and positioning matter for crew safety.",
    environment: {
      scene: "space_station",
      lighting: "technical",
      camera: "interior"
    },
    nasa_education: "Based on NASA's Environmental Control and Life Support System (ECLSS) requirements.",
    crewSize: 2
  },

  3: {
    id: 3,
    title: "Private Habitation - NASA Crew Quarters",
    description: "Design crew sleeping and work areas per NASA Table 17",
    objectives: [
      "Add PRIVATE_HABITATION (31.36m³ per crew member - NASA standard)",
      "Include both sleep and work areas", 
      "Ensure acoustic isolation from equipment"
    ],
    availableComponents: ["LIFE_SUPPORT", "PRIVATE_HABITATION"],
    requiredComponents: ["LIFE_SUPPORT", "PRIVATE_HABITATION"],
    minVolume: 130.72, // NASA: 31.36m³ × 2 crew + life support
    maxVolume: 200,
    scoreTarget: 300,
    difficulty: "Beginner",
    crewSize: 2,
    tutorial: "NASA research shows crew need private space for sleep and personal work. This is based on ISS experience.",
    nasa_education: "NASA Table 17: PRIVATE_HABITATION_WORK (17.40m³) + PRIVATE_HABITATION_SLEEP (13.96m³) per crew member."
  },

  4: {
    id: 4,
    title: "Hygiene & Waste Management - NASA Standards",
    description: "Critical hygiene facilities following NASA health requirements",
    objectives: [
      "Add HYGIENE_CLEANSING facility (4.35m³ - NASA minimum)",
      "Add WASTE_MANAGEMENT system (3.76-4.42m³)",
      "Maintain separation from food preparation areas"
    ],
    availableComponents: ["LIFE_SUPPORT", "PRIVATE_HABITATION", "HYGIENE", "WASTE_MANAGEMENT"],
    requiredComponents: ["LIFE_SUPPORT", "PRIVATE_HABITATION", "HYGIENE", "WASTE_MANAGEMENT"],
    minVolume: 138.83, // Previous + hygiene (4.35) + waste (3.76)
    maxVolume: 250,
    scoreTarget: 400,
    difficulty: "Easy",
    crewSize: 2,
    nasa_education: "NASA Table 17: HYGIENE_CLEANSING (4.35m³) and WASTE_MANAGEMENT (3.76m³) are health-critical systems."
  },

  5: {
    id: 5,
    title: "Food Systems - NASA Nutrition Standards", 
    description: "Design kitchen and food storage per NASA meal preparation standards",
    objectives: [
      "Add MEAL_PREPARATION area (4.35m³ - NASA minimum)",
      "Add FOOD_STORAGE/LOGISTICS (6.00m³ minimum)",
      "Maintain hygiene separation per NASA protocols"
    ],
    availableComponents: ["LIFE_SUPPORT", "PRIVATE_HABITATION", "HYGIENE", "WASTE_MANAGEMENT", "MEAL_PREPARATION", "LOGISTICS_STORAGE"],
    requiredComponents: ["LIFE_SUPPORT", "PRIVATE_HABITATION", "HYGIENE", "MEAL_PREPARATION"],
    minVolume: 149.18, // Previous + meal prep (4.35) + storage (6.00)
    maxVolume: 300,
    scoreTarget: 500,
    difficulty: "Easy",
    crewSize: 2,
    nasa_education: "NASA Table 17: MEAL_PREPARATION (4.35m³) and LOGISTICS_STOWAGE (6.00m³) for crew nutrition."
  },

  6: {
    id: 6,
    title: "Exercise Systems - NASA Fitness Requirements",
    description: "Essential exercise equipment following NASA fitness standards",
    objectives: [
      "Add EXERCISE equipment (18.20m³ total - NASA requirement)",
      "Include TREADMILL (6.12m³) and RESISTIVE device (3.92m³)",
      "Maintain adequate clearance and noise isolation"
    ],
    availableComponents: ["LIFE_SUPPORT", "PRIVATE_HABITATION", "HYGIENE", "WASTE_MANAGEMENT", "MEAL_PREPARATION", "LOGISTICS_STORAGE", "EXERCISE", "TREADMILL"],
    requiredComponents: ["LIFE_SUPPORT", "PRIVATE_HABITATION", "HYGIENE", "MEAL_PREPARATION", "EXERCISE"],
    minVolume: 167.38, // Previous + exercise systems
    maxVolume: 350,
    scoreTarget: 600,
    difficulty: "Medium",
    crewSize: 2,
    nasa_education: "NASA Table 17: Exercise prevents muscle/bone loss. EXERCISE_TREADMILL (6.12m³), EXERCISE_RESISTIVE (3.92m³), GROUP_SOCIAL_OPEN (18.20m³) for workout area."
  },

  7: {
    id: 7,
    title: "Research & Utilization - NASA Science Mission",
    description: "Create dedicated research workspace per NASA standards",
    objectives: [
      "Add UTILIZATION_RESEARCH area (10.25m³ - NASA specification)",
      "Add MAINTENANCE_COMPUTER system (3.40m³)",
      "Include MAINTENANCE_WORK area (4.82m³)",
      "Design for 3 crew members"
    ],
    availableComponents: ["LIFE_SUPPORT", "PRIVATE_HABITATION", "HYGIENE", "WASTE_MANAGEMENT", "MEAL_PREPARATION", "LOGISTICS_STORAGE", "EXERCISE", "UTILIZATION_RESEARCH", "MAINTENANCE"],
    requiredComponents: ["LIFE_SUPPORT", "PRIVATE_HABITATION", "HYGIENE", "MEAL_PREPARATION", "EXERCISE", "UTILIZATION_RESEARCH"],
    minVolume: 217.31, // Previous + crew expansion + research
    maxVolume: 400,
    scoreTarget: 700,
    difficulty: "Medium",
    crewSize: 3,
    nasa_education: "NASA Table 17: UTILIZATION_RESEARCH (10.25m³) enables scientific missions. MAINTENANCE systems ensure habitat reliability."
  },

  8: {
    id: 8,
    title: "Medical & Emergency - NASA Safety Protocols",
    description: "Critical medical facilities following NASA safety standards",
    objectives: [
      "Add MEDICAL_STORAGE (5.90m³ - NASA minimum)",
      "Add MEDICAL_COMPUTER system (1.20m³)",
      "Ensure medical access from all areas",
      "Include emergency response capability"
    ],
    availableComponents: ["LIFE_SUPPORT", "PRIVATE_HABITATION", "HYGIENE", "WASTE_MANAGEMENT", "MEAL_PREPARATION", "LOGISTICS_STORAGE", "EXERCISE", "UTILIZATION_RESEARCH", "MAINTENANCE", "MEDICAL_STORAGE", "MEDICAL_COMPUTER"],
    requiredComponents: ["LIFE_SUPPORT", "PRIVATE_HABITATION", "HYGIENE", "MEAL_PREPARATION", "EXERCISE", "UTILIZATION_RESEARCH", "MEDICAL_STORAGE"],
    minVolume: 224.41, // Previous + medical systems
    maxVolume: 450,
    scoreTarget: 800,
    difficulty: "Medium",
    crewSize: 3,
    nasa_education: "NASA Table 17: MEDICAL_STORAGE (5.90m³) and MEDICAL_COMPUTER (1.20m³) are critical for crew health and emergency response."
  },

  9: {
    id: 9,
    title: "Mission Planning & Social Areas - NASA Operations",
    description: "Command and social spaces for mission success",
    objectives: [
      "Add MISSION_PLANNING area (3.42m³ - NASA ops requirement)",
      "Add GROUP_SOCIAL_TABLE (10.09m³ for crew meals/meetings)",
      "Ensure communication and coordination capability",
      "Plan for 4 crew members"
    ],
    availableComponents: ["LIFE_SUPPORT", "PRIVATE_HABITATION", "HYGIENE", "WASTE_MANAGEMENT", "MEAL_PREPARATION", "LOGISTICS_STORAGE", "EXERCISE", "UTILIZATION_RESEARCH", "MAINTENANCE", "MEDICAL_STORAGE", "MISSION_PLANNING", "GROUP_SOCIAL"],
    requiredComponents: ["LIFE_SUPPORT", "PRIVATE_HABITATION", "HYGIENE", "MEAL_PREPARATION", "EXERCISE", "UTILIZATION_RESEARCH", "MEDICAL_STORAGE", "MISSION_PLANNING"],
    minVolume: 269.88, // Previous + crew expansion + mission ops
    maxVolume: 500,
    scoreTarget: 900,
    difficulty: "Hard",
    crewSize: 4,
    nasa_education: "NASA Table 17: MISSION_PLANNING (3.42m³) and GROUP_SOCIAL_TABLE (10.09m³) support mission operations and crew psychological health."
  },

  10: {
    id: 10,
    title: "Master Space Architect - Complete NASA Habitat",
    description: "Design a complete ISS-class habitat meeting all NASA standards",
    objectives: [
      "Include ALL NASA functional spaces from Table 17",
      "Design for 4 crew members (minimum 115.84m³ total)",
      "Pass all NASA validation checks",
      "Optimize for extended 365-day mission",
      "Achieve NASA MTH volume standards (147.19m³)"
    ],
    availableComponents: ["ALL"],
    requiredComponents: ["LIFE_SUPPORT", "PRIVATE_HABITATION", "HYGIENE", "WASTE_MANAGEMENT", "MEAL_PREPARATION", "EXERCISE", "UTILIZATION_RESEARCH", "MEDICAL_STORAGE", "MISSION_PLANNING"],
    minVolume: 289.88, // All systems + full crew
    maxVolume: 600,
    scoreTarget: 1000,
    difficulty: "Expert",
    crewSize: 4,
    missionDuration: 365, // Extended mission
    isFinalLevel: true,
    environment: {
      scene: "mars_surface",
      lighting: "dramatic",
      camera: "cinematic"
    },
    nasa_education: "Final challenge: Complete habitat meeting NASA Table 17 standards. Total NIV: 115.83m³, MTH: 147.19m³. This represents a real ISS-class space habitat design.",
    tutorial: "Congratulations! Design a complete NASA-standard habitat. You'll be evaluated against all official NASA requirements from Table 17."
  }
};

// Simple scoring system
const SCORING_RULES = {
  basePoints: {
    componentPlaced: 50,
    objectiveComplete: 100,
    levelComplete: 500
  },
  bonusPoints: {
    optimalVolume: 100,
    goodPlacement: 75,
    efficiency: 150,
    quickCompletion: 200
  },
  penalties: {
    wrongPlacement: -25,
    oversized: -50,
    missingRequired: -100
  }
};

// Helper functions
const getLevelById = (levelId) => {
  return GAME_LEVELS[levelId] || null;
};

const getAllLevels = () => {
  return Object.values(GAME_LEVELS);
};

const getUnlockedLevels = (completedLevels = []) => {
  const levels = getAllLevels();
  return levels.filter(level => {
    if (level.id === 1) return true;
    return completedLevels.includes(level.id - 1);
  });
};

const calculateScore = (level, design, objectives, timeSpent) => {
  let score = 0;
  const levelData = getLevelById(level);
  
  if (!levelData) return 0;

  // Base points for level completion
  if (objectives.length > 0) {
    score += SCORING_RULES.basePoints.levelComplete;
  }

  // Points for each objective completed
  score += objectives.length * SCORING_RULES.basePoints.objectiveComplete;

  // Points for each component placed
  if (design.components) {
    score += design.components.length * SCORING_RULES.basePoints.componentPlaced;
  }

  // Bonus for optimal volume
  if (design.volume >= levelData.minVolume && design.volume <= levelData.maxVolume) {
    score += SCORING_RULES.bonusPoints.optimalVolume;
  }

  // Time bonus (if completed quickly)
  if (timeSpent && timeSpent < 300) { // Less than 5 minutes
    score += SCORING_RULES.bonusPoints.quickCompletion;
  }

  return Math.max(0, score);
};

const checkObjectives = (level, design) => {
  const levelData = getLevelById(level);
  if (!levelData) return [];

  const completedObjectives = [];
  const requiredComponents = levelData.requiredComponents || [];
  const designComponents = design.components || [];
  const designComponentTypes = designComponents.map(c => c.type);

  // Check required components
  requiredComponents.forEach(requiredType => {
    if (designComponentTypes.includes(requiredType)) {
      completedObjectives.push(`Added ${requiredType.replace('_', ' ').toLowerCase()}`);
    }
  });

  // Check volume requirements
  if (design.volume >= levelData.minVolume) {
    completedObjectives.push(`Met minimum volume requirement (${levelData.minVolume}m³)`);
  }

  // Check crew size if specified
  if (levelData.crewSize && design.crewSize >= levelData.crewSize) {
    completedObjectives.push(`Designed for ${levelData.crewSize} crew members`);
  }

  return completedObjectives;
};

module.exports = {
  GAME_LEVELS,
  SCORING_RULES,
  getLevelById,
  getAllLevels,
  getUnlockedLevels,
  calculateScore,
  checkObjectives
};
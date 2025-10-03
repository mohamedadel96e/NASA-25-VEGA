// Game scoring system for NASA VEGA Space Habitat Design Tool

const SCORING_RULES = {
  // Base points for completing objectives
  basePoints: {
    componentPlaced: 50,
    correctPlacement: 100,
    optimalVolume: 150,
    adjacencyBonus: 75,
    efficiencyBonus: 200,
    levelCompletion: 500
  },

  // Penalties
  penalties: {
    wrongPlacement: -25,
    volumeViolation: -50,
    missingRequired: -100,
    adjacencyViolation: -30,
    inefficiency: -20
  },

  // Multipliers based on level difficulty
  levelMultipliers: {
    1: 1.0,   // Basic introduction
    2: 1.1,   // Life support
    3: 1.2,   // Sleep quarters
    4: 1.3,   // Hygiene
    5: 1.4,   // Kitchen/food
    6: 1.5,   // Exercise
    7: 1.6,   // Laboratory
    8: 1.7,   // Storage
    9: 1.8,   // Emergency systems
    10: 2.0   // Final challenge
  },

  // Time bonus calculation
  timeBonus: {
    maxBonus: 200,
    targetTime: 300, // 5 minutes in seconds
    penaltyPerSecond: 0.5
  },

  // Star rating thresholds
  starThresholds: {
    1: 300,  // Minimum for 1 star
    2: 600,  // Minimum for 2 stars
    3: 850   // Minimum for 3 stars
  }
};

// Level-specific objectives and requirements
const LEVEL_OBJECTIVES = {
  1: {
    title: "Welcome to Space - First Steps",
    description: "Learn about habitat shapes and create your first structure",
    objectives: [
      { id: 'select_habitat', points: 100, description: 'Select a habitat shape' },
      { id: 'set_dimensions', points: 100, description: 'Set appropriate dimensions (min 20m³)' },
      { id: 'place_habitat', points: 100, description: 'Place the habitat in the environment' }
    ],
    requiredComponents: [],
    availableComponents: [],
    crewSize: 1,
    targetTime: 180, // 3 minutes
    hints: ["Space habitats protect astronauts from the harsh environment of space"]
  },

  2: {
    title: "Breathing Room - Life Support System",
    description: "Every astronaut needs oxygen! Install life support",
    objectives: [
      { id: 'add_life_support', points: 200, description: 'Add ECLSS (Environmental Control) system' },
      { id: 'correct_volume', points: 150, description: 'Ensure life support volume is 6-10m³' },
      { id: 'proper_placement', points: 150, description: 'Place in accessible location' }
    ],
    requiredComponents: ['LIFE_SUPPORT'],
    availableComponents: ['LIFE_SUPPORT'],
    crewSize: 1,
    targetTime: 240,
    hints: ["Life support systems need 6-10m³ of space", "Place near the center for easy access"]
  },

  3: {
    title: "Rest & Recovery - Sleep Quarters",
    description: "Astronauts need 8 hours of sleep. Design sleeping area",
    objectives: [
      { id: 'add_sleep_quarters', points: 200, description: 'Add sleep quarters (6m³ per crew member)' },
      { id: 'away_from_noise', points: 100, description: 'Place away from noisy areas' },
      { id: 'crew_capacity', points: 200, description: 'Include sleep space for 2 crew members' }
    ],
    requiredComponents: ['SLEEP_QUARTERS'],
    availableComponents: ['LIFE_SUPPORT', 'SLEEP_POD', 'SLEEP_QUARTERS'],
    crewSize: 2,
    targetTime: 300,
    hints: ["Each crew member needs their own sleep space", "Keep sleep areas quiet"]
  },

  4: {
    title: "Stay Clean - Hygiene Facilities",
    description: "Add bathroom and hygiene station",
    objectives: [
      { id: 'add_hygiene', points: 200, description: 'Add hygiene area (4m³ minimum)' },
      { id: 'separate_from_food', points: 150, description: 'Keep separate from food area' },
      { id: 'waste_management', points: 150, description: 'Include waste management' }
    ],
    requiredComponents: ['HYGIENE'],
    availableComponents: ['LIFE_SUPPORT', 'SLEEP_POD', 'HYGIENE'],
    crewSize: 2,
    targetTime: 300,
    hints: ["Hygiene areas must be isolated from food preparation", "Include proper ventilation"]
  },

  5: {
    title: "Fuel Up - Food & Kitchen",
    description: "Design food preparation and dining area",
    objectives: [
      { id: 'add_kitchen', points: 200, description: 'Add kitchen (8m³ minimum)' },
      { id: 'add_food_storage', points: 200, description: 'Add food storage (5m³)' },
      { id: 'adjacent_placement', points: 100, description: 'Place kitchen and storage adjacent' }
    ],
    requiredComponents: ['KITCHEN', 'FOOD_STORAGE'],
    availableComponents: ['LIFE_SUPPORT', 'SLEEP_POD', 'HYGIENE', 'KITCHEN', 'FOOD_STORAGE'],
    crewSize: 2,
    targetTime: 360,
    hints: ["Keep food areas clean and organized", "Kitchen and storage should be close together"]
  },

  6: {
    title: "Stay Fit - Exercise Zone",
    description: "Astronauts must exercise 2 hours daily in microgravity",
    objectives: [
      { id: 'add_exercise', points: 200, description: 'Add exercise area (10m³ minimum)' },
      { id: 'equipment_space', points: 150, description: 'Include space for equipment' },
      { id: 'ceiling_height', points: 150, description: 'Ensure adequate ceiling height' }
    ],
    requiredComponents: ['EXERCISE'],
    availableComponents: ['LIFE_SUPPORT', 'SLEEP_POD', 'HYGIENE', 'KITCHEN', 'EXERCISE'],
    crewSize: 2,
    targetTime: 360,
    hints: ["Exercise equipment needs room to operate", "Keep exercise area away from sleep quarters"]
  },

  7: {
    title: "Science Time - Work & Lab Area",
    description: "Create workspace for research and experiments",
    objectives: [
      { id: 'add_laboratory', points: 250, description: 'Add laboratory (12m³ minimum)' },
      { id: 'add_workstations', points: 150, description: 'Add workstations' },
      { id: 'equipment_storage', points: 100, description: 'Include storage for equipment' }
    ],
    requiredComponents: ['LAB'],
    availableComponents: ['LIFE_SUPPORT', 'SLEEP_POD', 'HYGIENE', 'KITCHEN', 'EXERCISE', 'LAB', 'WORKSTATION'],
    crewSize: 2,
    targetTime: 420,
    hints: ["Labs need clean environment", "Workstations should be near lab areas"]
  },

  8: {
    title: "Store It All - Storage Solutions",
    description: "Organize supplies and equipment storage",
    objectives: [
      { id: 'add_storage', points: 200, description: 'Add storage areas (5m³ per crew member)' },
      { id: 'distribute_storage', points: 150, description: 'Distribute storage throughout habitat' },
      { id: 'organize_types', points: 150, description: 'Organize different storage types' }
    ],
    requiredComponents: ['STORAGE_RACK'],
    availableComponents: ['ALL_PREVIOUS', 'STORAGE_RACK', 'CARGO_BAY'],
    crewSize: 3,
    targetTime: 480,
    hints: ["Different items need different storage", "Distribute storage for easy access"]
  },

  9: {
    title: "Emergency Ready - Airlock & Safety",
    description: "Add airlock and emergency systems",
    objectives: [
      { id: 'add_airlock', points: 300, description: 'Add airlock (8m³ minimum)' },
      { id: 'emergency_equipment', points: 200, description: 'Add emergency equipment storage' },
      { id: 'evacuation_paths', points: 100, description: 'Ensure clear evacuation paths' }
    ],
    requiredComponents: ['AIRLOCK'],
    availableComponents: ['ALL', 'AIRLOCK', 'EMERGENCY_KIT'],
    crewSize: 3,
    targetTime: 540,
    hints: ["Airlocks are critical for safety", "Emergency equipment must be easily accessible"]
  },

  10: {
    title: "Final Mission - Complete Habitat",
    description: "Design a fully functional habitat for 4 crew members",
    objectives: [
      { id: 'all_systems', points: 400, description: 'All essential systems included' },
      { id: 'nasa_validation', points: 400, description: 'Passes all NASA validation checks' },
      { id: 'optimization', points: 200, description: 'Optimized for 30-day mission' }
    ],
    requiredComponents: ['ALL_ESSENTIALS'],
    availableComponents: ['ALL'],
    crewSize: 4,
    missionDuration: 30,
    targetTime: 900, // 15 minutes
    hints: ["This is the ultimate test", "Balance all requirements carefully"]
  }
};

/**
 * Calculate score for a completed level
 * @param {number} level - Level number (1-10)
 * @param {Object} design - User's design
 * @param {number} timeTaken - Time taken in seconds
 * @param {Array} objectivesCompleted - Array of completed objective IDs
 * @returns {Object} Score breakdown and total
 */
const calculateLevelScore = (level, design, timeTaken, objectivesCompleted = []) => {
  if (!LEVEL_OBJECTIVES[level]) {
    throw new Error(`Invalid level: ${level}`);
  }

  const levelData = LEVEL_OBJECTIVES[level];
  const multiplier = SCORING_RULES.levelMultipliers[level];
  
  let scoreBreakdown = {
    objectivePoints: 0,
    timeBonus: 0,
    placementBonus: 0,
    efficiencyBonus: 0,
    penalties: 0,
    multiplier: multiplier,
    total: 0
  };

  // 1. Objective completion points
  levelData.objectives.forEach(objective => {
    if (objectivesCompleted.includes(objective.id)) {
      scoreBreakdown.objectivePoints += objective.points;
    }
  });

  // 2. Time bonus calculation
  const targetTime = levelData.targetTime;
  if (timeTaken <= targetTime) {
    const timeBonus = Math.max(0, SCORING_RULES.timeBonus.maxBonus - 
      (timeTaken - targetTime) * SCORING_RULES.timeBonus.penaltyPerSecond);
    scoreBreakdown.timeBonus = Math.round(timeBonus);
  }

  // 3. Component placement bonus
  if (design && design.components) {
    scoreBreakdown.placementBonus = calculatePlacementBonus(design, level);
  }

  // 4. Efficiency bonus
  if (design) {
    scoreBreakdown.efficiencyBonus = calculateEfficiencyBonus(design, level);
  }

  // 5. Calculate penalties
  if (design) {
    scoreBreakdown.penalties = calculatePenalties(design, level);
  }

  // 6. Apply level multiplier
  const baseScore = scoreBreakdown.objectivePoints + 
                   scoreBreakdown.timeBonus + 
                   scoreBreakdown.placementBonus + 
                   scoreBreakdown.efficiencyBonus - 
                   Math.abs(scoreBreakdown.penalties);

  scoreBreakdown.total = Math.round(Math.max(0, baseScore * multiplier));

  return scoreBreakdown;
};

/**
 * Calculate placement bonus based on component positioning
 */
const calculatePlacementBonus = (design, level) => {
  let bonus = 0;
  const components = design.components || [];

  // Check for optimal component placement
  components.forEach(component => {
    // Bonus for placing components in appropriate zones
    if (isComponentWellPlaced(component, components)) {
      bonus += SCORING_RULES.basePoints.correctPlacement;
    }

    // Volume optimization bonus
    if (isComponentVolumeOptimal(component, design.crewSize || 1)) {
      bonus += SCORING_RULES.basePoints.optimalVolume;
    }
  });

  // Adjacency bonus
  bonus += calculateAdjacencyBonus(components);

  return Math.round(bonus * 0.3); // Scale down the bonus
};

/**
 * Calculate efficiency bonus
 */
const calculateEfficiencyBonus = (design, level) => {
  let bonus = 0;

  if (design.habitat && design.habitat.volume) {
    const totalComponentVolume = design.components.reduce((sum, comp) => sum + comp.volume, 0);
    const utilization = totalComponentVolume / design.habitat.volume;

    // Optimal utilization is 60-80%
    if (utilization >= 0.6 && utilization <= 0.8) {
      bonus += SCORING_RULES.basePoints.efficiencyBonus;
    } else if (utilization >= 0.5 && utilization < 0.9) {
      bonus += SCORING_RULES.basePoints.efficiencyBonus * 0.5;
    }
  }

  return Math.round(bonus * 0.2); // Scale down
};

/**
 * Calculate penalties for various violations
 */
const calculatePenalties = (design, level) => {
  let penalties = 0;
  const levelData = LEVEL_OBJECTIVES[level];

  // Missing required components
  if (levelData.requiredComponents && levelData.requiredComponents.length > 0) {
    const presentComponents = new Set(design.components.map(comp => comp.type));
    
    levelData.requiredComponents.forEach(required => {
      if (required !== 'ALL_ESSENTIALS' && !presentComponents.has(required)) {
        penalties += SCORING_RULES.penalties.missingRequired;
      }
    });
  }

  // Volume violations
  design.components.forEach(component => {
    if (!isComponentVolumeValid(component, design.crewSize || 1)) {
      penalties += SCORING_RULES.penalties.volumeViolation;
    }
  });

  // Adjacency violations
  const adjacencyViolations = countAdjacencyViolations(design.components);
  penalties += adjacencyViolations * SCORING_RULES.penalties.adjacencyViolation;

  return penalties;
};

/**
 * Check if component is well placed
 */
const isComponentWellPlaced = (component, allComponents) => {
  // Basic placement validation
  // This could be expanded with more sophisticated checks
  return component.position && 
         typeof component.position.x === 'number' &&
         typeof component.position.y === 'number' &&
         typeof component.position.z === 'number';
};

/**
 * Check if component volume is optimal
 */
const isComponentVolumeOptimal = (component, crewSize) => {
  const requirements = getVolumeRequirements(component.type);
  if (!requirements) return true;

  let optimalMin = requirements.min;
  let optimalMax = requirements.max;

  if (requirements.perCrew) {
    optimalMin *= crewSize;
    optimalMax *= crewSize;
  }

  return component.volume >= optimalMin && component.volume <= optimalMax;
};

/**
 * Check if component volume is valid (not optimal, just valid)
 */
const isComponentVolumeValid = (component, crewSize) => {
  const requirements = getVolumeRequirements(component.type);
  if (!requirements) return true;

  let minRequired = requirements.min;
  if (requirements.perCrew) {
    minRequired *= crewSize;
  }

  return component.volume >= minRequired;
};

/**
 * Calculate adjacency bonus
 */
const calculateAdjacencyBonus = (components) => {
  let bonus = 0;
  const adjacencyThreshold = 5; // meters

  // Check for beneficial adjacencies
  const beneficialPairs = [
    ['KITCHEN', 'FOOD_STORAGE'],
    ['LAB', 'WORKSTATION'],
    ['SLEEP_POD', 'SLEEP_QUARTERS'],
    ['AIRLOCK', 'EMERGENCY_KIT']
  ];

  for (const pair of beneficialPairs) {
    const comp1 = components.find(c => c.type === pair[0]);
    const comp2 = components.find(c => c.type === pair[1]);

    if (comp1 && comp2) {
      const distance = calculateDistance(comp1.position, comp2.position);
      if (distance <= adjacencyThreshold) {
        bonus += SCORING_RULES.basePoints.adjacencyBonus;
      }
    }
  }

  return bonus;
};

/**
 * Count adjacency violations
 */
const countAdjacencyViolations = (components) => {
  let violations = 0;
  const adjacencyThreshold = 5; // meters
  
  const avoidPairs = [
    ['HYGIENE', 'KITCHEN'],
    ['HYGIENE', 'FOOD_STORAGE'],
    ['EXERCISE', 'SLEEP_POD'],
    ['EXERCISE', 'SLEEP_QUARTERS']
  ];

  for (const pair of avoidPairs) {
    const comp1 = components.find(c => c.type === pair[0]);
    const comp2 = components.find(c => c.type === pair[1]);

    if (comp1 && comp2) {
      const distance = calculateDistance(comp1.position, comp2.position);
      if (distance <= adjacencyThreshold) {
        violations++;
      }
    }
  }

  return violations;
};

/**
 * Calculate distance between two positions
 */
const calculateDistance = (pos1, pos2) => {
  if (!pos1 || !pos2) return Infinity;
  
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  const dz = pos1.z - pos2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

/**
 * Get volume requirements for component type
 */
const getVolumeRequirements = (componentType) => {
  const requirements = {
    'LIFE_SUPPORT': { min: 6, max: 15, perCrew: false },
    'SLEEP_POD': { min: 2, max: 4, perCrew: true },
    'SLEEP_QUARTERS': { min: 6, max: 12, perCrew: true },
    'HYGIENE': { min: 4, max: 8, perCrew: false },
    'KITCHEN': { min: 8, max: 20, perCrew: false },
    'FOOD_STORAGE': { min: 3, max: 8, perCrew: true },
    'EXERCISE': { min: 10, max: 25, perCrew: false },
    'LAB': { min: 12, max: 40, perCrew: false },
    'WORKSTATION': { min: 2, max: 6, perCrew: true },
    'STORAGE_RACK': { min: 2, max: 8, perCrew: true },
    'AIRLOCK': { min: 8, max: 15, perCrew: false },
    'EMERGENCY_KIT': { min: 1, max: 3, perCrew: false }
  };

  return requirements[componentType];
};

/**
 * Calculate star rating based on score
 */
const calculateStarRating = (score) => {
  if (score >= SCORING_RULES.starThresholds[3]) return 3;
  if (score >= SCORING_RULES.starThresholds[2]) return 2;
  if (score >= SCORING_RULES.starThresholds[1]) return 1;
  return 0;
};

module.exports = {
  calculateLevelScore,
  calculateStarRating,
  LEVEL_OBJECTIVES,
  SCORING_RULES,
  calculatePlacementBonus,
  calculateEfficiencyBonus,
  isComponentVolumeOptimal,
  calculateAdjacencyBonus
};
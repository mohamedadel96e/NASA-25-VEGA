// Component definitions for NASA Space Habitat Design Tool
// Based on NASA specifications and space habitat requirements

const COMPONENT_LIBRARY = {
  // Life Support Systems
  'LIFE_SUPPORT': {
    id: 'LIFE_SUPPORT',
    name: 'Environmental Control System',
    category: 'critical',
    description: 'Primary life support system that maintains breathable atmosphere',
    specifications: {
      volume: { min: 6, max: 15, recommended: 10 },
      weight: { min: 800, max: 1500, recommended: 1200 }, // kg
      power: { base: 2000, perCrew: 300 }, // watts
      dimensions: {
        width: { min: 2, max: 3, recommended: 2.5 },
        height: { min: 2, max: 2.5, recommended: 2.2 },
        depth: { min: 1.5, max: 2.5, recommended: 2 }
      }
    },
    functions: ['oxygen_generation', 'co2_removal', 'air_circulation', 'humidity_control'],
    zone: 'utility',
    criticality: 'critical',
    redundancyRequired: true
  },

  'ECLSS': {
    id: 'ECLSS',
    name: 'Enhanced Life Support System',
    category: 'critical',
    description: 'Advanced Environmental Control and Life Support System',
    specifications: {
      volume: { min: 8, max: 20, recommended: 12 },
      weight: { min: 1200, max: 2000, recommended: 1600 },
      power: { base: 2500, perCrew: 400 },
      dimensions: {
        width: { min: 2.5, max: 4, recommended: 3 },
        height: { min: 2, max: 2.5, recommended: 2.2 },
        depth: { min: 2, max: 3, recommended: 2.5 }
      }
    },
    functions: ['oxygen_generation', 'co2_removal', 'water_recovery', 'air_purification', 'trace_gas_removal'],
    zone: 'utility',
    criticality: 'critical',
    redundancyRequired: true
  },

  // Habitation Components
  'SLEEP_POD': {
    id: 'SLEEP_POD',
    name: 'Individual Sleep Pod',
    category: 'essential',
    description: 'Personal sleeping compartment for one crew member',
    specifications: {
      volume: { min: 2, max: 4, recommended: 3 },
      weight: { min: 150, max: 300, recommended: 200 },
      power: { base: 50, perCrew: 0 },
      dimensions: {
        width: { min: 0.8, max: 1.2, recommended: 1 },
        height: { min: 0.8, max: 1.2, recommended: 1 },
        depth: { min: 2, max: 2.5, recommended: 2.2 }
      }
    },
    functions: ['sleeping', 'privacy', 'personal_storage'],
    zone: 'habitation',
    criticality: 'essential',
    perCrew: true
  },

  'SLEEP_QUARTERS': {
    id: 'SLEEP_QUARTERS',
    name: 'Crew Sleep Quarters',
    category: 'essential',
    description: 'Shared sleeping area with individual spaces',
    specifications: {
      volume: { min: 6, max: 12, recommended: 8 },
      weight: { min: 400, max: 800, recommended: 600 },
      power: { base: 100, perCrew: 25 },
      dimensions: {
        width: { min: 2, max: 4, recommended: 3 },
        height: { min: 2, max: 2.5, recommended: 2.2 },
        depth: { min: 2, max: 3, recommended: 2.5 }
      }
    },
    functions: ['sleeping', 'rest', 'personal_storage'],
    zone: 'habitation',
    criticality: 'essential',
    perCrew: true
  },

  'HYGIENE': {
    id: 'HYGIENE',
    name: 'Hygiene Station',
    category: 'essential',
    description: 'Bathroom and personal hygiene facilities',
    specifications: {
      volume: { min: 4, max: 8, recommended: 6 },
      weight: { min: 300, max: 600, recommended: 450 },
      power: { base: 200, perCrew: 50 },
      dimensions: {
        width: { min: 1.5, max: 2.5, recommended: 2 },
        height: { min: 2, max: 2.5, recommended: 2.2 },
        depth: { min: 1.5, max: 2, recommended: 1.8 }
      }
    },
    functions: ['waste_management', 'personal_hygiene', 'water_usage'],
    zone: 'habitation',
    criticality: 'essential',
    isolationRequired: true
  },

  // Food and Kitchen
  'KITCHEN': {
    id: 'KITCHEN',
    name: 'Food Preparation Area',
    category: 'essential',
    description: 'Cooking and food preparation facilities',
    specifications: {
      volume: { min: 8, max: 20, recommended: 12 },
      weight: { min: 600, max: 1200, recommended: 900 },
      power: { base: 1500, perCrew: 200 },
      dimensions: {
        width: { min: 2, max: 4, recommended: 3 },
        height: { min: 2, max: 2.5, recommended: 2.2 },
        depth: { min: 2, max: 3, recommended: 2.5 }
      }
    },
    functions: ['food_preparation', 'cooking', 'dining', 'dishwashing'],
    zone: 'habitation',
    criticality: 'essential',
    adjacencyPreferences: ['FOOD_STORAGE']
  },

  'FOOD_STORAGE': {
    id: 'FOOD_STORAGE',
    name: 'Food Storage',
    category: 'essential',
    description: 'Food storage and inventory management',
    specifications: {
      volume: { min: 3, max: 8, recommended: 5 },
      weight: { min: 200, max: 500, recommended: 300 },
      power: { base: 100, perCrew: 25 },
      dimensions: {
        width: { min: 1.5, max: 2.5, recommended: 2 },
        height: { min: 2, max: 2.5, recommended: 2.2 },
        depth: { min: 1, max: 2, recommended: 1.5 }
      }
    },
    functions: ['food_storage', 'inventory_tracking', 'temperature_control'],
    zone: 'storage',
    criticality: 'essential',
    perCrew: true,
    adjacencyPreferences: ['KITCHEN']
  },

  // Exercise and Health
  'EXERCISE': {
    id: 'EXERCISE',
    name: 'Exercise Area',
    category: 'essential',
    description: 'Multi-purpose exercise and fitness area',
    specifications: {
      volume: { min: 10, max: 25, recommended: 15 },
      weight: { min: 500, max: 1000, recommended: 750 },
      power: { base: 800, perCrew: 0 },
      dimensions: {
        width: { min: 3, max: 5, recommended: 4 },
        height: { min: 2.5, max: 3, recommended: 2.8 },
        depth: { min: 2, max: 4, recommended: 3 }
      }
    },
    functions: ['cardiovascular_exercise', 'strength_training', 'flexibility'],
    zone: 'operational',
    criticality: 'essential',
    ceilingHeightRequired: 2.5
  },

  'TREADMILL': {
    id: 'TREADMILL',
    name: 'Microgravity Treadmill',
    category: 'essential',
    description: 'Treadmill for cardiovascular exercise in microgravity',
    specifications: {
      volume: { min: 4, max: 8, recommended: 6 },
      weight: { min: 300, max: 600, recommended: 450 },
      power: { base: 400, perCrew: 0 },
      dimensions: {
        width: { min: 1, max: 1.5, recommended: 1.2 },
        height: { min: 1.5, max: 2, recommended: 1.8 },
        depth: { min: 2.5, max: 3.5, recommended: 3 }
      }
    },
    functions: ['cardiovascular_exercise', 'bone_density_maintenance'],
    zone: 'operational',
    criticality: 'essential'
  },

  'RESISTANCE_TRAINER': {
    id: 'RESISTANCE_TRAINER',
    name: 'Resistance Exercise Device',
    category: 'essential',
    description: 'Resistance training equipment for muscle maintenance',
    specifications: {
      volume: { min: 3, max: 6, recommended: 4 },
      weight: { min: 200, max: 400, recommended: 300 },
      power: { base: 200, perCrew: 0 },
      dimensions: {
        width: { min: 1.5, max: 2, recommended: 1.8 },
        height: { min: 2, max: 2.5, recommended: 2.2 },
        depth: { min: 1, max: 1.5, recommended: 1.2 }
      }
    },
    functions: ['strength_training', 'muscle_maintenance'],
    zone: 'operational',
    criticality: 'essential'
  },

  // Work and Research
  'LAB': {
    id: 'LAB',
    name: 'Research Laboratory',
    category: 'operational',
    description: 'Multi-purpose laboratory for scientific research',
    specifications: {
      volume: { min: 12, max: 40, recommended: 20 },
      weight: { min: 800, max: 2000, recommended: 1200 },
      power: { base: 1200, perCrew: 150 },
      dimensions: {
        width: { min: 3, max: 6, recommended: 4 },
        height: { min: 2.2, max: 2.8, recommended: 2.5 },
        depth: { min: 2, max: 4, recommended: 3 }
      }
    },
    functions: ['scientific_research', 'experiments', 'sample_analysis'],
    zone: 'work',
    criticality: 'operational',
    cleanEnvironmentRequired: true
  },

  'WORKSTATION': {
    id: 'WORKSTATION',
    name: 'Individual Workstation',
    category: 'operational',
    description: 'Personal workspace for crew members',
    specifications: {
      volume: { min: 2, max: 6, recommended: 4 },
      weight: { min: 100, max: 300, recommended: 200 },
      power: { base: 200, perCrew: 50 },
      dimensions: {
        width: { min: 1.2, max: 2, recommended: 1.5 },
        height: { min: 2, max: 2.5, recommended: 2.2 },
        depth: { min: 0.8, max: 1.5, recommended: 1.2 }
      }
    },
    functions: ['computer_work', 'communications', 'planning'],
    zone: 'work',
    criticality: 'operational',
    perCrew: true
  },

  // Storage and Logistics
  'STORAGE_RACK': {
    id: 'STORAGE_RACK',
    name: 'Storage Rack System',
    category: 'operational',
    description: 'Modular storage for supplies and equipment',
    specifications: {
      volume: { min: 2, max: 8, recommended: 4 },
      weight: { min: 100, max: 400, recommended: 200 },
      power: { base: 0, perCrew: 0 },
      dimensions: {
        width: { min: 1, max: 2, recommended: 1.5 },
        height: { min: 2, max: 2.5, recommended: 2.2 },
        depth: { min: 0.5, max: 1.5, recommended: 1 }
      }
    },
    functions: ['general_storage', 'organization', 'inventory'],
    zone: 'storage',
    criticality: 'operational',
    perCrew: true
  },

  'CARGO_BAY': {
    id: 'CARGO_BAY',
    name: 'Cargo Bay',
    category: 'operational',
    description: 'Large storage area for mission supplies',
    specifications: {
      volume: { min: 10, max: 50, recommended: 25 },
      weight: { min: 300, max: 1000, recommended: 600 },
      power: { base: 100, perCrew: 0 },
      dimensions: {
        width: { min: 2, max: 5, recommended: 3.5 },
        height: { min: 2, max: 3, recommended: 2.5 },
        depth: { min: 2, max: 5, recommended: 3 }
      }
    },
    functions: ['bulk_storage', 'mission_supplies', 'equipment_storage'],
    zone: 'storage',
    criticality: 'operational'
  },

  // Safety and Emergency
  'AIRLOCK': {
    id: 'AIRLOCK',
    name: 'Airlock System',
    category: 'critical',
    description: 'Entry/exit system for EVA operations',
    specifications: {
      volume: { min: 8, max: 15, recommended: 10 },
      weight: { min: 1000, max: 2000, recommended: 1500 },
      power: { base: 500, perCrew: 0 },
      dimensions: {
        width: { min: 2, max: 3, recommended: 2.5 },
        height: { min: 2.2, max: 2.8, recommended: 2.5 },
        depth: { min: 1.5, max: 2.5, recommended: 2 }
      }
    },
    functions: ['eva_operations', 'emergency_exit', 'decontamination'],
    zone: 'emergency',
    criticality: 'critical',
    redundancyRequired: false // Usually only one needed
  },

  'EMERGENCY_KIT': {
    id: 'EMERGENCY_KIT',
    name: 'Emergency Equipment',
    category: 'critical',
    description: 'Emergency supplies and safety equipment',
    specifications: {
      volume: { min: 1, max: 3, recommended: 2 },
      weight: { min: 50, max: 150, recommended: 100 },
      power: { base: 0, perCrew: 0 },
      dimensions: {
        width: { min: 0.5, max: 1, recommended: 0.8 },
        height: { min: 1, max: 1.5, recommended: 1.2 },
        depth: { min: 0.5, max: 1, recommended: 0.8 }
      }
    },
    functions: ['emergency_response', 'first_aid', 'evacuation'],
    zone: 'emergency',
    criticality: 'critical',
    accessibilityRequired: true
  },

  'MEDICAL_BAY': {
    id: 'MEDICAL_BAY',
    name: 'Medical Bay',
    category: 'essential',
    description: 'Medical treatment and health monitoring facility',
    specifications: {
      volume: { min: 6, max: 15, recommended: 10 },
      weight: { min: 400, max: 800, recommended: 600 },
      power: { base: 600, perCrew: 100 },
      dimensions: {
        width: { min: 2, max: 3, recommended: 2.5 },
        height: { min: 2.2, max: 2.8, recommended: 2.5 },
        depth: { min: 2, max: 3, recommended: 2.5 }
      }
    },
    functions: ['medical_treatment', 'health_monitoring', 'surgery'],
    zone: 'essential',
    criticality: 'essential',
    cleanEnvironmentRequired: true
  },

  // Communication and Systems
  'COMMUNICATION': {
    id: 'COMMUNICATION',
    name: 'Communication Hub',
    category: 'essential',
    description: 'Communication systems and data management',
    specifications: {
      volume: { min: 2, max: 6, recommended: 4 },
      weight: { min: 200, max: 500, recommended: 350 },
      power: { base: 500, perCrew: 0 },
      dimensions: {
        width: { min: 1.5, max: 2.5, recommended: 2 },
        height: { min: 2, max: 2.5, recommended: 2.2 },
        depth: { min: 1, max: 1.5, recommended: 1.2 }
      }
    },
    functions: ['earth_communication', 'data_transmission', 'navigation'],
    zone: 'operational',
    criticality: 'essential',
    redundancyRequired: true
  },

  'MAINTENANCE': {
    id: 'MAINTENANCE',
    name: 'Maintenance Workshop',
    category: 'operational',
    description: 'Tools and workspace for habitat maintenance',
    specifications: {
      volume: { min: 4, max: 12, recommended: 8 },
      weight: { min: 300, max: 800, recommended: 500 },
      power: { base: 400, perCrew: 0 },
      dimensions: {
        width: { min: 2, max: 3, recommended: 2.5 },
        height: { min: 2, max: 2.5, recommended: 2.2 },
        depth: { min: 1.5, max: 2.5, recommended: 2 }
      }
    },
    functions: ['repair', 'maintenance', 'tool_storage'],
    zone: 'operational',
    criticality: 'operational'
  }
};

// Component categories for easy filtering
const COMPONENT_CATEGORIES = {
  critical: ['LIFE_SUPPORT', 'ECLSS', 'AIRLOCK', 'EMERGENCY_KIT'],
  essential: ['SLEEP_POD', 'SLEEP_QUARTERS', 'HYGIENE', 'KITCHEN', 'FOOD_STORAGE', 'EXERCISE', 'TREADMILL', 'RESISTANCE_TRAINER', 'MEDICAL_BAY', 'COMMUNICATION'],
  operational: ['LAB', 'WORKSTATION', 'STORAGE_RACK', 'CARGO_BAY', 'MAINTENANCE']
};

// Zone mappings
const COMPONENT_ZONES = {
  utility: ['LIFE_SUPPORT', 'ECLSS'],
  habitation: ['SLEEP_POD', 'SLEEP_QUARTERS', 'HYGIENE', 'KITCHEN'],
  storage: ['FOOD_STORAGE', 'STORAGE_RACK', 'CARGO_BAY'],
  operational: ['EXERCISE', 'TREADMILL', 'RESISTANCE_TRAINER', 'COMMUNICATION', 'MAINTENANCE'],
  work: ['LAB', 'WORKSTATION'],
  emergency: ['AIRLOCK', 'EMERGENCY_KIT'],
  essential: ['MEDICAL_BAY']
};

// Get component by ID
const getComponent = (componentId) => {
  return COMPONENT_LIBRARY[componentId] || null;
};

// Get components by category
const getComponentsByCategory = (category) => {
  return Object.values(COMPONENT_LIBRARY).filter(comp => comp.category === category);
};

// Get components by zone
const getComponentsByZone = (zone) => {
  return Object.values(COMPONENT_LIBRARY).filter(comp => comp.zone === zone);
};

// Check if component requires per-crew scaling
const isPerCrewComponent = (componentId) => {
  const component = getComponent(componentId);
  return component ? component.perCrew === true : false;
};

// Get recommended volume for component based on crew size
const getRecommendedVolume = (componentId, crewSize = 1) => {
  const component = getComponent(componentId);
  if (!component) return 0;
  
  const baseVolume = component.specifications.volume.recommended;
  return component.perCrew ? baseVolume * crewSize : baseVolume;
};

// Get power requirements for component
const getPowerRequirement = (componentId, crewSize = 1) => {
  const component = getComponent(componentId);
  if (!component) return 0;
  
  const { base, perCrew } = component.specifications.power;
  return base + (perCrew * crewSize);
};

module.exports = {
  COMPONENT_LIBRARY,
  COMPONENT_CATEGORIES,
  COMPONENT_ZONES,
  getComponent,
  getComponentsByCategory,
  getComponentsByZone,
  isPerCrewComponent,
  getRecommendedVolume,
  getPowerRequirement
};
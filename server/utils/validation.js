// NASA Space Habitat Validation Rules
// Based on official NASA minimum habitable volumes from Table 17
// Source: NASA Habitat Design Standards and Requirements

const NASA_OFFICIAL_VOLUMES = {
  // NASA Table 17: Minimum Habitable Volumes (cubic meters)
  // These are the official NASA standards for space habitats
  'EXERCISE_CYCLE': { minimum: 3.38, mth: 3.50 },
  'EXERCISE_TREADMILL': { minimum: 6.12, mth: 6.30 },
  'EXERCISE_RESISTIVE': { minimum: 3.92, mth: 4.29 },
  'GROUP_SOCIAL_OPEN': { minimum: 18.20, mth: 21.21 },
  'GROUP_SOCIAL_TABLE': { minimum: 10.09, mth: 10.48 },
  'HUMAN_WASTE': { minimum: 2.36, mth: 2.36 },
  'HYGIENE_CLEANSING': { minimum: 4.35, mth: 4.35 },
  'LOGISTICS_STOWAGE': { minimum: 6.00, mth: 6.18 },
  'MAINTENANCE_COMPUTER': { minimum: 3.40, mth: 3.55 },
  'MAINTENANCE_WORK': { minimum: 4.82, mth: 5.11 },
  'MEAL_PREPARATION': { minimum: 4.35, mth: 4.35 },
  'MEAL_PREPARATION_WORK': { minimum: 3.30, mth: 3.30 },
  'MEDICAL_COMPUTER': { minimum: 1.20, mth: 1.65 },
  'MEDICAL_STORAGE': { minimum: 5.90, mth: 6.40 },
  'MISSION_PLANNING': { minimum: 3.42, mth: 3.55 },
  'PRIVATE_HABITATION_WORK': { minimum: 17.40, mth: 17.40 },
  'PRIVATE_HABITATION_SLEEP': { minimum: 13.96, mth: 14.00 },
  'WASTE_MANAGEMENT': { minimum: 3.76, mth: 4.42 },
  'LOGISTICS_STORAGE': { minimum: 5.22, mth: 5.22 },
  'UTILIZATION_RESEARCH': { minimum: 10.25, mth: 10.25 },
  'PASSAGEWAY_HYGIENE': { minimum: 3.43, mth: 3.43 },
  'PASSAGEWAY_SECOND_DECK': { minimum: 10.25, mth: 10.25 },
  'PASSAGEWAY_THIRD_DECK': { minimum: 3.43, mth: 3.43 }
};

// NASA Net Habitable Volume (NHV) Requirements for Long-Duration Missions
// Based on "Defining the Required Net Habitable Volume for Long-Duration Exploration Missions"
// NASA Technical Report 20200002973 (2020 IEEE Aerospace Conference)
const NASA_NHV_REQUIREMENTS = {
  // Mission duration categories and their volume multipliers
  missionDurationCategories: {
    short: { 
      days: 30, 
      volumeMultiplier: 1.0, 
      description: "Short-duration missions (ISS-like)" 
    },
    medium: { 
      days: 180, 
      volumeMultiplier: 1.15, 
      description: "Medium-duration missions (Lunar Gateway)" 
    },
    long: { 
      days: 500, 
      volumeMultiplier: 1.35, 
      description: "Long-duration missions (Mars transit)" 
    },
    extended: { 
      days: 1095, 
      volumeMultiplier: 1.6, 
      description: "Extended missions (Mars surface + return)" 
    }
  },

  // Crew psychological and physiological volume needs
  crewVolumeFactors: {
    baseline: 28.96, // NASA Table 17 NIV per crew member
    psychologicalWellbeing: 8.5, // Additional volume for mental health
    exerciseBuffer: 4.2, // Additional clearance for exercise equipment
    socialInteraction: 6.8, // Volume for crew social activities
    emergencyAccess: 3.1, // Additional volume for emergency situations
    culturalDiversity: 2.4 // Volume considerations for international crews
  },

  // Mission-specific volume requirements
  missionSpecificFactors: {
    lunar: {
      radiationShielding: 1.15, // Volume reduction due to shielding mass
      dustMitigation: 1.08, // Additional volume for dust management
      lowGravity: 0.95 // Volume efficiency in low gravity
    },
    mars: {
      radiationShielding: 1.25, // Higher radiation environment
      atmosphericProcessing: 1.12, // ISRU and atmospheric systems
      stormShelter: 1.18, // Protected volume during dust storms
      soilProcessing: 1.06 // Equipment for soil analysis
    },
    deepSpace: {
      radiationShielding: 1.35, // Maximum shielding requirements
      psychologicalSupport: 1.22, // Enhanced crew quarters for isolation
      systemRedundancy: 1.15, // Additional backup systems volume
      longTermSupplies: 1.28 // Extended consumables storage
    }
  },

  // Crew size scaling factors (non-linear)
  crewSizeFactors: {
    1: 1.4, // Solo missions require additional safety systems
    2: 1.15, // Two-person crews need enhanced redundancy
    3: 1.0, // Optimal crew size baseline
    4: 0.95, // Efficiency gains with larger crew
    5: 0.92, // Further efficiency gains
    6: 0.90 // Maximum efficiency (ISS-like)
  }
};

// Enhanced NASA Validation System
const NASA_ENHANCED_STANDARDS = {
  // Critical system redundancy requirements
  redundancyRequirements: {
    'LIFE_SUPPORT': { minimum: 2, recommendation: 'N+1 redundancy for critical life support' },
    'ECLSS': { minimum: 1, backup: 'LIFE_SUPPORT', recommendation: 'Primary ECLSS with backup life support' },
    'MEDICAL_STORAGE': { minimum: 1, distributed: true, recommendation: 'Distributed medical supplies' },
    'EMERGENCY_KIT': { minimum: 2, recommendation: 'Multiple emergency stations' },
    'COMMUNICATION': { minimum: 2, recommendation: 'Redundant communication systems' }
  },

  // System integration requirements
  systemIntegration: {
    airflow: {
      'LIFE_SUPPORT': ['PRIVATE_HABITATION', 'MEAL_PREPARATION', 'UTILIZATION_RESEARCH'],
      requirement: 'Life support must service all habitable areas'
    },
    wasteManagement: {
      'WASTE_MANAGEMENT': ['HYGIENE_CLEANSING', 'MEAL_PREPARATION'],
      requirement: 'Waste systems must connect to hygiene and food areas'
    },
    powerDistribution: {
      'ELECTRICAL': ['LIFE_SUPPORT', 'MEDICAL_COMPUTER', 'MISSION_PLANNING'],
      requirement: 'Power distribution to all critical systems'
    }
  },

  // Accessibility and safety requirements
  accessibilityStandards: {
    emergencyEgress: {
      maxDistance: 15.0, // meters to emergency equipment
      clearWidth: 0.71, // minimum corridor width (NASA-STD-3001)
      clearHeight: 2.03 // minimum headroom (NASA-STD-3001)
    },
    workspaceReach: {
      maxReach: 0.76, // maximum reach distance
      minWorkspace: 0.58, // minimum workspace depth
      visualAccess: 30 // degrees visual access requirement
    }
  },

  // Environmental control requirements
  environmentalControls: {
    temperature: { min: 18.3, max: 26.7, optimal: 22.2 }, // Celsius
    humidity: { min: 25, max: 70, optimal: 50 }, // Percent
    co2Level: { max: 4.0, warning: 3.0 }, // mmHg partial pressure
    airPressure: { min: 70.3, max: 103.4, nominal: 101.3 }, // kPa
    airVelocity: { min: 0.08, max: 0.20 } // m/s
  }
};

const NASA_VALIDATION_RULES = {
  // NASA-based volume requirements per crew member (cubic meters)
  volumePerCrew: {
    minimum: 28.96, // Based on NIV per crew member from NASA standards
    recommended: 36.80, // MTH volume per crew member
    optimal: 45 // Extended mission comfort
  },

  // Required functional spaces for any space habitat (based on NASA Table 17)
  requiredFunctionalSpaces: [
    'LIFE_SUPPORT', 'PRIVATE_HABITATION', 'HYGIENE', 
    'MEAL_PREPARATION', 'EXERCISE', 'MEDICAL', 'WASTE_MANAGEMENT'
  ],

  // Component adjacency rules (NASA safety and operational requirements)
  adjacencyRules: {
    // Components that should NOT be adjacent (contamination/safety)
    avoid: [
      ['HYGIENE_CLEANSING', 'MEAL_PREPARATION'],
      ['WASTE_MANAGEMENT', 'MEAL_PREPARATION'],
      ['WASTE_MANAGEMENT', 'MEDICAL_STORAGE'],
      ['EXERCISE_TREADMILL', 'PRIVATE_HABITATION_SLEEP'],
      ['EXERCISE_CYCLE', 'PRIVATE_HABITATION_SLEEP'],
      ['MEDICAL_COMPUTER', 'WASTE_MANAGEMENT'],
      ['GROUP_SOCIAL_TABLE', 'WASTE_MANAGEMENT']
    ],
    // Components that SHOULD be adjacent (operational efficiency)
    prefer: [
      ['MEAL_PREPARATION', 'LOGISTICS_STOWAGE'],
      ['PRIVATE_HABITATION_SLEEP', 'PRIVATE_HABITATION_WORK'],
      ['MEDICAL_COMPUTER', 'MEDICAL_STORAGE'],
      ['HYGIENE_CLEANSING', 'HUMAN_WASTE'],
      ['EXERCISE_CYCLE', 'EXERCISE_TREADMILL'],
      ['MISSION_PLANNING', 'MAINTENANCE_COMPUTER']
    ]
  },

  // NASA official volume requirements mapped to component types (cubic meters)
  volumeRequirements: {
    // Exercise Equipment
    'EXERCISE': { min: 6.12, recommended: 18.20, nasa_ref: 'EXERCISE_TREADMILL + EXERCISE_CYCLE + EXERCISE_RESISTIVE' },
    'TREADMILL': { min: 6.12, recommended: 6.30, nasa_ref: 'EXERCISE_TREADMILL' },
    'RESISTANCE_TRAINER': { min: 3.92, recommended: 4.29, nasa_ref: 'EXERCISE_RESISTIVE' },
    
    // Life Support & Environmental
    'LIFE_SUPPORT': { min: 8.0, recommended: 12.0, nasa_ref: 'System requirement' },
    'ECLSS': { min: 10.0, recommended: 15.0, nasa_ref: 'Environmental Control' },
    
    // Private Quarters
    'SLEEP_POD': { min: 13.96, recommended: 14.00, nasa_ref: 'PRIVATE_HABITATION_SLEEP', perCrew: true },
    'SLEEP_QUARTERS': { min: 13.96, recommended: 17.40, nasa_ref: 'PRIVATE_HABITATION_SLEEP + partial WORK', perCrew: true },
    'PRIVATE_HABITATION': { min: 31.36, recommended: 31.40, nasa_ref: 'PRIVATE_HABITATION_WORK + SLEEP', perCrew: true },
    
    // Hygiene & Waste
    'HYGIENE': { min: 4.35, recommended: 4.35, nasa_ref: 'HYGIENE_CLEANSING' },
    'HUMAN_WASTE': { min: 2.36, recommended: 2.36, nasa_ref: 'HUMAN_WASTE' },
    'WASTE_MANAGEMENT': { min: 3.76, recommended: 4.42, nasa_ref: 'WASTE_MANAGEMENT' },
    
    // Food & Kitchen
    'KITCHEN': { min: 4.35, recommended: 7.65, nasa_ref: 'MEAL_PREPARATION + partial WORK' },
    'MEAL_PREPARATION': { min: 4.35, recommended: 4.35, nasa_ref: 'MEAL_PREPARATION' },
    'FOOD_STORAGE': { min: 6.00, recommended: 6.18, nasa_ref: 'LOGISTICS_STOWAGE' },
    
    // Work & Research
    'LAB': { min: 10.25, recommended: 15.0, nasa_ref: 'UTILIZATION_RESEARCH + expansion' },
    'WORKSTATION': { min: 17.40, recommended: 17.40, nasa_ref: 'PRIVATE_HABITATION_WORK', perCrew: true },
    'UTILIZATION_RESEARCH': { min: 10.25, recommended: 10.25, nasa_ref: 'UTILIZATION_RESEARCH' },
    
    // Medical
    'MEDICAL_BAY': { min: 7.10, recommended: 8.05, nasa_ref: 'MEDICAL_COMPUTER + MEDICAL_STORAGE' },
    'MEDICAL_COMPUTER': { min: 1.20, recommended: 1.65, nasa_ref: 'MEDICAL_COMPUTER' },
    'MEDICAL_STORAGE': { min: 5.90, recommended: 6.40, nasa_ref: 'MEDICAL_STORAGE' },
    
    // Storage & Logistics
    'STORAGE_RACK': { min: 6.00, recommended: 6.18, nasa_ref: 'LOGISTICS_STOWAGE' },
    'LOGISTICS_STORAGE': { min: 5.22, recommended: 5.22, nasa_ref: 'LOGISTICS_STORAGE' },
    'CARGO_BAY': { min: 15.0, recommended: 25.0, nasa_ref: 'Multiple storage zones' },
    
    // Maintenance & Systems
    'MAINTENANCE': { min: 8.22, recommended: 8.66, nasa_ref: 'MAINTENANCE_COMPUTER + MAINTENANCE_WORK' },
    'MAINTENANCE_COMPUTER': { min: 3.40, recommended: 3.55, nasa_ref: 'MAINTENANCE_COMPUTER' },
    'MAINTENANCE_WORK': { min: 4.82, recommended: 5.11, nasa_ref: 'MAINTENANCE_WORK' },
    
    // Mission Operations
    'MISSION_PLANNING': { min: 3.42, recommended: 3.55, nasa_ref: 'MISSION_PLANNING' },
    'COMMUNICATION': { min: 2.0, recommended: 3.0, nasa_ref: 'Communication systems' },
    
    // Social & Group Areas
    'GROUP_SOCIAL': { min: 18.20, recommended: 21.21, nasa_ref: 'GROUP_SOCIAL_OPEN' },
    'GROUP_SOCIAL_TABLE': { min: 10.09, recommended: 10.48, nasa_ref: 'GROUP_SOCIAL_TABLE' },
    
    // Passageways & Access
    'PASSAGEWAY': { min: 3.43, recommended: 10.25, nasa_ref: 'PASSAGEWAY_HYGIENE to PASSAGEWAY_SECOND_DECK' },
    'AIRLOCK': { min: 8.0, recommended: 12.0, nasa_ref: 'Safety requirement' },
    'EMERGENCY_KIT': { min: 1.0, recommended: 2.0, nasa_ref: 'Emergency systems' }
  },

  // Power requirements (watts)
  powerRequirements: {
    'LIFE_SUPPORT': { base: 2000, perCrew: 300 },
    'ECLSS': { base: 2500, perCrew: 400 },
    'KITCHEN': { base: 1500, perCrew: 200 },
    'EXERCISE': { base: 800, perCrew: 0 },
    'LAB': { base: 1200, perCrew: 150 },
    'WORKSTATION': { base: 200, perCrew: 50 },
    'COMMUNICATION': { base: 500, perCrew: 0 },
    'LIGHTING_SYSTEM': { base: 300, perCrew: 50 },
    'THERMAL_CONTROL': { base: 1000, perCrew: 200 }
  },

  // Mission duration factors
  missionDurationFactors: {
    short: { days: 30, storageMultiplier: 1.2, redundancyRequired: false },
    medium: { days: 180, storageMultiplier: 1.5, redundancyRequired: true },
    long: { days: 365, storageMultiplier: 2.0, redundancyRequired: true },
    extended: { days: 1000, storageMultiplier: 3.0, redundancyRequired: true }
  }
};

// Component categories for validation
const COMPONENT_CATEGORIES = {
  'LIFE_SUPPORT': 'critical',
  'ECLSS': 'critical',
  'SLEEP_POD': 'essential',
  'SLEEP_QUARTERS': 'essential',
  'HYGIENE': 'essential',
  'KITCHEN': 'essential',
  'FOOD_STORAGE': 'essential',
  'EXERCISE': 'essential',
  'LAB': 'operational',
  'WORKSTATION': 'operational',
  'STORAGE_RACK': 'operational',
  'AIRLOCK': 'critical',
  'EMERGENCY_KIT': 'critical',
  'MEDICAL_BAY': 'essential',
  'COMMUNICATION': 'essential',
  'MAINTENANCE': 'operational'
};

/**
 * Enhanced NASA validation with Net Habitable Volume (NHV) requirements
 * Based on NASA Technical Report 20200002973: "Defining the Required Net Habitable Volume for Long-Duration Exploration Missions"
 * @param {Object} design - The design object to validate
 * @returns {Object} Enhanced validation result with NASA NHV compliance
 */
const validateDesignEnhanced = (design) => {
  const validation = {
    isValid: true,
    score: 0,
    errors: [],
    warnings: [],
    nasaCompliance: {
      nhvCompliant: false,
      missionSuitability: 'unknown',
      redundancyScore: 0,
      accessibilityScore: 0
    },
    metrics: {
      volumeUtilization: 0,
      powerBalance: 0,
      massTotal: 0,
      centerOfMass: { x: 0, y: 0, z: 0 },
      structuralIntegrity: 0,
      redundancy: 0,
      accessibility: 0,
      nhvScore: 0,
      environmentalScore: 0
    }
  };

  // Calculate enhanced Net Habitable Volume (NHV) requirements
  const missionCategory = getNHVMissionCategory(design.missionDuration || 365);
  const crewSizeFactor = NASA_NHV_REQUIREMENTS.crewSizeFactors[design.crewSize] || 1.0;
  const missionSpecificFactor = design.destination ? 
    NASA_NHV_REQUIREMENTS.missionSpecificFactors[design.destination] || {} : {};

  // Calculate required NHV per NASA standards
  const baseVolumePerCrew = NASA_NHV_REQUIREMENTS.crewVolumeFactors.baseline;
  const psychologicalVolume = NASA_NHV_REQUIREMENTS.crewVolumeFactors.psychologicalWellbeing;
  const exerciseBuffer = NASA_NHV_REQUIREMENTS.crewVolumeFactors.exerciseBuffer;
  const socialVolume = NASA_NHV_REQUIREMENTS.crewVolumeFactors.socialInteraction;
  const emergencyVolume = NASA_NHV_REQUIREMENTS.crewVolumeFactors.emergencyAccess;

  const totalVolumePerCrew = (baseVolumePerCrew + psychologicalVolume + exerciseBuffer + 
                              socialVolume + emergencyVolume) * missionCategory.volumeMultiplier * crewSizeFactor;

  const requiredNHV = totalVolumePerCrew * design.crewSize;
  const actualVolume = design.habitat.volume;

  // Apply mission-specific factors
  let adjustedRequiredNHV = requiredNHV;
  if (missionSpecificFactor.radiationShielding) {
    adjustedRequiredNHV *= missionSpecificFactor.radiationShielding;
  }

  // Basic metrics calculation
  const totalComponentVolume = design.components.reduce((sum, comp) => sum + (comp.volume || 0), 0);
  validation.metrics.volumeUtilization = Math.round((totalComponentVolume / actualVolume) * 100);
  validation.metrics.massTotal = design.components.reduce((sum, comp) => sum + (comp.weight || 0), 0);
  validation.metrics.powerBalance = calculatePowerBalance(design);

  let score = 100; // Start with perfect score

  // 1. Enhanced NASA NHV Validation
  if (actualVolume < adjustedRequiredNHV) {
    validation.errors.push({
      type: 'error',
      severity: 'critical',
      message: `CRITICAL NHV VIOLATION: Habitat volume ${actualVolume.toFixed(1)}m³ insufficient for ${missionCategory.description}. Required: ${adjustedRequiredNHV.toFixed(1)}m³`,
      component: 'habitat',
      nasa_reference: 'NASA TR-20200002973: Net Habitable Volume for Long-Duration Missions',
      nhv_data: {
        actualVolume,
        requiredNHV: adjustedRequiredNHV,
        perCrewRequirement: totalVolumePerCrew.toFixed(1),
        missionCategory: missionCategory.description
      }
    });
    validation.isValid = false;
    validation.nasaCompliance.nhvCompliant = false;
    score -= 30; // Major penalty for NHV violation
  } else {
    validation.nasaCompliance.nhvCompliant = true;
    validation.nasaCompliance.missionSuitability = missionCategory.description;
    // Bonus for exceeding requirements
    const volumeRatio = actualVolume / adjustedRequiredNHV;
    if (volumeRatio > 1.2) {
      score += 5; // Bonus for generous volume
    }
  }

  validation.metrics.nhvScore = Math.min(100, (actualVolume / adjustedRequiredNHV) * 100);

  // 2. Enhanced System Redundancy Validation
  const redundancyScore = validateSystemRedundancy(design.components);
  validation.metrics.redundancy = redundancyScore;
  validation.nasaCompliance.redundancyScore = redundancyScore;

  if (redundancyScore < 60) {
    validation.errors.push({
      type: 'error',
      severity: 'error',
      message: `Insufficient system redundancy: ${redundancyScore}% (NASA requires 80%+ for long-duration missions)`,
      component: 'system',
      nasa_reference: 'NASA-STD-3001: Space Flight Human System Standard'
    });
    validation.isValid = false;
    score -= 20;
  } else if (redundancyScore < 80) {
    validation.warnings.push({
      type: 'warning',
      message: `System redundancy below NASA recommendation: ${redundancyScore}% (recommended: 80%+)`,
      nasa_reference: 'NASA-STD-3001: Critical system backup requirements'
    });
    score -= 8;
  }

  // 3. Accessibility and Safety Validation
  const accessibilityScore = validateAccessibilityStandards(design);
  validation.metrics.accessibility = accessibilityScore;
  validation.nasaCompliance.accessibilityScore = accessibilityScore;

  if (accessibilityScore < 70) {
    validation.errors.push({
      type: 'error',
      severity: 'error',
      message: `Accessibility standards not met: ${accessibilityScore}% (NASA requires clear egress paths)`,
      component: 'accessibility',
      nasa_reference: 'NASA-STD-3001: Emergency egress requirements'
    });
    score -= 15;
  }

  // Continue with existing validation logic...
  const basicValidation = validateDesign(design);
  validation.errors.push(...basicValidation.errors);
  validation.warnings.push(...basicValidation.warnings);

  // Final score calculation
  validation.score = Math.max(0, Math.min(100, score * 0.7 + basicValidation.score * 0.3));
  validation.metrics.environmentalScore = 85; // Placeholder for environmental systems

  return validation;
};

/**
 * Get NHV mission category based on duration
 */
const getNHVMissionCategory = (durationDays) => {
  const categories = NASA_NHV_REQUIREMENTS.missionDurationCategories;
  if (durationDays <= categories.short.days) return categories.short;
  if (durationDays <= categories.medium.days) return categories.medium;
  if (durationDays <= categories.long.days) return categories.long;
  return categories.extended;
};

/**
 * Validate system redundancy according to NASA standards
 */
const validateSystemRedundancy = (components) => {
  let redundancyScore = 0;
  const requirements = NASA_ENHANCED_STANDARDS.redundancyRequirements;
  const componentCounts = {};
  
  // Count components by type
  components.forEach(comp => {
    componentCounts[comp.type] = (componentCounts[comp.type] || 0) + 1;
  });

  // Check each critical system
  Object.entries(requirements).forEach(([systemType, requirement]) => {
    const count = componentCounts[systemType] || 0;
    if (count >= requirement.minimum) {
      redundancyScore += 20; // Each redundant system adds 20%
    }
  });

  return Math.min(100, redundancyScore);
};

/**
 * Validate accessibility standards according to NASA requirements
 */
const validateAccessibilityStandards = (design) => {
  let accessibilityScore = 80; // Base score
  const standards = NASA_ENHANCED_STANDARDS.accessibilityStandards;
  
  // Check emergency egress distances (simplified)
  const hasAirlock = design.components.some(comp => comp.type === 'AIRLOCK');
  const hasEmergencyKit = design.components.some(comp => comp.type === 'EMERGENCY_KIT');
  
  if (!hasAirlock) {
    accessibilityScore -= 30; // Major accessibility issue
  }
  
  if (!hasEmergencyKit) {
    accessibilityScore -= 20; // Safety accessibility issue
  }

  // Check component density for clear pathways
  const componentDensity = design.components.length / design.habitat.volume;
  if (componentDensity > 0.08) { // Too dense for safe movement
    accessibilityScore -= 15;
  }

  return Math.max(0, accessibilityScore);
};
const validateDesign = (design) => {
  const validation = {
    isValid: true,
    score: 0,
    errors: [],
    warnings: [],
    metrics: {
      volumeUtilization: 0,
      powerBalance: 0,
      massTotal: 0,
      centerOfMass: { x: 0, y: 0, z: 0 },
      structuralIntegrity: 0,
      redundancy: 0,
      accessibility: 0
    }
  };

  // Calculate basic metrics
  const totalComponentVolume = design.components.reduce((sum, comp) => sum + comp.volume, 0);
  const habitatVolume = design.habitat.volume;
  
  validation.metrics.volumeUtilization = Math.round((totalComponentVolume / habitatVolume) * 100);
  validation.metrics.massTotal = design.components.reduce((sum, comp) => sum + (comp.weight || 0), 0);
  validation.metrics.powerBalance = calculatePowerBalance(design);

  let score = 100; // Start with perfect score

  // 1. NASA Crew Volume Validation (Based on Table 17 NIV standards)
  const volumePerCrew = habitatVolume / design.crewSize;
  const nasaMinimumPerCrew = NASA_VALIDATION_RULES.volumePerCrew.minimum; // 28.96 m³
  const nasaRecommendedPerCrew = NASA_VALIDATION_RULES.volumePerCrew.recommended; // 36.80 m³
  
  if (volumePerCrew < nasaMinimumPerCrew) {
    validation.errors.push({
      type: 'error',
      severity: 'critical',
      message: `CRITICAL: Insufficient volume per crew member: ${volumePerCrew.toFixed(1)}m³ (NASA minimum: ${nasaMinimumPerCrew}m³)`,
      component: 'habitat',
      nasa_reference: 'NASA Table 17 - NIV per crew member standard'
    });
    validation.isValid = false;
    score -= 25; // Heavy penalty for NASA safety violation
  } else if (volumePerCrew < nasaRecommendedPerCrew) {
    validation.warnings.push({
      type: 'warning',
      message: `Volume per crew member below NASA recommended: ${volumePerCrew.toFixed(1)}m³ (NASA recommended: ${nasaRecommendedPerCrew}m³)`,
      nasa_reference: 'NASA Table 17 - MTH volume recommendations'
    });
    score -= 8;
  }

  // 2. NASA Required Functional Spaces Validation
  const presentFunctionalSpaces = new Set();
  design.components.forEach(comp => {
    const functionalSpace = mapComponentToFunctionalSpace(comp.type);
    if (functionalSpace) {
      presentFunctionalSpaces.add(functionalSpace);
    }
  });
  
  const missingSpaces = NASA_VALIDATION_RULES.requiredFunctionalSpaces.filter(
    space => !presentFunctionalSpaces.has(space)
  );

  if (missingSpaces.length > 0) {
    validation.errors.push({
      type: 'error',
      severity: 'error',
      message: `Missing NASA required functional spaces: ${missingSpaces.join(', ')}`,
      component: 'system',
      nasa_reference: 'NASA Table 17 - Required functional spaces for crew safety'
    });
    validation.isValid = false;
    score -= missingSpaces.length * 12; // Each missing space is a significant penalty
  }

  // 3. NASA Official Component Volume Validation
  design.components.forEach(component => {
    const requirements = NASA_VALIDATION_RULES.volumeRequirements[component.type];
    if (requirements) {
      let minVolume = requirements.min;
      let recommendedVolume = requirements.recommended;
      
      // Apply per-crew multiplier if applicable
      if (requirements.perCrew) {
        minVolume *= design.crewSize;
        recommendedVolume *= design.crewSize;
      }
      
      if (component.volume < minVolume) {
        validation.errors.push({
          type: 'error',
          severity: 'error',
          message: `${component.type} volume violates NASA standards: ${component.volume.toFixed(2)}m³ (NASA minimum: ${minVolume.toFixed(2)}m³)`,
          component: component.type,
          nasa_reference: requirements.nasa_ref
        });
        validation.isValid = false;
        score -= 8;
      } else if (component.volume < recommendedVolume) {
        validation.warnings.push({
          type: 'warning',
          message: `${component.type} volume below NASA recommended: ${component.volume.toFixed(2)}m³ (NASA recommended: ${recommendedVolume.toFixed(2)}m³)`,
          nasa_reference: requirements.nasa_ref
        });
        score -= 3;
      }
      
      // Bonus for exceeding recommended volumes (up to a point)
      if (component.volume > recommendedVolume && component.volume <= recommendedVolume * 1.5) {
        score += 1; // Small bonus for generous volume allocation
      } else if (component.volume > recommendedVolume * 1.5) {
        validation.warnings.push({
          type: 'warning',
          message: `${component.type} volume excessively large: ${component.volume.toFixed(2)}m³ (NASA recommended: ${recommendedVolume.toFixed(2)}m³)`,
          nasa_reference: requirements.nasa_ref
        });
        score -= 2; // Penalty for wasteful space usage
      }
    }
  });

  // 4. Adjacency Rules Validation
  const adjacencyViolations = checkAdjacencyRules(design.components);
  adjacencyViolations.forEach(violation => {
    validation.warnings.push(`Adjacency concern: ${violation.component1} near ${violation.component2}`);
    score -= 3;
  });

  // 5. Volume Utilization Check
  if (validation.metrics.volumeUtilization > 90) {
    validation.warnings.push(`Very high volume utilization: ${validation.metrics.volumeUtilization}% (recommended: 60-80%)`);
    score -= 5;
  } else if (validation.metrics.volumeUtilization < 40) {
    validation.warnings.push(`Low volume utilization: ${validation.metrics.volumeUtilization}% (recommended: 60-80%)`);
    score -= 3;
  }

  // 6. Mission Duration Considerations
  const missionCategory = getMissionCategory(design.missionDuration);
  if (missionCategory.redundancyRequired) {
    const redundancyScore = checkRedundancy(design.components);
    validation.metrics.redundancy = redundancyScore;
    if (redundancyScore < 50) {
      validation.warnings.push(`Insufficient redundancy for long mission (${redundancyScore}% redundancy)`);
      score -= 8;
    }
  }

  // 7. Power Balance Check
  if (validation.metrics.powerBalance < 0) {
    validation.errors.push({
      type: 'error',
      severity: 'error',
      message: `Power deficit: ${Math.abs(validation.metrics.powerBalance)}W`,
      component: 'power'
    });
    validation.isValid = false;
    score -= 15;
  }

  // 8. Structural Integrity (basic check)
  validation.metrics.structuralIntegrity = calculateStructuralIntegrity(design);
  if (validation.metrics.structuralIntegrity < 70) {
    validation.warnings.push(`Structural integrity concerns: ${validation.metrics.structuralIntegrity}%`);
    score -= 10;
  }

  // 9. Accessibility Check
  validation.metrics.accessibility = calculateAccessibility(design);
  if (validation.metrics.accessibility < 60) {
    validation.warnings.push(`Accessibility concerns: ${validation.metrics.accessibility}%`);
    score -= 5;
  }

  // Final score calculation
  validation.score = Math.max(0, Math.min(100, score));
  
  return validation;
};

/**
 * Calculate power balance for the habitat
 */
const calculatePowerBalance = (design) => {
  let totalConsumption = 0;
  
  design.components.forEach(component => {
    const powerReq = NASA_VALIDATION_RULES.powerRequirements[component.type];
    if (powerReq) {
      totalConsumption += powerReq.base + (powerReq.perCrew * design.crewSize);
    }
  });
  
  // Assume baseline power generation (this would be more complex in reality)
  const baselinePower = 5000 + (design.crewSize * 500); // Basic assumption
  
  return baselinePower - totalConsumption;
};

/**
 * Check adjacency rules between components
 */
const checkAdjacencyRules = (components) => {
  const violations = [];
  const adjacencyThreshold = 5; // meters
  
  for (let i = 0; i < components.length; i++) {
    for (let j = i + 1; j < components.length; j++) {
      const comp1 = components[i];
      const comp2 = components[j];
      
      const distance = calculateDistance(comp1.position, comp2.position);
      
      if (distance <= adjacencyThreshold) {
        // Check if this combination should be avoided
        const shouldAvoid = NASA_VALIDATION_RULES.adjacencyRules.avoid.some(rule => 
          (rule.includes(comp1.type) && rule.includes(comp2.type))
        );
        
        if (shouldAvoid) {
          violations.push({
            component1: comp1.type,
            component2: comp2.type,
            distance: distance.toFixed(1)
          });
        }
      }
    }
  }
  
  return violations;
};

/**
 * Calculate distance between two positions
 */
const calculateDistance = (pos1, pos2) => {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  const dz = pos1.z - pos2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

/**
 * Get mission category based on duration
 */
const getMissionCategory = (durationDays) => {
  if (durationDays <= 30) return NASA_VALIDATION_RULES.missionDurationFactors.short;
  if (durationDays <= 180) return NASA_VALIDATION_RULES.missionDurationFactors.medium;
  if (durationDays <= 365) return NASA_VALIDATION_RULES.missionDurationFactors.long;
  return NASA_VALIDATION_RULES.missionDurationFactors.extended;
};

/**
 * Check system redundancy
 */
const checkRedundancy = (components) => {
  const criticalSystems = ['LIFE_SUPPORT', 'ECLSS', 'AIRLOCK', 'EMERGENCY_KIT'];
  let redundancyScore = 0;
  
  criticalSystems.forEach(system => {
    const count = components.filter(comp => comp.type === system).length;
    if (count >= 2) {
      redundancyScore += 25; // Each redundant system adds 25%
    }
  });
  
  return Math.min(100, redundancyScore);
};

/**
 * Calculate structural integrity score
 */
const calculateStructuralIntegrity = (design) => {
  // Simplified structural integrity calculation
  let score = 80; // Base score
  
  const massDistribution = calculateMassDistribution(design.components);
  if (massDistribution.imbalance > 0.3) {
    score -= 20;
  }
  
  // Check for proper support structures
  const hasStructuralSupport = design.components.some(comp => 
    comp.type === 'MAINTENANCE' || comp.type === 'STRUCTURAL'
  );
  
  if (!hasStructuralSupport && design.habitat.volume > 200) {
    score -= 15;
  }
  
  return Math.max(0, score);
};

/**
 * Calculate accessibility score
 */
const calculateAccessibility = (design) => {
  // Simplified accessibility calculation
  let score = 80; // Base score
  
  // Check for clear pathways (this would be more complex in reality)
  const componentDensity = design.components.length / design.habitat.volume;
  
  if (componentDensity > 0.1) { // Too dense
    score -= 20;
  }
  
  // Check for emergency access
  const hasAirlock = design.components.some(comp => comp.type === 'AIRLOCK');
  if (!hasAirlock) {
    score -= 30;
  }
  
  return Math.max(0, score);
};

/**
 * Calculate mass distribution
 */
const calculateMassDistribution = (components) => {
  if (components.length === 0) return { imbalance: 0 };
  
  let totalMass = 0;
  let weightedX = 0;
  let weightedY = 0;
  let weightedZ = 0;
  
  components.forEach(comp => {
    const mass = comp.weight || 100; // Default weight if not specified
    totalMass += mass;
    weightedX += comp.position.x * mass;
    weightedY += comp.position.y * mass;
    weightedZ += comp.position.z * mass;
  });
  
  const centerOfMass = {
    x: weightedX / totalMass,
    y: weightedY / totalMass,
    z: weightedZ / totalMass
  };
  
  // Calculate imbalance (distance from origin)
  const imbalance = Math.sqrt(
    centerOfMass.x * centerOfMass.x + 
    centerOfMass.y * centerOfMass.y + 
    centerOfMass.z * centerOfMass.z
  );
  
  return { centerOfMass, imbalance };
};

/**
 * Map component types to NASA functional spaces
 * Based on NASA Table 17 functional space categories
 */
const mapComponentToFunctionalSpace = (componentType) => {
  const functionalSpaceMapping = {
    // Life Support Systems
    'LIFE_SUPPORT': 'LIFE_SUPPORT',
    'ECLSS': 'LIFE_SUPPORT',
    
    // Private Habitation
    'SLEEP_POD': 'PRIVATE_HABITATION',
    'SLEEP_QUARTERS': 'PRIVATE_HABITATION',
    'PRIVATE_HABITATION': 'PRIVATE_HABITATION',
    'WORKSTATION': 'PRIVATE_HABITATION',
    
    // Hygiene & Waste
    'HYGIENE': 'HYGIENE',
    'HYGIENE_CLEANSING': 'HYGIENE',
    'HUMAN_WASTE': 'WASTE_MANAGEMENT',
    'WASTE_MANAGEMENT': 'WASTE_MANAGEMENT',
    
    // Meal Preparation
    'KITCHEN': 'MEAL_PREPARATION',
    'MEAL_PREPARATION': 'MEAL_PREPARATION',
    'FOOD_STORAGE': 'MEAL_PREPARATION',
    
    // Exercise
    'EXERCISE': 'EXERCISE',
    'TREADMILL': 'EXERCISE',
    'EXERCISE_TREADMILL': 'EXERCISE',
    'EXERCISE_CYCLE': 'EXERCISE',
    'RESISTANCE_TRAINER': 'EXERCISE',
    'EXERCISE_RESISTIVE': 'EXERCISE',
    
    // Medical
    'MEDICAL_BAY': 'MEDICAL',
    'MEDICAL_COMPUTER': 'MEDICAL',
    'MEDICAL_STORAGE': 'MEDICAL',
    
    // Storage & Logistics (typically covered under other spaces)
    'STORAGE_RACK': 'MEAL_PREPARATION', // Often associated with food/supplies
    'LOGISTICS_STORAGE': 'MEAL_PREPARATION',
    'CARGO_BAY': 'MEAL_PREPARATION',
    
    // Work & Research
    'LAB': 'PRIVATE_HABITATION', // Research work area
    'UTILIZATION_RESEARCH': 'PRIVATE_HABITATION',
    
    // Mission Operations
    'MISSION_PLANNING': 'PRIVATE_HABITATION', // Workstation area
    'COMMUNICATION': 'PRIVATE_HABITATION',
    'MAINTENANCE': 'PRIVATE_HABITATION',
    'MAINTENANCE_COMPUTER': 'PRIVATE_HABITATION',
    'MAINTENANCE_WORK': 'PRIVATE_HABITATION',
    
    // Social Areas
    'GROUP_SOCIAL': 'MEAL_PREPARATION', // Often combined with dining
    'GROUP_SOCIAL_TABLE': 'MEAL_PREPARATION',
    
    // Access & Safety
    'AIRLOCK': 'LIFE_SUPPORT', // Critical safety system
    'EMERGENCY_KIT': 'LIFE_SUPPORT',
    'PASSAGEWAY': 'LIFE_SUPPORT' // Essential for access
  };
  
  return functionalSpaceMapping[componentType] || null;
};

/**
 * Get component zone category
 */
const getComponentZone = (componentType) => {
  const zoneMapping = {
    'LIFE_SUPPORT': 'LIFE_SUPPORT',
    'ECLSS': 'LIFE_SUPPORT',
    'SLEEP_POD': 'SLEEP',
    'SLEEP_QUARTERS': 'SLEEP',
    'HYGIENE': 'HYGIENE',
    'KITCHEN': 'FOOD',
    'FOOD_STORAGE': 'FOOD',
    'EXERCISE': 'EXERCISE',
    'TREADMILL': 'EXERCISE',
    'RESISTANCE_TRAINER': 'EXERCISE',
    'LAB': 'WORK',
    'WORKSTATION': 'WORK',
    'STORAGE_RACK': 'STORAGE',
    'CARGO_BAY': 'STORAGE'
  };
  
  return zoneMapping[componentType] || 'OTHER';
};

module.exports = {
  validateDesign,
  validateDesignEnhanced,
  NASA_VALIDATION_RULES,
  NASA_OFFICIAL_VOLUMES,
  NASA_NHV_REQUIREMENTS,
  NASA_ENHANCED_STANDARDS,
  COMPONENT_CATEGORIES,
  calculatePowerBalance,
  checkAdjacencyRules,
  getMissionCategory,
  mapComponentToFunctionalSpace,
  getNHVMissionCategory,
  validateSystemRedundancy,
  validateAccessibilityStandards
};
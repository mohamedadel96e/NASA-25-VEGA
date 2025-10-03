const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Design name is required'],
    trim: true,
    maxlength: [100, 'Design name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // Habitat configuration
  habitat: {
    shape: {
      type: String,
      enum: ['cylinder', 'sphere', 'dome'],
      required: [true, 'Habitat shape is required']
    },
    dimensions: {
      length: { 
        type: Number, 
        min: [1, 'Length must be at least 1 meter'] 
      },
      radius: { 
        type: Number, 
        min: [1, 'Radius must be at least 1 meter'] 
      },
      height: { 
        type: Number, 
        min: [1, 'Height must be at least 1 meter'] 
      }
    },
    volume: {
      type: Number,
      required: true,
      min: [20, 'Habitat volume must be at least 20 cubic meters']
    },
    materialType: {
      type: String,
      enum: ['aluminum', 'titanium', 'composite', 'inflatable'],
      default: 'aluminum'
    },
    wallThickness: {
      type: Number,
      default: 0.1, // meters
      min: 0.05,
      max: 0.5
    }
  },
  
  // Components inside the habitat
  components: [{
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: [
        'LIFE_SUPPORT', 'ECLSS', 'SLEEP_POD', 'SLEEP_QUARTERS', 'HYGIENE',
        'KITCHEN', 'FOOD_STORAGE', 'EXERCISE', 'TREADMILL', 'RESISTANCE_TRAINER',
        'LAB', 'WORKSTATION', 'STORAGE_RACK', 'CARGO_BAY', 'AIRLOCK',
        'EMERGENCY_KIT', 'MEDICAL_BAY', 'COMMUNICATION', 'MAINTENANCE',
        'DOCKING_PORT', 'WINDOW', 'LIGHTING_SYSTEM', 'THERMAL_CONTROL'
      ],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      z: { type: Number, default: 0 }
    },
    rotation: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      z: { type: Number, default: 0 }
    },
    dimensions: {
      width: { 
        type: Number, 
        required: true,
        min: [0.1, 'Component width must be at least 0.1 meters']
      },
      height: { 
        type: Number, 
        required: true,
        min: [0.1, 'Component height must be at least 0.1 meters']
      },
      depth: { 
        type: Number, 
        required: true,
        min: [0.1, 'Component depth must be at least 0.1 meters']
      }
    },
    volume: {
      type: Number,
      required: true,
      min: 0
    },
    weight: {
      type: Number,
      required: true,
      min: 0 // kg
    },
    powerConsumption: {
      type: Number,
      default: 0, // watts
      min: 0
    },
    properties: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: new Map()
    },
    zone: {
      type: String,
      enum: ['habitation', 'work', 'utility', 'storage', 'emergency'],
      required: true
    }
  }],
  
  // Mission parameters
  crewSize: {
    type: Number,
    required: [true, 'Crew size is required'],
    min: [1, 'Crew size must be at least 1'],
    max: [10, 'Crew size cannot exceed 10']
  },
  missionDuration: {
    type: Number,
    required: [true, 'Mission duration is required'],
    min: [1, 'Mission duration must be at least 1 day'],
    max: [1000, 'Mission duration cannot exceed 1000 days']
  },
  destination: {
    type: String,
    enum: ['LEO', 'Moon', 'Mars', 'Asteroid', 'Deep Space'],
    required: [true, 'Mission destination is required']
  },
  
  // Environmental conditions
  environment: {
    gravity: {
      type: Number,
      default: 0, // m/s² (0 for microgravity)
      min: 0,
      max: 10
    },
    radiation: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    temperature: {
      internal: {
        min: { type: Number, default: 18 }, // °C
        max: { type: Number, default: 24 }
      },
      external: {
        min: { type: Number, default: -200 }, // °C
        max: { type: Number, default: 150 }
      }
    }
  },
  
  // Validation results
  validation: {
    isValid: {
      type: Boolean,
      default: false
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    errors: [{
      type: String,
      severity: {
        type: String,
        enum: ['error', 'warning', 'info'],
        default: 'error'
      },
      component: String,
      message: String
    }],
    warnings: [String],
    lastValidated: {
      type: Date,
      default: Date.now
    },
    
    // Detailed validation metrics
    metrics: {
      volumeUtilization: { type: Number, default: 0 }, // percentage
      powerBalance: { type: Number, default: 0 }, // watts
      massTotal: { type: Number, default: 0 }, // kg
      centerOfMass: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        z: { type: Number, default: 0 }
      },
      structuralIntegrity: { type: Number, default: 0 }, // score 0-100
      redundancy: { type: Number, default: 0 }, // score 0-100
      accessibility: { type: Number, default: 0 } // score 0-100
    }
  },
  
  // Design metadata
  tags: [String],
  isPublic: {
    type: Boolean,
    default: false
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  basedOnTemplate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Design',
    default: null
  },
  version: {
    type: Number,
    default: 1
  },
  
  // Collaboration
  collaborators: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'admin'],
      default: 'viewer'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Export formats
  exports: [{
    format: {
      type: String,
      enum: ['json', 'pdf', 'obj', 'stl', 'cad'],
      required: true
    },
    url: String,
    generatedAt: {
      type: Date,
      default: Date.now
    },
    size: Number // bytes
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
designSchema.index({ userId: 1, createdAt: -1 });
designSchema.index({ name: 'text', description: 'text' });
designSchema.index({ isPublic: 1, createdAt: -1 });
designSchema.index({ tags: 1 });
designSchema.index({ 'validation.score': -1 });

// Virtual for total component volume
designSchema.virtual('totalComponentVolume').get(function() {
  return this.components.reduce((total, component) => total + component.volume, 0);
});

// Virtual for volume utilization percentage
designSchema.virtual('volumeUtilization').get(function() {
  if (this.habitat.volume === 0) return 0;
  return Math.round((this.totalComponentVolume / this.habitat.volume) * 100);
});

// Virtual for total mass
designSchema.virtual('totalMass').get(function() {
  return this.components.reduce((total, component) => total + component.weight, 0);
});

// Virtual for total power consumption
designSchema.virtual('totalPowerConsumption').get(function() {
  return this.components.reduce((total, component) => total + component.powerConsumption, 0);
});

// Method to calculate habitat volume based on shape and dimensions
designSchema.methods.calculateHabitatVolume = function() {
  const { shape, dimensions } = this.habitat;
  let volume = 0;
  
  switch (shape) {
    case 'cylinder':
      volume = Math.PI * Math.pow(dimensions.radius, 2) * dimensions.length;
      break;
    case 'sphere':
      volume = (4/3) * Math.PI * Math.pow(dimensions.radius, 3);
      break;
    case 'dome':
      volume = (2/3) * Math.PI * Math.pow(dimensions.radius, 3);
      break;
  }
  
  this.habitat.volume = Math.round(volume * 100) / 100;
  return this.habitat.volume;
};

// Method to add component
designSchema.methods.addComponent = function(componentData) {
  this.components.push(componentData);
  return this.save();
};

// Method to remove component
designSchema.methods.removeComponent = function(componentId) {
  this.components = this.components.filter(comp => comp.id !== componentId);
  return this.save();
};

// Method to update component
designSchema.methods.updateComponent = function(componentId, updateData) {
  const componentIndex = this.components.findIndex(comp => comp.id === componentId);
  if (componentIndex > -1) {
    Object.assign(this.components[componentIndex], updateData);
    return this.save();
  }
  throw new Error('Component not found');
};

module.exports = mongoose.model('Design', designSchema);
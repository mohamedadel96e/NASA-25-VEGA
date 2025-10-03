const mongoose = require("mongoose");

const gameProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    currentLevel: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
    },
    completedLevels: [
      {
        type: Number,
        min: 1,
        max: 10,
      },
    ],
    levelScores: {
      type: Map,
      of: {
        score: {
          type: Number,
          min: 0,
          max: 1000,
        },
        stars: {
          type: Number,
          min: 0,
          max: 3,
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
        attempts: {
          type: Number,
          default: 1,
        },
        bestTime: {
          type: Number, // in seconds
          default: null,
        },
      },
      default: new Map(),
    },
    totalScore: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Current design in progress
    currentDesign: {
      habitatShape: {
        type: String,
        enum: ["cylinder", "sphere", "dome", null],
        default: null,
      },
      dimensions: {
        length: {type: Number, min: 0},
        radius: {type: Number, min: 0},
        height: {type: Number, min: 0},
        volume: {type: Number, min: 0},
      },
      components: [
        {
          id: String,
          type: {
            type: String,
            enum: [
              "LIFE_SUPPORT",
              "SLEEP_POD",
              "SLEEP_QUARTERS",
              "HYGIENE",
              "KITCHEN",
              "FOOD_STORAGE",
              "EXERCISE",
              "LAB",
              "WORKSTATION",
              "STORAGE_RACK",
              "CARGO_BAY",
              "AIRLOCK",
              "EMERGENCY_KIT",
              "MEDICAL_BAY",
              "COMMUNICATION",
              "MAINTENANCE",
            ],
          },
          position: {
            x: {type: Number, default: 0},
            y: {type: Number, default: 0},
            z: {type: Number, default: 0},
          },
          rotation: {
            x: {type: Number, default: 0},
            y: {type: Number, default: 0},
            z: {type: Number, default: 0},
          },
          dimensions: {
            width: {type: Number, min: 0},
            height: {type: Number, min: 0},
            depth: {type: Number, min: 0},
            volume: {type: Number, min: 0},
          },
          properties: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
          },
        },
      ],
      crewSize: {
        type: Number,
        default: 2,
        min: 1,
        max: 10,
      },
      missionDuration: {
        type: Number,
        default: 30, // days
        min: 1,
      },
    },

    // Statistics
    stats: {
      totalPlayTime: {
        type: Number,
        default: 0, // in seconds
      },
      levelsCompleted: {
        type: Number,
        default: 0,
      },
      perfectScores: {
        type: Number,
        default: 0,
      },
      componentsPlaced: {
        type: Number,
        default: 0,
      },
      designsValidated: {
        type: Number,
        default: 0,
      },
    },

  },
  {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
  }
);

// Indexes
gameProgressSchema.index({userId: 1});
gameProgressSchema.index({totalScore: -1});
gameProgressSchema.index({currentLevel: 1});

// Virtual for progress percentage
gameProgressSchema.virtual("progressPercentage").get(function () {
  return Math.round((this.completedLevels.length / 10) * 100);
});

// Virtual for average score
gameProgressSchema.virtual("averageScore").get(function () {
  if (this.levelScores.size === 0) return 0;

  let totalScore = 0;
  this.levelScores.forEach((levelData) => {
    totalScore += levelData.score;
  });

  return Math.round(totalScore / this.levelScores.size);
});

// Method to complete a level
gameProgressSchema.methods.completeLevel = function (
  level,
  score,
  stars,
  timeTaken
) {
  // Add to completed levels if not already there
  if (!this.completedLevels.includes(level)) {
    this.completedLevels.push(level);
    this.stats.levelsCompleted += 1;
  }

  // Update level score
  const currentLevelScore = this.levelScores.get(level.toString());
  const attempts = currentLevelScore
    ? currentLevelScore.attempts + 1
    : 1;
  const bestTime = currentLevelScore
    ? Math.min(currentLevelScore.bestTime || timeTaken, timeTaken)
    : timeTaken;

  this.levelScores.set(level.toString(), {
    score: Math.max(currentLevelScore?.score || 0, score),
    stars,
    completedAt: new Date(),
    attempts,
    bestTime,
  });

  // Update current level
  if (level >= this.currentLevel) {
    this.currentLevel = Math.min(level + 1, 10);
  }

  // Update total score
  this.recalculateTotalScore();

  // Check for perfect score achievement
  if (score === 1000) {
    this.stats.perfectScores += 1;
  }

  return this.save();
};

// Method to recalculate total score
gameProgressSchema.methods.recalculateTotalScore = function () {
  let total = 0;
  this.levelScores.forEach((levelData) => {
    total += levelData.score;
  });
  this.totalScore = total;
};


module.exports = mongoose.model("GameProgress", gameProgressSchema);

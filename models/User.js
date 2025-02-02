const mongoose = require('mongoose');
const { z } = require('zod');
const { Schema } = mongoose;

// Zod Schemas
const SkillSchema = z.string().min(1).trim();

const SkillScoreSchema = z.object({
  skill: z.string().min(1).trim(),
  score: z.number().min(0).max(100),
});

const UserSchema = z.object({
  username: z.string().min(3).trim(),
  gender: z.enum(['male', 'female', 'other', 'prefer not to say']),
  country: z.string().min(2).trim(),
  state: z.string().min(2).trim(),
  domain: z.enum(['web', 'app', 'blockchain', 'other']),
  otherDomain: z.string().optional(),
  race: z.enum([
    'American Indian or Alaska Native',
    'Asian',
    'Black or African American',
    'Hispanic or Latino',
    'Native Hawaiian or Other Pacific Islander',
    'White',
    'Two or More Races',
  ]),
  skills: z.array(SkillSchema),
  skillScores: z.array(SkillScoreSchema).optional(),
  careerGuidance: z.string().max(50000).optional(), // New field for career guidance
  mailId: z.string().email().trim().toLowerCase(),
});

// Mongoose Schema
const mongooseUserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minLength: [3, 'Username must be at least 3 characters long'],
      unique: true,
      index: true,
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: {
        values: ['male', 'female', 'other', 'prefer not to say'],
        message: '{VALUE} is not a valid gender option',
      },
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    domain: {
      type: String,
      required: [true, 'Domain is required'],
      enum: {
        values: ['web', 'app', 'blockchain', 'other'],
        message: '{VALUE} is not a valid domain option',
      },
    },
    otherDomain: {
      type: String,
      required: function () {
        return this.domain === 'other';
      },
      trim: true,
    },
    race: {
      type: String,
      required: [true, 'Race is required'],
      enum: {
        values: [
          'American Indian or Alaska Native',
          'Asian',
          'Black or African American',
          'Hispanic or Latino',
          'Native Hawaiian or Other Pacific Islander',
          'White',
          'Two or More Races',
        ],
        message: '{VALUE} is not a valid race option',
      },
    },
    skills: [
      {
        type: String,
        trim: true,
        required: [true, 'At least one skill is required'],
      },
    ],
    skillScores: [
      {
        skill: {
          type: String,
          required: [true, 'Skill is required'],
        },
        score: {
          type: Number,
          required: [true, 'Score is required'],
          min: [0, 'Score must be between 0 and 100'],
          max: [100, 'Score must be between 0 and 100'],
        },
      },
    ],
    careerGuidance: {
      type: String,
      trim: true,
      maxLength: [50000, 'Career guidance cannot exceed 5000 characters'],
    },
    mailId: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
mongooseUserSchema.index({ username: 1, mailId: 1 });

// Pre-save middleware for Zod validation
mongooseUserSchema.pre('save', async function (next) {
  try {
    // Only validate if document is new or modified
    if (this.isNew || this.isModified()) {
      UserSchema.parse({
        username: this.username,
        gender: this.gender,
        country: this.country,
        state: this.state,
        domain: this.domain,
        otherDomain: this.otherDomain,
        race: this.race,
        skills: this.skills,
        skillScores: this.skillScores,
        careerGuidance: this.careerGuidance,
        mailId: this.mailId,
      });
    }
    next();
  } catch (error) {
    next(new Error(error.errors?.[0]?.message || 'Validation failed'));
  }
});

// Pre-save middleware for otherDomain validation
mongooseUserSchema.pre('save', function (next) {
  if (this.domain === 'other' && !this.otherDomain) {
    next(new Error('Other domain specification is required when domain is "other"'));
  }
  next();
});

// Error handling for duplicate key errors
mongooseUserSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    next(new Error(`${field === 'username' ? 'Username' : 'Email'} already exists`));
  } else {
    next(error);
  }
});

// Create or get existing model
let User;
try {
  User = mongoose.model('User');
} catch {
  User = mongoose.model('User', mongooseUserSchema);
}

module.exports = {
  schemas: {
    SkillSchema,
    UserSchema,
    SkillScoreSchema,
  },
  models: {
    User,
  },
};
const mongoose = require("mongoose");
const { z } = require("zod");
const { Schema } = mongoose;

// Zod Schemas
const SkillSchema = z.string().min(1).trim();

const SkillScoreSchema = z.object({
  skill: z.string().min(1).trim(),
  score: z.number().min(0).max(100),
});

const UserSchema = z.object({
  username: z.string().min(3).trim(),
  gender: z.enum(["male", "female", "other", "prefer not to say"]),
  country: z.string().min(2).trim(),
  state: z.string().min(2).trim(),
  domain: z.enum(["web", "app", "blockchain", "other"]).optional(),
  otherDomain: z.string().optional(),
  skills: z.array(SkillSchema).optional(),
  skillScores: z.array(SkillScoreSchema).optional(),
  careerGuidance: z.string().max(50000).optional(), // New field for career guidance
  mailId: z.string().email().trim().toLowerCase(),
});

// Mongoose Schema
const mongooseUserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minLength: [3, "Username must be at least 3 characters long"],
      unique: true,
      index: true,
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: {
        values: ["male", "female", "other", "prefer not to say"],
        message: "{VALUE} is not a valid gender option",
      },
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    domain: {
      type: String,
      required: false,
      enum: {
        values: ["web", "app", "blockchain", "other"],
        message: "{VALUE} is not a valid domain option",
      },
    },
    otherDomain: {
      type: String,
      required: function () {
        return this.domain === "other";
      },
      trim: true,
    },
    skills: {
      type: [String],
      required: false,
      trim: true,
    },
    skillScores: [
      {
        skill: {
          type: String,
          required: [true, "Skill is required"],
        },
        score: {
          type: Number,
          required: [true, "Score is required"],
          min: [0, "Score must be between 0 and 100"],
          max: [100, "Score must be between 0 and 100"],
        },
      },
    ],
    careerGuidance: {
      type: String,
      trim: true,
      maxLength: [50000, "Career guidance cannot exceed 50000 characters"],
    },
    mailId: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
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
mongooseUserSchema.pre("save", async function (next) {
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
        skills: this.skills || [],
        skillScores: this.skillScores,
        careerGuidance: this.careerGuidance,
        mailId: this.mailId,
      });
    }
    next();
  } catch (error) {
    next(new Error(error.errors?.[0]?.message || "Validation failed"));
  }
});

// Pre-save middleware for otherDomain validation
mongooseUserSchema.pre("save", function (next) {
  if (this.domain === "other" && !this.otherDomain) {
    next(
      new Error('Other domain specification is required when domain is "other"')
    );
  }
  next();
});

// Error handling for duplicate key errors
mongooseUserSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    next(
      new Error(`${field === "username" ? "Username" : "Email"} already exists`)
    );
  } else {
    next(error);
  }
});

const FeedbackSchema = z.object({
  section: z.enum([
    "assessments",
    "resume-analysis",
    "interview",
    "career-guidance",
    "beginner-assessment",
    "other",
  ]),
  stars: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(), // For assessment feedback
});

// New Mongoose Feedback Schema
const mongooseFeedbackSchema = new Schema(
  {
    section: {
      type: String,
      required: [true, "Section is required"],
      enum: {
        values: [
          "assessments",
          "resume-analysis",
          "interview",
          "career-guidance",
          "beginner-assessment",
          "other",
        ],
        message: "{VALUE} is not a valid section option",
      },
    },
    stars: {
      type: Number,
      required: [true, "Star rating is required"],
      min: [1, "Rating must be between 1 and 5"],
      max: [5, "Rating must be between 1 and 5"],
    },
    comment: {
      type: String,
      trim: true,
      maxLength: [1000, "Comment cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware for Zod validation
mongooseFeedbackSchema.pre("save", async function (next) {
  try {
    if (this.isNew || this.isModified()) {
      FeedbackSchema.parse({
        section: this.section,
        stars: this.stars,
        comment: this.comment,
      });
    }
    next();
  } catch (error) {
    next(new Error(error.errors?.[0]?.message || "Feedback validation failed"));
  }
});

// Create or get existing models
let User;
let Feedback;

try {
  User = mongoose.model("User");
} catch {
  User = mongoose.model("User", mongooseUserSchema);
}

try {
  Feedback = mongoose.model("Feedback");
} catch {
  Feedback = mongoose.model("Feedback", mongooseFeedbackSchema);
}

module.exports = {
  schemas: {
    SkillSchema,
    UserSchema,
    SkillScoreSchema,
    FeedbackSchema,
  },
  models: {
    User,
    Feedback,
  },
};

const mongoose = require('mongoose');
const { z } = require('zod');
const { Schema } = mongoose;


const SkillSchema = z.object({
  skill: z.string().min(1).trim(),
  skillScore: z.number().min(0),
  subdomain: z.string().min(1).trim()
});

const EventSchema = z.object({
  venue: z.string().min(1).trim(),
  time: z.date(),
  name: z.string().min(1).trim()
});

const DailyDataSchema = z.object({
  meetups: z.array(EventSchema),
  hackathons: z.array(EventSchema)
});

const FeedbackSetSchema = z.object({
  userQuery: z.string().min(1).trim(),
  queryOutput: z.string().min(1).trim(),
  changeInCareerGuidance: z.string().trim().optional()
});

const FeedbackChannelSchema = z.object({
  feedbackSet: z.string() // MongoDB ObjectId as string
});

const UserSchema = z.object({
  mailId: z.string().email().trim().toLowerCase(),
  username: z.string().min(3).trim(),
  location: z.string().min(1).trim(),
  domain: z.string().min(1).trim(),
  skills: z.array(SkillSchema),
  guidedCareerPath: z.string().min(1).trim(),
  guidedCareerDetails: z.string().min(1).trim(),
  feedbackChannel: z.string().optional(), // MongoDB ObjectId as string
  gender: z.enum(['male', 'female', 'other', 'prefer not to say']),
  race: z.string().min(1).trim(),
  dailyData: DailyDataSchema.optional()
});


const mongooseSkillSchema = new Schema({
  skill: String,
  skillScore: Number,
  subdomain: String
});

const mongooseDailyDataSchema = new Schema({
  meetups: [{
    venue: String,
    time: Date,
    name: String
  }],
  hackathons: [{
    venue: String,
    time: Date,
    name: String
  }]
});

const mongooseFeedbackSetSchema = new Schema({
  userQuery: String,
  queryOutput: String,
  changeInCareerGuidance: String
});

const mongooseFeedbackChannelSchema = new Schema({
  feedbackSet: {
    type: Schema.Types.ObjectId,
    ref: 'FeedbackSet'
  }
});

const mongooseUserSchema = new Schema({
  mailId: String,
  username: String,
  location: String,
  domain: String,
  skills: [mongooseSkillSchema],
  guidedCareerPath: String,
  guidedCareerDetails: String,
  feedbackChannel: {
    type: Schema.Types.ObjectId,
    ref: 'FeedbackChannel'
  },
  gender: String,
  race: String,
  dailyData: mongooseDailyDataSchema
}, {
  timestamps: true
});

mongooseUserSchema.pre('save', async function(next) {
  try {
    UserSchema.parse({
      mailId: this.mailId,
      username: this.username,
      location: this.location,
      domain: this.domain,
      skills: this.skills,
      guidedCareerPath: this.guidedCareerPath,
      guidedCareerDetails: this.guidedCareerDetails,
      feedbackChannel: this.feedbackChannel?.toString(),
      gender: this.gender,
      race: this.race,
      dailyData: this.dailyData
    });
    next();
  } catch (error) {
    next(error);
  }
});

const Skill = mongoose.model('Skill', mongooseSkillSchema);
const DailyData = mongoose.model('DailyData', mongooseDailyDataSchema);
const FeedbackSet = mongoose.model('FeedbackSet', mongooseFeedbackSetSchema);
const FeedbackChannel = mongoose.model('FeedbackChannel', mongooseFeedbackChannelSchema);
const User = mongoose.model('User', mongooseUserSchema);

module.exports = {
  // Zod Schemas
  schemas: {
    SkillSchema,
    EventSchema,
    DailyDataSchema,
    FeedbackSetSchema,
    FeedbackChannelSchema,
    UserSchema
  },
  // Mongoose Models
  models: {
    Skill,
    DailyData,
    FeedbackSet,
    FeedbackChannel,
    User
  }
};
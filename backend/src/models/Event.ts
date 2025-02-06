import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  organizer: mongoose.Types.ObjectId;
  attendees: mongoose.Types.ObjectId[];
  maxAttendees?: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  isAtCapacity: boolean;
  attendeeCount: number;
}

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Conference', 'Workshop', 'Seminar', 'Networking', 'Social', 'Other']
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxAttendees: {
    type: Number,
    min: 1
  },
  image: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual fields
eventSchema.virtual('isAtCapacity').get(function(this: IEvent) {
  if (!this.maxAttendees) return false;
  return this.attendees.length >= this.maxAttendees;
});

eventSchema.virtual('attendeeCount').get(function(this: IEvent) {
  return this.attendees.length;
});

// Add index for search
eventSchema.index({
  title: 'text',
  description: 'text',
  location: 'text'
});

export const Event = mongoose.model<IEvent>('Event', eventSchema); 
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Event, IEvent } from '../models/Event';
import { buildEventQuery } from '../utils/search';
import { Server } from 'socket.io';
import { CreateEventInput, UpdateEventInput } from '../types/event';
import { AuthRequest } from '../middleware/auth';

let io: Server;

export const setIO = (socketIO: Server) => {
  io = socketIO;
};

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;
    const sortBy = (req.query.sortBy as string) || 'date';
    const sortOrder = (req.query.sortOrder as string) === 'desc' ? -1 : 1;

    const filters = {
      category: req.query.category as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      searchQuery: req.query.searchQuery as string,
      minAttendees: parseInt(req.query.minAttendees as string),
      maxAttendees: parseInt(req.query.maxAttendees as string),
      isUpcoming: req.query.isUpcoming === 'true',
    };

    const query = buildEventQuery(filters);
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      Event.find(query)
        .populate('organizer', 'name email')
        .populate('attendees', 'name email')
        .sort({ [sortBy]: sortOrder, _id: 1 })
        .skip(skip)
        .limit(limit),
      Event.countDocuments(query)
    ]);

    res.json({
      data: events,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const eventData: CreateEventInput = {
      ...req.body,
      organizer: req.user._id
    };

    // Validate required fields
    const requiredFields = ['title', 'description', 'date', 'time', 'location', 'category'];
    const missingFields = requiredFields.filter(field => !eventData[field]);
    
    if (missingFields.length > 0) {
      res.status(400).json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      });
      return;
    }

    // Validate category
    const validCategories = ['Conference', 'Workshop', 'Seminar', 'Networking', 'Social', 'Other'];
    if (!validCategories.includes(eventData.category)) {
      res.status(400).json({ error: 'Invalid category' });
      return;
    }

    // Create and save the event
    const event = new Event(eventData);
    event.attendees = [req.user._id];
    await event.save();

    // Populate organizer and attendees information
    const populatedEvent = await event.populate([
      { path: 'organizer', select: 'name email' },
      { path: 'attendees', select: 'name email' }
    ]);
    
    // Emit socket event
    if (io) {
      io.emit('eventCreated', populatedEvent);
    }

    res.status(201).json(populatedEvent);
  } catch (error: any) {
    console.error('Error creating event:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({ error: validationErrors.join(', ') });
      return;
    }

    // Handle other errors
    res.status(500).json({ 
      error: error.message || 'Failed to create event' 
    });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updates: UpdateEventInput = req.body;
    const event = await Event.findOne({
      _id: req.params.id,
      organizer: req.user._id
    });

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    Object.assign(event, updates);
    await event.save();
    
    const updatedEvent = await event.populate([
      { path: 'organizer', select: 'name email' },
      { path: 'attendees', select: 'name email' }
    ]);
    
    updatedEvent.attendees.forEach((attendee: any) => {
      io?.to(attendee._id.toString()).emit('eventUpdated', updatedEvent);
    });

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(400).json({ error: 'Failed to update event' });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      organizer: req.user._id
    }).populate('attendees', '_id');

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    event.attendees.forEach((attendee: any) => {
      io?.to(attendee._id.toString()).emit('eventDeleted', event._id);
    });

    await Event.deleteOne({ _id: event._id });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(400).json({ error: 'Failed to delete event' });
  }
};

export const joinEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id).exec();

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      res.status(400).json({ error: 'Event is at maximum capacity' });
      return;
    }

    const userIdString = req.user._id.toString();
    if (!event.attendees.some(id => id.toString() === userIdString)) {
      event.attendees.push(req.user._id);
      await event.save();
      
      const updatedEvent = await event.populate([
        { path: 'organizer', select: 'name email' },
        { path: 'attendees', select: 'name email' }
      ]);
      
      updatedEvent.attendees.forEach((attendee: any) => {
        io?.to(attendee._id.toString()).emit('eventUpdated', updatedEvent);
      });
    }

    res.json(event);
  } catch (error) {
    console.error('Error joining event:', error);
    res.status(400).json({ error: 'Failed to join event' });
  }
};

export const leaveEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id).exec();

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    const organizerId = event.organizer.toString();
    const userId = req.user._id.toString();

    if (organizerId === userId) {
      res.status(400).json({ error: 'Organizer cannot leave the event' });
      return;
    }

    const attendeeIndex = event.attendees.findIndex(id => id.toString() === userId);
    if (attendeeIndex > -1) {
      event.attendees.splice(attendeeIndex, 1);
      await event.save();
      
      const updatedEvent = await event.populate([
        { path: 'organizer', select: 'name email' },
        { path: 'attendees', select: 'name email' }
      ]);
      
      updatedEvent.attendees.forEach((attendee: any) => {
        io?.to(attendee._id.toString()).emit('eventUpdated', updatedEvent);
      });
    }

    res.json(event);
  } catch (error) {
    console.error('Error leaving event:', error);
    res.status(400).json({ error: 'Failed to leave event' });
  }
}; 
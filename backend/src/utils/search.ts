import { FilterQuery } from 'mongoose';
import { EventFilters } from '../types/event';

export const buildEventQuery = (filters: EventFilters): FilterQuery<any> => {
  const query: FilterQuery<any> = {};

  // Category filter
  if (filters.category) {
    query.category = filters.category;
  }

  // Date range filter
  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) {
      query.date.$gte = filters.startDate;
    }
    if (filters.endDate) {
      query.date.$lte = filters.endDate;
    }
  }

  // Upcoming events filter
  if (filters.isUpcoming) {
    const today = new Date().toISOString().split('T')[0];
    query.date = { ...query.date, $gte: today };
  }

  // Attendee count filters
  if (filters.minAttendees || filters.maxAttendees) {
    query.$expr = {};
    const conditions = [];
    
    if (filters.minAttendees) {
      conditions.push({ $gte: [{ $size: '$attendees' }, filters.minAttendees] });
    }
    
    if (filters.maxAttendees) {
      conditions.push({ $lte: [{ $size: '$attendees' }, filters.maxAttendees] });
    }
    
    query.$expr.$and = conditions;
  }

  // Search query (search in title, description, and location)
  if (filters.searchQuery) {
    const searchRegex = new RegExp(filters.searchQuery, 'i');
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { location: searchRegex }
    ];
  }

  return query;
}; 
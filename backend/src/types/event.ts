export interface EventFilters {
  category?: string;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
  minAttendees?: number;
  maxAttendees?: number;
  isUpcoming?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateEventInput {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  maxAttendees?: number;
  image?: string;
  organizer: string;
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  location?: string;
  category?: string;
  maxAttendees?: number;
  image?: string;
} 
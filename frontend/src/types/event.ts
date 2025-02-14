export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  organizer: {
    _id: string;
    name: string;
  };
  attendees: string[];
  maxAttendees?: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventFilters {
  searchQuery?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  minAttendees?: number;
  maxAttendees?: number;
  isUpcoming?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  maxAttendees?: number;
  image?: string;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  _id: string;
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
  [key: string]: string | number | undefined;
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
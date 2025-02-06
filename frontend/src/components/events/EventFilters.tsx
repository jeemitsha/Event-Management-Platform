import React, { useState, useEffect } from 'react';
import { EventFilters as FilterTypes } from '../../types/event';
import { useEvents } from '../../context/EventContext';

interface EventFiltersProps {
  onFilterChange: (filters: FilterTypes) => void;
  filters: FilterTypes;
}

export default function EventFilters({ onFilterChange, filters }: EventFiltersProps) {
  const { fetchEvents } = useEvents();
  const categories = [
    'Conference',
    'Workshop',
    'Seminar',
    'Networking',
    'Social',
    'Other'
  ];

  const defaultFilters: FilterTypes = {
    searchQuery: '',
    category: '',
    startDate: '',
    endDate: '',
    isUpcoming: false,
    sortBy: 'date',
    sortOrder: 'asc'
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    // Special handling for category
    if (name === 'category' && value === 'All Categories') {
      newValue = '';
    }

    const updatedFilters = {
      ...filters,
      [name]: newValue
    };

    // Delay filter update for search to avoid immediate re-render
    if (name === 'searchQuery') {
      setTimeout(() => {
        onFilterChange(updatedFilters);
      }, 300);
    } else {
      onFilterChange(updatedFilters);
    }
  };

  const handleClearFilters = async () => {
    // Reset all filters to default values
    onFilterChange(defaultFilters);
    
    // Fetch all events with default filters
    await fetchEvents(defaultFilters);
  };

  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow mb-4 sm:mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Search input */}
        <div>
          <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            name="searchQuery"
            id="searchQuery"
            value={filters.searchQuery}
            onChange={handleChange}
            placeholder="Search events..."
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            autoComplete="off"
          />
        </div>

        {/* Category filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filters.category || 'All Categories'}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          >
            <option value="All Categories">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Date filters */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          />
        </div>

        {/* Sort options */}
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            id="sortBy"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          >
            <option value="date">Date</option>
            <option value="title">Title</option>
            <option value="attendees">Attendees</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
            Sort Order
          </label>
          <select
            name="sortOrder"
            id="sortOrder"
            value={filters.sortOrder}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        {/* Upcoming events toggle */}
        <div className="flex items-center h-full mt-6 sm:mt-0">
          <input
            type="checkbox"
            id="isUpcoming"
            name="isUpcoming"
            checked={filters.isUpcoming}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="isUpcoming" className="ml-2 block text-sm text-gray-700">
            Show only upcoming events
          </label>
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleClearFilters}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
} 
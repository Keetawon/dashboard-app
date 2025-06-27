import { useState } from 'react';
import { useReportData } from '../hooks/useReportData';
import SearchFilters from '../components/SearchFilters';
import RoomList from '../components/RoomList';

const HomePage = () => {
  const [filters, setFilters] = useState({});
  const { data, isLoading, error } = useReportData(filters);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Room Reports</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse and search through room installation reports. Click on any room to view detailed information about installed equipment.
        </p>
      </div>

      {/* Search Filters */}
      <SearchFilters 
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />

      {/* Results Summary */}
      {!isLoading && data && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-green-800">
              <span className="font-semibold">{data.length}</span> room{data.length !== 1 ? 's' : ''} found
            </div>
            {Object.keys(filters).length > 0 && (
              <div className="text-green-700 text-sm">
                Filtered by: {Object.entries(filters).map(([key, value]) => 
                  `${key.replace(/([A-Z])/g, ' $1').toLowerCase()}: "${value}"`
                ).join(', ')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Room List */}
      <RoomList 
        data={data}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default HomePage;
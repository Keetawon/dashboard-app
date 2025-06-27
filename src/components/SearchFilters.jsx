import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SearchFilters = ({ onFilterChange, initialFilters = {} }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: initialFilters
  });

  const watchedValues = watch();

  const onSubmit = (data) => {
    const filters = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value && value.trim() !== '')
    );
    onFilterChange(filters);
  };

  const clearFilters = () => {
    reset();
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(watchedValues).some(value => value && value.trim() !== '');

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center space-x-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-white" />
            <span className="font-semibold text-white text-lg">ค้นหาและกรองข้อมูล</span>
            {hasActiveFilters && (
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
                กำลังกรอง
              </span>
            )}
          </div>
          <div className="text-white/80 text-xl font-bold">
            {isExpanded ? '−' : '+'}
          </div>
        </button>
      </div>

      {isExpanded && (
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  หมายเลขห้อง
                </label>
                <input
                  type="text"
                  {...register('roomNumber')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="ระบุหมายเลขห้อง เช่น 70401-0209"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ชื่อลูกค้า
                </label>
                <input
                  type="text"
                  {...register('customerName')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="ระบุชื่อลูกค้า"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  บ้านเลขที่
                </label>
                <input
                  type="text"
                  {...register('addressNo')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="ระบุบ้านเลขที่"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                ค้นหา
              </button>
              
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 focus:outline-none transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span className="text-5xl">❌ล้างการค้นหา</span>
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
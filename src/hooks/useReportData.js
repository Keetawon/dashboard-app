import { useQuery } from '@tanstack/react-query';
import ApiService from '../services/apiService';
import { CONFIG } from '../constants/config.js';

const apiService = new ApiService();

export const useReportData = (searchFilters = {}) => {
  return useQuery({
    queryKey: ['reportData', searchFilters],
    queryFn: async () => {
      try {
        const rawData = await apiService.getAllData();
        return apiService.transformToReportData(rawData);
      } catch (error) {
        console.error('Error fetching data from API, using mock data:', error);
        return apiService.getMockData();
      }
    },
    select: (data) => {
      if (!data) return [];
      
      return data.filter(item => {
        const matchesRoom = !searchFilters.roomNumber || 
          item.roomNumber.toLowerCase().includes(searchFilters.roomNumber.toLowerCase());
        
        const matchesCustomer = !searchFilters.customerName || 
          item.customerName.toLowerCase().includes(searchFilters.customerName.toLowerCase());
        
        const matchesAddress = !searchFilters.addressNo || 
          item.addressNo.toLowerCase().includes(searchFilters.addressNo.toLowerCase());
        
        return matchesRoom && matchesCustomer && matchesAddress;
      });
    },
    staleTime: CONFIG.QUERY_CONFIG.STALE_TIME,
    retry: CONFIG.QUERY_CONFIG.RETRY_COUNT,
  });
};

export const useRoomDetails = (roomNumber) => {
  return useQuery({
    queryKey: ['roomDetails', roomNumber],
    queryFn: async () => {
      try {
        return await apiService.getRoomDetails(roomNumber);
      } catch (error) {
        console.error('Error fetching room details:', error);
        return { roomInfo: null, items: [] };
      }
    },
    staleTime: CONFIG.QUERY_CONFIG.STALE_TIME,
    retry: CONFIG.QUERY_CONFIG.RETRY_COUNT,
    enabled: !!roomNumber,
  });
};
import { CONFIG } from '../constants/config.js';

class ApiService {
  async fetchData(endpoint, params = {}) {
    try {
      const url = new URL(`${CONFIG.API_BASE_URL}${endpoint}`, window.location.origin);
      
      // Add query parameters
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          url.searchParams.append(key, params[key]);
        }
      });

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage += ` - ${errorData.error}`;
          }
        } catch {
          // If response is not JSON, use status text
          errorMessage += ` - ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API fetch error:', error);
      
      // Provide more specific error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the server. Please check if the application is running.');
      }
      
      throw error;
    }
  }

  async getAllData(filters = {}) {
    try {
      const params = {
        limit: 1000, // Get more data for frontend filtering
        offset: 0,
        ...filters
      };
      
      const response = await this.fetchData('/data', params);
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch data from API, using fallback:', error.message);
      // Return empty array as fallback instead of crashing the app
      return [];
    }
  }

  async getRoomDetails(roomNumber) {
    if (!roomNumber) return { roomInfo: null, items: [] };
    
    // Parse room number (format: "projectCode-unitNo")
    const roomParts = roomNumber.split('-');
    if (roomParts.length < 2) {
      return { roomInfo: null, items: [] };
    }
    
    const projectCode = roomParts[0];
    const unitNo = roomParts.slice(1).join('-'); // Handle cases like "SKWG2-B1-308"
    
    // Get all data for this project first
    const params = {
      limit: 1000
    };
    
    const response = await this.fetchData('/data', params);
    const allData = response.data || [];
    
    // Filter for exact room match
    const roomData = allData.filter(item => {
      const itemProjectCode = item.project_code || '';
      const itemUnitNo = item.unit_no || '';
      return itemProjectCode === projectCode && itemUnitNo === unitNo;
    });
    
    if (roomData.length === 0) {
      return { roomInfo: null, items: [] };
    }

    // Get room info from first item
    const firstItem = roomData[0];
    const roomInfo = {
      roomNumber: `${firstItem.project_code}-${firstItem.unit_no}`,
      customerName: firstItem.contact_name || '',
      addressNo: firstItem.house_number || ''
    };

    // Transform items - each database record becomes one item
    const items = roomData.map((item, index) => ({
      items_group: item.items_group || '',
      items: item.product_detail || '',
      สีรายการติดตั้ง: item.color || '',
      ห้องที่ติดตั้ง: item.room_type || '',
      จุดที่ติดตั้ง: item.install_point || '',
      installedDate: item.install_date || '',
      brand: item.brand || '',
      status: item.install_status || '',
      id: `${roomNumber}-${index}`
    }));

    return { roomInfo, items };
  }

  async getStats() {
    try {
      return await this.fetchData('/stats');
    } catch (error) {
      console.error('Failed to fetch stats from API:', error.message);
      return {
        total_records: 0,
        unique_projects: 0,
        install_status_breakdown: {},
        monthly_breakdown: [],
        top_brands: {}
      };
    }
  }

  async getProjects() {
    try {
      return await this.fetchData('/projects');
    } catch (error) {
      console.error('Failed to fetch projects from API:', error.message);
      return { projects: [] };
    }
  }

  transformToReportData(rawData) {
    const processedData = [];
    const seenRooms = new Set();

    for (const item of rawData) {
      // Check if both project_code and unit_no exist and are not empty
      const projectCode = item.project_code || '';
      const unitNo = item.unit_no || '';
      
      // Skip if either is missing
      if (!projectCode || !unitNo || projectCode === '' || unitNo === '') {
        continue;
      }
      
      const roomNumber = `${projectCode}-${unitNo}`;
      
      if (!seenRooms.has(roomNumber)) {
        seenRooms.add(roomNumber);
        
        processedData.push({
          roomNumber,
          customerName: item.contact_name || '',
          addressNo: item.house_number || '',
          items: item.product_detail || '',
          สีรายการติดตั้ง: '', // Not available in new structure
          ห้องที่ติดตั้ง: item.room_type || '',
          จุดที่ติดตั้ง: item.install_point || '',
          installedDate: item.install_date || '',
          id: roomNumber
        });
      }
    }

    return processedData.sort((a, b) => {
      // Sort by install date (newest first), then by room number
      if (a.installedDate && b.installedDate) {
        return new Date(b.installedDate) - new Date(a.installedDate);
      }
      return a.roomNumber.localeCompare(b.roomNumber);
    });
  }

  getMockData() {
    return [
      {
        roomNumber: '70401-0209',
        customerName: 'นาย ฉมาดล เดชารัมย์',
        addressNo: '177/210',
        items: 'เครื่องปรับอากาศ SAMSUNG 9400 BTU',
        installedDate: '2024-07-25',
        id: '70401-0209'
      }
    ];
  }
}

export default ApiService;
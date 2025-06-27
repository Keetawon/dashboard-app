import { Link, useParams } from 'react-router-dom';
import { useRoomDetails } from '../hooks/useReportData';

const RoomDetails = () => {
  const { roomNumber } = useParams();
  const { data: roomData, isLoading, error } = useRoomDetails(roomNumber);
  
  const room = roomData?.roomInfo;
  const items = roomData?.items || [];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded-lg w-48"></div>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-64"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-36"></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="text-red-700 font-semibold text-lg mb-2">เกิดข้อผิดพลาดในการโหลดรายละเอียดห้อง</div>
          <div className="text-red-600 text-sm mb-6">
            {error.message || 'ไม่สามารถโหลดรายละเอียดห้องได้ กรุณาลองใหม่อีกครั้ง'}
          </div>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            กลับไปรายการห้อง
          </Link>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="text-gray-700 font-semibold text-lg mb-2">ไม่พบห้อง</div>
          <div className="text-gray-600 text-sm mb-6">
            ไม่สามารถค้นหาห้อง {roomNumber} ในระบบได้
          </div>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            กลับไปรายการห้อง
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          กลับไปรายการห้อง
        </Link>
      </div>

      {/* Room Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4">ห้อง {room.roomNumber}</h1>
            <div className="space-y-2 text-blue-100">
              <div>
                <span className="font-medium">{room.customerName}</span>
              </div>
              <div>
                <span>บ้านเลขที่ {room.addressNo}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="px-4 py-2 bg-white bg-opacity-20 rounded-lg text-sm font-medium">
              {items.length} รายการติดตั้ง
            </span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            รายการสินค้าและการติดตั้ง
          </h2>
          <p className="text-gray-600 mt-1">รายละเอียดของสินค้าทั้งหมดที่ติดตั้งในห้องนี้</p>
        </div>
        
        {items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">
                    กลุ่มสินค้าจัดส่ง/ติดตั้ง
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">
                    รายการสินค้า
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">
                    สีรายการติดตั้ง/จัดส่ง
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">
                    ห้องที่ติดตั้ง
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">
                    จุดที่ติดตั้ง
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">
                    วันที่ติดตั้ง
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item, index) => (
                  <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-200`}>
                    <td className="px-8 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.items_group || '-'}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs">
                        {item.items || '-'}
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-sm text-gray-700">
                        {item.สีรายการติดตั้ง || '-'}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-sm text-gray-700">
                        {item.ห้องที่ติดตั้ง || '-'}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-sm text-gray-700">
                        {item.จุดที่ติดตั้ง || '-'}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-sm text-gray-700">
                        {item.installedDate ? new Date(item.installedDate).toLocaleDateString('th-TH') : '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div className="text-gray-500 font-medium text-lg mb-2">ไม่พบรายการสินค้า</div>
            <div className="text-gray-400">
              ห้องนี้ยังไม่มีการบันทึกการติดตั้งใด ๆ
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDetails;
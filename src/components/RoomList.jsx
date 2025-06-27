import { Link } from 'react-router-dom';

const RoomList = ({ data, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-200 rounded"></div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 rounded-lg w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="w-20 h-8 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div className="text-red-700 font-semibold text-lg mb-2">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>
        <div className="text-red-600 text-sm">
          {error.message || 'ไม่สามารถโหลดข้อมูลห้องได้ กรุณาลองใหม่อีกครั้ง'}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-12 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        </div>
        <div className="text-gray-600 font-semibold text-xl mb-3">ไม่พบข้อมูลห้อง</div>
        <div className="text-gray-500">
          ลองปรับเปลี่ยนตัวกรองการค้นหา หรือตรวจสอบข้อมูลใหม่ภายหลัง
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white mb-6">
        <h2 className="text-2xl font-bold mb-2">รายการห้องติดตั้ง</h2>
        <p className="text-blue-100">พบทั้งหมด {data.length} ห้อง</p>
      </div>
      
      <div className="grid gap-4 md:gap-6">
        {data.map((room, index) => (
          <Link 
            key={room.id}
            to={`/room/${room.roomNumber}`}
            className="group block"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {room.roomNumber}
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-700 font-medium">{room.customerName}</span>
                    </div>
                    
                    <div>
                      <span className="text-gray-600">{room.addressNo}</span>
                    </div>
                    
                    {room.installedDate && (
                      <div>
                        <span className="text-gray-600 text-sm">ติดตั้งเมื่อ: {room.installedDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RoomList;
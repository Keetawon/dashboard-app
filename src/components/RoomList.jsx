import { Link } from 'react-router-dom';
import ErrorCard from './common/ErrorCard';
import LoadingCard from './common/LoadingCard';
import EmptyCard from './common/EmptyCard';

const RoomList = ({ data, isLoading, error }) => {
  if (isLoading) {
    return <LoadingCard />;
  }

  if (error) {
    return (
      <ErrorCard
        title="เกิดข้อผิดพลาดในการโหลดข้อมูล"
        message={error.message || 'ไม่สามารถโหลดข้อมูลห้องได้ กรุณาลองใหม่อีกครั้ง'}
      />
    );
  }

  if (!data || data.length === 0) {
    return <EmptyCard title="ไม่พบข้อมูลห้อง" />;
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
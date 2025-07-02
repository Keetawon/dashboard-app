const EmptyCard = ({ 
  title = 'ไม่พบข้อมูล', 
  message = 'ลองปรับเปลี่ยนตัวกรองการค้นหา หรือตรวจสอบข้อมูลใหม่ภายหลัง',
  icon
}) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-12 text-center">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        {icon || (
          <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
      </div>
      <div className="text-gray-600 font-semibold text-xl mb-3">{title}</div>
      <div className="text-gray-500">{message}</div>
    </div>
  );
};

export default EmptyCard;
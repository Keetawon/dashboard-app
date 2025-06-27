import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                รายงานการติดตั้งสินค้า Smartify
              </h1>
              <p className="text-gray-600">
                รายงานการติดตั้งสินค้า Smartify ท่านสามารถเลือกห้องในรายการข้างล่าง เพื่อเข้าไปดูรายละเอียดสินค้าได้ หรือสามารถใช้ค้นหาเพื่อหาห้องที่ท่านต้องการได้
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 text-sm font-medium">ข้อมูลสด</span>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                <span className="text-blue-700 text-sm font-medium">Database API</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-gray-500 mb-4 md:mb-0">
              © 2024 Installation Dashboard. Powered by Local Database API.
            </div>
            <div className="flex items-center space-x-6 text-xs text-gray-400">
              <span>🚀 Real-time Data Sync</span>
              <span>📊 Modern UI Design</span>
              <span>⚡ Fast Performance</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
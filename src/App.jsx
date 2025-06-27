import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CONFIG } from './constants/config.js';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import RoomDetails from './components/RoomDetails';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CONFIG.QUERY_CONFIG.STALE_TIME,
      retry: CONFIG.QUERY_CONFIG.RETRY_COUNT,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="room/:roomNumber" element={<RoomDetails />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App

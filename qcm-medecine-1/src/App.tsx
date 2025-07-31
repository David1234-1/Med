import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Import from './pages/Import';
import Study from './pages/Study';
import Assistant from './pages/Assistant';
import Profile from './pages/Profile';
import { useState } from 'react';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/import" element={<Import />} />
              <Route path="/study" element={<Study />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;

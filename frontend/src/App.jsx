import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CustomerHome from './pages/Customer/Home';
import AdminDashboard from './pages/Admin/Dashboard';
import StaffDashboard from './pages/Staff/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <nav className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold text-indigo-600">
                  LuxeStay SaaS
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                  Customer
                </Link>
                <Link to="/admin" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                  Admin
                </Link>
                <Link to="/staff" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                  Staff
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<CustomerHome />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/staff" element={<StaffDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import CustomerHome from './pages/Customer/Home';
import Login from './pages/Auth/Login';

function Navigation() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              LuxeStay Customer
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {token ? (
              <button onClick={handleLogout} className="text-red-500 hover:text-red-700 font-medium transition-colors">
                Logout
              </button>
            ) : (
              <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/booking" element={<CustomerHome />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

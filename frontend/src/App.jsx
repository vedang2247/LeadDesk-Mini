import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import PublicForm from './components/PublicForm';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">

        {/* Navigation Bar */}
        <nav className="w-full bg-white border-b border-slate-200 py-3 px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="font-semibold text-slate-900">LeadDesk Mini</span>
            <span className="text-slate-400 text-sm ml-2 border-l border-slate-200 pl-2">Prototype Sandbox</span>
          </div>

          <div className="flex gap-2">
            <a href="/form" className="px-3 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded text-slate-700">Public Form</a>
            <a href="/login" className="px-3 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded text-slate-700">Admin Login</a>
            <a href="/dashboard" className="px-3 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded text-slate-700">Dashboard</a>
          </div>
        </nav>

        {/* Main Content Routing */}
        <main className="flex-grow flex items-center justify-center p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/form" replace />} />
            <Route path="/form" element={<PublicForm />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer className="w-full border-t border-slate-200 py-4 text-center text-xs text-slate-500 bg-white">
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Built for Digital Heroes Training Task
          </a>
        </footer>
      </div>
    </Router>
  );
}

export default App;
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-slate-800">404</h1>
        <p className="text-2xl md:text-3xl font-light leading-normal text-slate-600 mt-4 mb-8">
          Sorry, we couldn't find this page.
        </p>
        <Link 
          to="/dashboard" 
          className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
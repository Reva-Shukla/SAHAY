import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 mx-auto flex items-center justify-center shadow-xs">
          <HeartPulse className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900">404</h1>
        <p className="text-slate-600 text-sm">
          The requested route was not found on the SAHAY AI Mental Health Support Portal.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Link
            to="/patient"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            SAHAY Patient Portal
          </Link>
          <Link
            to="/counsellor/login"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Counsellor Login
          </Link>
        </div>
      </div>
    </div>
  );
};

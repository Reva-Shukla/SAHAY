import React from 'react';

export const SidebarSkeleton: React.FC = () => (
  <div className="space-y-3 p-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="p-3.5 rounded-2xl bg-white border border-slate-200 animate-pulse space-y-2">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-slate-200 rounded w-24"></div>
          <div className="h-3 bg-slate-200 rounded w-12"></div>
        </div>
        <div className="h-3 bg-slate-200 rounded w-36"></div>
      </div>
    ))}
  </div>
);

export const ChartSkeleton: React.FC = () => (
  <div className="w-full h-64 bg-slate-100 rounded-2xl border border-slate-200 animate-pulse p-4 flex flex-col justify-between">
    <div className="h-4 bg-slate-200 rounded w-48 mb-4"></div>
    <div className="flex-1 flex items-end justify-between gap-3 pt-6">
      {[40, 65, 30, 80, 50, 90, 70].map((h, i) => (
        <div key={i} className="bg-slate-300 rounded-t w-full" style={{ height: `${h}%` }}></div>
      ))}
    </div>
  </div>
);

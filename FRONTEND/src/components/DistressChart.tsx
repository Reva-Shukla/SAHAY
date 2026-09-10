import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import type { DistressHistoryEntry } from '../types';

interface Props {
  history: DistressHistoryEntry[];
}

export const DistressChart: React.FC<Props> = ({ history }) => {
  if (!history || history.length === 0) {
    return <div className="text-center py-10 text-slate-400 text-xs">No distress log history available.</div>;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as DistressHistoryEntry;
      return (
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xl text-xs space-y-1 z-50">
          <p className="font-extrabold text-slate-900">{data.week} ({data.timestamp})</p>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Distress Score:</span>
            <span className={`font-extrabold ${data.score >= 70 ? 'text-rose-600' : data.score >= 40 ? 'text-yellow-600' : 'text-emerald-600'}`}>
              {data.score} / 100
            </span>
          </div>
          <p className="text-slate-700">Mood State: <strong>{data.mood}</strong></p>
          {data.predictedScore && (
            <p className="text-indigo-600 text-[11px] font-semibold">AI Forecast Trajectory: {data.predictedScore}</p>
          )}
          {data.flags && data.flags.length > 0 && (
            <div className="pt-1 text-[10px] text-rose-600 font-mono font-bold">
              Flags: {data.flags.join(', ')}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={history} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="week" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Critical Risk Threshold Lines */}
          <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'High Risk (70+)', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
          <ReferenceLine y={40} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Moderate (40+)', fill: '#f59e0b', fontSize: 10, fontWeight: 'bold' }} />

          {/* Actual Distress Score Line */}
          <Line
            type="monotone"
            dataKey="score"
            name="Distress Score"
            stroke="#4f46e5"
            strokeWidth={3}
            dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2 }}
            activeDot={{ r: 7, fill: '#ef4444' }}
            animationDuration={1500}
          />

          {/* AI Predicted Score Line */}
          <Line
            type="monotone"
            dataKey="predictedScore"
            name="AI Forecast Trajectory"
            stroke="#9333ea"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3, fill: '#9333ea' }}
            animationDuration={2000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

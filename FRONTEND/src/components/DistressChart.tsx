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
import { useLanguage } from '../context/LanguageContext';

interface Props {
  history: DistressHistoryEntry[];
}

export const DistressChart: React.FC<Props> = ({ history }) => {
  const { language } = useLanguage();

  if (!history || history.length === 0) {
    return <div className="text-center py-10 text-slate-400 text-xs">No distress log history available.</div>;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as DistressHistoryEntry;
      const status = data.score >= 70
        ? (language === 'hi' ? 'उच्च जोखिम' : 'High Risk')
        : data.score >= 40
        ? (language === 'hi' ? 'मध्यम' : 'Moderate')
        : (language === 'hi' ? 'सामान्य' : 'Normal');

      return (
        <div className="bg-slate-900/90 backdrop-blur-md text-white p-3.5 rounded-2xl border border-slate-700/50 shadow-xl text-xs space-y-1.5 z-50">
          <p className="font-extrabold text-slate-200">{data.week}</p>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">{language === 'hi' ? 'जोखिम स्कोर:' : 'Risk Score:'}</span>
            <span className={`font-extrabold ${data.score >= 70 ? 'text-rose-400' : data.score >= 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {data.score} / 100
            </span>
          </div>
          <p className="text-slate-300 font-medium">
            {language === 'hi' ? 'स्थिति:' : 'Status:'} <strong className="text-white">{status}</strong>
          </p>
          {data.predictedScore && (
            <p className="text-indigo-300 text-[11px] font-semibold pt-0.5">
              {language === 'hi' ? 'पूर्वानुमान:' : 'Forecast Trajectory:'} {data.predictedScore}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 sm:h-72 pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={history} margin={{ top: 12, right: 16, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis 
            dataKey="week" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} 
            dy={8}
          />
          <YAxis 
            domain={[0, 100]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} 
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Subtle Threshold Lines */}
          <ReferenceLine 
            y={70} 
            stroke="#f87171" 
            strokeDasharray="4 4" 
            strokeOpacity={0.6}
            label={{ value: language === 'hi' ? 'उच्च जोखिम (70+)' : 'High Risk (70+)', fill: '#ef4444', fontSize: 10, fontWeight: 600, position: 'insideTopRight' }} 
          />
          <ReferenceLine 
            y={40} 
            stroke="#fbbf24" 
            strokeDasharray="4 4" 
            strokeOpacity={0.6}
            label={{ value: language === 'hi' ? 'मध्यम (40+)' : 'Moderate (40+)', fill: '#d97706', fontSize: 10, fontWeight: 600, position: 'insideTopRight' }} 
          />

          {/* Actual Distress Score Line */}
          <Line
            type="monotone"
            dataKey="score"
            name="Distress Score"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#6366f1' }}
            activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
            animationDuration={1200}
          />

          {/* Forecast Line */}
          <Line
            type="monotone"
            dataKey="predictedScore"
            name="Forecast Trajectory"
            stroke="#a855f7"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3, strokeWidth: 1, fill: '#fff', stroke: '#a855f7' }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

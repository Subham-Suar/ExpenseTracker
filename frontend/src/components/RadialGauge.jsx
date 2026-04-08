import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function RadialGauge({ title, amount, percentage, color }) {
  const data = [
    { name: "Active", value: percentage },
    { name: "Remaining", value: 100 - percentage }
  ];

  return (
    <div className="interactive-card bg-slate-800/95 p-4 xs:p-5 sm:p-6 lg:p-8 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-slate-700 flex flex-col items-center justify-center text-center min-h-fit overflow-hidden">
      <h3 className="text-sm xs:text-base sm:text-lg lg:text-xl font-bold mb-4 xs:mb-5 sm:mb-6 lg:mb-8 leading-tight" style={{ color }}>{title}</h3>
      <div className="relative w-full h-[140px] xs:h-[160px] sm:h-[180px] lg:h-[200px] flex justify-center items-center">
        <div className="absolute inset-0 flex justify-center items-end pb-4 xs:pb-5 sm:pb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={50}
                outerRadius={75}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
                cornerRadius={8}
                isAnimationActive={true}
              >
                <Cell key="cell-0" fill={color} />
                <Cell key="cell-1" fill="#334155" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="absolute top-1/3 xs:top-2/5 sm:top-2/5 lg:top-1/3 flex flex-col items-center justify-center z-10">
          <span className="text-sm xs:text-base sm:text-lg lg:text-2xl font-extrabold text-slate-100 break-words px-2 leading-tight">{amount}</span>
          <span className="text-xs xs:text-sm font-semibold text-slate-400 mt-1">{percentage}%</span>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-4 xs:mt-5 sm:mt-6 lg:mt-8 font-medium">This Month data</p>
    </div>
  );
}

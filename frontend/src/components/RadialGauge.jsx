import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function RadialGauge({ title, amount, percentage, color }) {
  const data = [
    { name: "Active", value: percentage },
    { name: "Remaining", value: 100 - percentage }
  ];

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-700 flex flex-col items-center justify-center text-center">
      <h3 className="text-lg font-bold mb-6" style={{ color }}>{title}</h3>
      <div className="relative w-full h-36 flex justify-center">
        <div className="absolute inset-0 top-auto h-[120%] w-[100%] ml-[-50%] left-[50%] flex justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={80}
                outerRadius={105}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
                cornerRadius={12}
                isAnimationActive={true}
              >
                <Cell key="cell-0" fill={color} />
                <Cell key="cell-1" fill="#334155" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="absolute bottom-2 flex flex-col items-center">
          <span className="text-2xl font-extrabold text-slate-100">{amount}</span>
          <span className="text-sm font-semibold text-slate-400 mt-1">{percentage}%</span>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-8 font-medium">This Month data</p>
    </div>
  );
}

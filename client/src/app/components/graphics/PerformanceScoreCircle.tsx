import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface PerformanceScoreCircleProps {
  score: number;
}

export default function PerformanceScoreCircle({ score = 0 }: PerformanceScoreCircleProps) {
  // Ensure score is a valid number between 0 and 100
  const validScore = isNaN(score) ? 0 : Math.min(Math.max(score, 0), 100);
  
  const data = [
    { name: 'Score', value: validScore },
    { name: 'Remaining', value: 100 - validScore }
  ];
  
  // Color logic based on score
  const getScoreColor = (score: number) => {
    if (score >= 90) return '#22c55e'; // Green for excellent
    if (score >= 70) return '#3b82f6'; // Blue for good
    if (score >= 50) return '#f59e0b'; // Orange for average
    return '#ef4444'; // Red for poor
  };

  const COLORS = [getScoreColor(validScore), '#e5e7eb'];

  return (
    <div className="flex flex-col items-center justify-center w-full h-64">
      <h2 className="text-xl font-bold mb-4">Website Performance Score</h2>
      <div className="relative w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={90}
              endAngle={-270}
              innerRadius="70%"
              outerRadius="90%"
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold">{validScore}%</span>
        </div>
      </div>
    </div>
  );
}
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MetricsChart({ results, metricChoice }) {
  // Transforms results data for charting
  const data = Object.entries(results.ensemble_results).map(([name, value]) => ({
    name,
    value: typeof value === 'number' ? value : 0
  }));

  return (
    <div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="name" 
            stroke="rgba(255,255,255,0.7)"
            style={{ fontSize: '12px' }}
            angle={-45}
            textAnchor="end"
            height={80}
            label={{ value: 'Models', position: 'insideBottom', offset: -30, fill: 'rgba(255,255,255,0.85)', fontSize: 12 }}
          />
          <YAxis 
            domain={[0, 1]} 
            stroke="rgba(255,255,255,0.7)"
            style={{ fontSize: '12px' }}
            label={{ value: 'Accuracy', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.85)', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0,0,0,0.8)', 
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: 'white'
            }}
            formatter={(value) => [`${(value * 100).toFixed(1)}%`, metricChoice]} 
          />
          <Bar 
            dataKey="value" 
            fill="url(#barGradient)"
            radius={[8, 8, 0, 0]}
          />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#667eea" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#764ba2" stopOpacity={0.8} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
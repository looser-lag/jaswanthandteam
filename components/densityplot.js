import { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

export default function DensityPlot({ values = [] }) {
  const data = useMemo(() => {
    if (!Array.isArray(values) || values.length === 0) return [];
    const bandwidth = 0.08;
    const gridCount = 100;
    const xs = Array.from({ length: gridCount + 1 }, (_, i) => i / gridCount);
    const norm = 1 / Math.sqrt(2 * Math.PI * bandwidth * bandwidth);
    const densities = xs.map(x => {
      let sum = 0;
      for (const v of values) {
        const d = (x - v) / bandwidth;
        sum += Math.exp(-0.5 * d * d);
      }
      return { x, y: norm * (sum / values.length) };
    });
    return densities;
  }, [values]);

  return (
    <div className="mt-6">
      <div className="text-white font-semibold mb-2 flex items-center">
        <span className="mr-2">📈</span>
        Prediction Probability Density
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 30 }}>
          <defs>
            <linearGradient id="densityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="x"
            type="number"
            domain={[0, 1]}
            ticks={[0, 0.25, 0.5, 0.75, 1]}
            stroke="rgba(255,255,255,0.7)"
            style={{ fontSize: '12px' }}
            tickFormatter={(v) => v.toFixed(2)}
            label={{ value: 'Probability', position: 'insideBottom', offset: -20, fill: 'rgba(255,255,255,0.85)', fontSize: 12 }}
          />
          <YAxis
            dataKey="y"
            allowDecimals
            stroke="rgba(255,255,255,0.7)"
            style={{ fontSize: '12px' }}
            label={{ value: 'Density', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.85)', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.85)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: 'white'
            }}
            formatter={(value, name) => [value.toFixed(3), name === 'y' ? 'Density' : 'x']}
            labelFormatter={(label) => `x = ${Number(label).toFixed(2)}`}
          />
          <Area type="monotone" dataKey="y" stroke="#60a5fa" fill="url(#densityGradient)" />
          <ReferenceLine x={0} stroke="rgba(255,255,255,0.15)" />
          <ReferenceLine x={1} stroke="rgba(255,255,255,0.15)" />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex justify-between text-xs text-white/60 mt-1">
        <span>0</span>
        <span>0.25</span>
        <span>0.5</span>
        <span>0.75</span>
        <span>1.0</span>
      </div>
    </div>
  );
}



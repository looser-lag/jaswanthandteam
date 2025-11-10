import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ZAxis } from 'recharts';

export default function MetricsScatter({ results }) {
  if (!results || !results.ensemble_results) return null;

  const labels = Object.keys(results.ensemble_results);
  const data = labels.map((name, idx) => ({
    x: typeof results.ensemble_results[name] === 'number' ? results.ensemble_results[name] : 0,
    y: idx,
    name
  }));

  return (
    <div className="mt-6">
      <div className="text-white font-semibold mb-2 flex items-center">
        <span className="mr-2">🔵</span>
        Scatterplot View (Accuracy vs Model)
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            type="number"
            dataKey="x"
            name="Accuracy"
            domain={[0, 1]}
            stroke="rgba(255,255,255,0.7)"
            tickFormatter={(v) => `${Math.round(v * 100)}%`}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Model"
            domain={[0, labels.length - 1]}
            tickFormatter={(v) => labels[v] ?? ''}
            stroke="rgba(255,255,255,0.7)"
            interval={0}
          />
          <ZAxis type="number" dataKey="x" range={[60, 120]} />
          <Tooltip
            formatter={(value, name, p) => {
              if (name === 'x') return [`${(value * 100).toFixed(1)}%`, 'Accuracy'];
              return [value, name];
            }}
            labelFormatter={() => ''}
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.85)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: 'white'
            }}
          />
          <Scatter data={data} fill="#60a5fa" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}



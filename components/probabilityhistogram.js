import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProbabilityHistogram({ results }) {
  if (!results || !results.probability_data) return null;

  const bins = 10;
  const binWidth = 1 / bins;
  const histogram = Array(bins).fill(0);
  
  results.probability_data.forEach(prob => {
    const binIndex = Math.min(Math.floor(prob / binWidth), bins - 1);
    histogram[binIndex]++;
  });

  const data = histogram.map((count, index) => ({
    range: `${(index * binWidth).toFixed(1)}-${((index + 1) * binWidth).toFixed(1)}`,
    count,
    prob: (index * binWidth + binWidth / 2).toFixed(2)
  }));

  return (
    <div className="glass-morphism rounded-2xl p-6 hover-lift">
      <h3 className="text-white font-semibold mb-4 flex items-center text-xl">
        <span className="mr-2">📊</span>
        Prediction Probability Distribution
      </h3>
      <p className="text-white/70 text-sm mb-4">
        Shows how confident the bagged model is across all predictions. Higher values mean more confident predictions.
      </p>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="range" 
            stroke="rgba(255,255,255,0.7)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.7)"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0,0,0,0.8)', 
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: 'white'
            }}
            formatter={(value) => [`${value} predictions`, 'Count']}
          />
          <Bar 
            dataKey="count" 
            fill="url(#probabilityGradient)"
            radius={[8, 8, 0, 0]}
          />
          <defs>
            <linearGradient id="probabilityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#667eea" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#764ba2" stopOpacity={0.8} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}




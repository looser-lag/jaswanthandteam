// components/ConfusionMatrix.js
export default function ConfusionMatrix({ results }) {
  if (!results.confusion_matrix) return null;

  const cm = results.confusion_matrix;
  const total = cm.flat().reduce((sum, val) => sum + val, 0);
  const correct = cm.reduce((sum, row, i) => sum + row[i], 0);
  const accuracy = correct / total;

  return (
    <div>
      <h3 className="text-white font-semibold mb-4 flex items-center text-xl">
        <span className="mr-2">🎯</span>
        Confusion Matrix (Bagged Model)
      </h3>
      <p className="text-white/70 text-sm mb-4">
        Shows how well the model classified each class. Green = correct predictions, Red = errors.
      </p>
      <div className="flex justify-center mb-4">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cm.length + 1}, 1fr)` }}>
          {/* Header row */}
          <div className="p-2 font-semibold text-center text-white/80 text-xs"></div>
          {cm.map((_, i) => (
            <div key={i} className="p-2 font-semibold text-center text-white/80 text-xs">Pred {i}</div>
          ))}
          
          {/* Matrix rows */}
          {cm.map((row, i) => (
            <div key={`row-${i}`} style={{ display: 'contents' }}>
              <div className="p-2 font-semibold text-center text-white/80 text-xs">True {i}</div>
              {row.map((cell, j) => {
                const percentage = row.reduce((sum, val) => sum + val, 0) > 0 ? cell / row.reduce((sum, val) => sum + val, 0) : 0;
                const isDiagonal = i === j;
                return (
                  <div
                    key={`cell-${i}-${j}`}
                    className={`w-16 h-16 flex flex-col items-center justify-center text-xs font-medium rounded border-2 ${
                      isDiagonal 
                        ? 'bg-green-500/80 border-green-400 text-white' 
                        : 'bg-red-500/80 border-red-400 text-white'
                    }`}
                  >
                    <span className="font-bold">{cell}</span>
                    <span className="text-xs">{Math.round(percentage * 100)}%</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20">
        <p className="text-sm text-white/80 leading-relaxed">
          <strong className="text-green-300">Diagonal (green):</strong> Correct predictions • 
          <strong className="text-red-300 ml-2">Off-diagonal (red):</strong> Errors • 
          <strong className="text-white ml-2">Total correct:</strong> {correct}/{total} ({((correct/total)*100).toFixed(1)}%)
        </p>
      </div>
    </div>
  );
}
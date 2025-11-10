export default function DecisionBoundary({ dataset, results }) {
  if (!dataset || !results) return null;

  return (
    <div className="glass-morphism rounded-2xl p-6 hover-lift">
      <h3 className="text-white font-semibold mb-4 flex items-center text-xl">
        <span className="mr-2">🎯</span>
        Decision Boundary Visualization
      </h3>
      <p className="text-white/70 text-sm mb-4">
        Visual representation of how the bagged model separates different classes. The boundaries show regions where the model is confident about predictions.
      </p>
      <div className="relative w-full h-64 bg-white/5 rounded-xl border border-white/20 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-2 p-4 w-full h-full">
          {[0, 1, 2].map((classId) => (
            <div
              key={classId}
              className="rounded-lg border-2 border-white/30 flex flex-col items-center justify-center p-4"
              style={{
                background: `linear-gradient(135deg, rgba(102, 126, 234, ${0.3 + classId * 0.1}), rgba(118, 75, 162, ${0.3 + classId * 0.1}))`
              }}
            >
              <div className="text-3xl mb-2">
                {classId === 0 ? '🌺' : classId === 1 ? '🌸' : '🌻'}
              </div>
              <div className="text-white font-semibold text-sm">
                Class {classId}
              </div>
              <div className="text-white/70 text-xs mt-1">
                {dataset.target_names?.[classId] || `Class ${classId}`}
              </div>
            </div>
          ))}
        </div>
        {/* Overlay helper text removed to avoid blocking the visualization */}
      </div>
      <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20">
        <p className="text-white/80 text-xs leading-relaxed">
          💡 <strong>Key Insight:</strong> Bagging combines multiple models to create smoother, more accurate boundaries between classes. Each model in the ensemble sees different data, reducing overfitting and improving generalization.
        </p>
      </div>
    </div>
  );
}




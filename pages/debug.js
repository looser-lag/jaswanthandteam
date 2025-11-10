import { useState } from 'react';

export default function Debug() {
  const [clicks, setClicks] = useState(0);
  const [dataset, setDataset] = useState(null);

  const handleButtonClick = (datasetName) => {
    console.log(`Button clicked: ${datasetName}`);
    setClicks(prev => prev + 1);
    setDataset(datasetName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Debug Test</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button 
            onClick={() => handleButtonClick('iris')}
            className="bg-white/20 text-white p-4 rounded-lg hover:bg-white/30 transition-colors border border-white/30"
          >
            🌺 Flower Dataset
          </button>
          <button 
            onClick={() => handleButtonClick('wine')}
            className="bg-white/20 text-white p-4 rounded-lg hover:bg-white/30 transition-colors border border-white/30"
          >
            🍷 Wine Dataset
          </button>
        </div>

        <div className="bg-white/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Debug Info</h2>
          <p className="text-white">Button clicks: {clicks}</p>
          <p className="text-white">Selected dataset: {dataset || 'None'}</p>
          <p className="text-white mt-4">Check browser console for click logs</p>
        </div>
      </div>
    </div>
  );
}
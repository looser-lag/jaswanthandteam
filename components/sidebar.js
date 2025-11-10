import { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';

export default function Sidebar({ sidebarState, setSidebarState, dataset, onDatasetLoad, onTrainModel, loading, currentStep, setCurrentStep }) {
  const [scrollY, setScrollY] = useState(0);
  const contentRef = useRef(null);
  const [sampledPoints, setSampledPoints] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        setScrollY(contentRef.current.scrollTop);
      }
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener('scroll', handleScroll);
      return () => content.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Bootstrap sampling animation
  useEffect(() => {
    const generatePoints = () => {
      return Array.from({ length: 24 }, () => ({
        id: Math.random(),
        x: Math.random() * 200 + 20,
        y: Math.random() * 150 + 30,
        selected: Math.random() > 0.7,
        delay: Math.random() * 800
      }));
    };

    // initialize immediately so the UI shows movement without waiting
    setSampledPoints(generatePoints());

    // periodically refresh selection and slightly jitter positions for motion
    const interval = setInterval(() => {
      setSampledPoints(prev =>
        (prev.length ? prev : generatePoints()).map(p => ({
          ...p,
          x: Math.max(20, Math.min(220, p.x + (Math.random() - 0.5) * 6)),
          y: Math.max(30, Math.min(180, p.y + (Math.random() - 0.5) * 6)),
          selected: Math.random() > 0.7,
          delay: Math.random() * 800
        }))
      );
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          onDatasetLoad({
            name: file.name,
            rows: results.data,
          });
        },
      });
    }
  };

  const updateSidebarState = (key, value) => {
    setSidebarState(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-72 bg-gray-800/80 backdrop-blur-lg border-r border-gray-700/50 flex flex-col h-screen relative">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50 z-10 bg-gray-900/50">
        <h2 className="text-xl font-bold text-gray-100">Bagging Explorer</h2>
        <p className="text-gray-400 text-sm mt-1">Interactive Ensemble Learning</p>
      </div>

      {/* Content */}
      <div ref={contentRef} className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
        {/* Step 1: Dataset Selection */}
        <div className={`transition-all duration-500 ${currentStep >= 1 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
          <label className="block text-sm font-medium text-gray-200 mb-3">
            {currentStep === 1 ? "🎯 Step 1: Choose Dataset" : "📊 Dataset"}
          </label>
          <div className="relative">
            <select
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'csv') {
                  updateSidebarState('selectedDataset', 'csv');
                } else {
                  onDatasetLoad(value);
                }
              }}
              value={dataset?.name?.toLowerCase().replace(' ', '') || ''}
              className="w-full px-3 py-2 bg-gray-700/40 border border-gray-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all appearance-none"
            >
              <option value="" disabled>Select a dataset</option>
              <option value="cancer">🎗️ Cancer</option>
              <option value="wine">🍷 Wine</option>
              <option value="iris">🌺 Flower</option>
              <option value="csv">📄 Upload CSV</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          {sidebarState.selectedDataset === 'csv' && (
            <div className="mt-3">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-gray-200 hover:file:bg-gray-500"
              />
            </div>
          )}
        </div>

        {/* Step 2: Base Model */}
        <div className={`transition-all duration-500 ${currentStep >= 2 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            {currentStep === 2 ? "🌱 Step 2: Base Model" : "Base Model"}
          </label>
          <select
            value={sidebarState.baseModel}
            onChange={(e) => updateSidebarState('baseModel', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700/40 border border-gray-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
          >
            <option>Decision Tree</option>
            <option>Logistic Regression</option>
            <option>K-Nearest Neighbors</option>
            <option>Support Vector Machine</option>
            <option>Naive Bayes</option>
            <option>Neural Network</option>
          </select>
          <p className="text-gray-400 text-xs mt-1">
            High-variance models work best with bagging
          </p>
        </div>

        {/* Step 3: Ensemble Size */}
        <div className={`transition-all duration-500 ${currentStep >= 3 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            {currentStep === 3 ? "🔢 Step 3: Ensemble Size" : "Ensemble Size"}
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="1"
              max="50"
              value={sidebarState.nEstimators}
              onChange={(e) => updateSidebarState('nEstimators', parseInt(e.target.value))}
              className="w-full slider-thumb"
            />
            <div className="flex justify-between text-gray-300 text-sm">
              <span>1</span>
              <span className="font-bold text-gray-200 text-lg">{sidebarState.nEstimators}</span>
              <span>50</span>
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-1">
            Number of models in ensemble
          </p>
        </div>

        {/* Step 4: Compare Methods */}
        <div className={`transition-all duration-500 ${currentStep >= 4 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
          <label className="block text-sm font-medium text-gray-200 mb-3">
            {currentStep === 4 ? "⚖️ Step 4: Compare Methods" : "Compare With"}
          </label>
          <div className="space-y-2">
            {['Random Forest', 'AdaBoost', 'Gradient Boosting', 'Extra Trees', 'XGBoost', 'LightGBM'].map((model) => (
              <label key={model} className="flex items-center space-x-3 p-2 bg-gray-700/30 rounded-lg hover:bg-gray-600/40 transition-colors cursor-pointer border border-gray-600/30">
                <input
                  type="checkbox"
                  checked={sidebarState.compareWith.includes(model)}
                  onChange={(e) => {
                    const newCompareWith = e.target.checked
                      ? [...sidebarState.compareWith, model]
                      : sidebarState.compareWith.filter(m => m !== model);
                    updateSidebarState('compareWith', newCompareWith);
                  }}
                  className="w-4 h-4 text-gray-400 bg-gray-600/40 border-gray-500/50 rounded focus:ring-gray-500 focus:ring-2"
                />
                <span className="text-gray-200 text-sm">{model}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Step 5: Train Button */}
        <div className={`transition-all duration-500 ${currentStep >= 5 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
          <button
            onClick={onTrainModel}
            disabled={loading || !dataset}
                  className="w-full bg-gradient-to-r from-gray-700 to-gray-600 text-gray-100 py-4 px-6 rounded-xl hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 border border-gray-500/30"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-gray-400/30 border-t-gray-300 rounded-full animate-spin"></div>
                <span>Training {sidebarState.nEstimators} Models...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>🚀</span>
                <span>Train & Compare</span>
              </div>
            )}
          </button>
        </div>

        {/* Progress & Status */}
        <div className="glass-morphism rounded-xl p-4 border border-gray-700/50">
          <h3 className="text-gray-200 font-semibold mb-3 flex items-center">
            <span className="mr-2">📈</span>
            Learning Progress
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-300 text-sm">
              <span>Step {currentStep + 1} of 6</span>
              <span>{Math.round(((currentStep + 1) / 6) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-700/40 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-gray-600 to-gray-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / 6) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {dataset && (
            <div className="mt-3 pt-3 border-t border-gray-700/50">
              <p className="text-gray-300 text-sm font-medium">✅ {dataset.name}</p>
              <p className="text-gray-400 text-xs">{dataset.rows.length} samples loaded</p>
            </div>
          )}
        </div>

        {/* Bootstrap Sampling Animation - Professional Black/Grey Theme */}
        <div className="glass-morphism rounded-xl p-4 pointer-events-auto border border-gray-600/30">
          {/* Header with professional styling */}
          <div className="flex items-center justify-center mb-3 space-x-2">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"></div>
            <span className="text-gray-200 text-xs font-semibold tracking-wide uppercase">
              Bootstrap Sampling
            </span>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '500ms' }}></div>
          </div>
          
          {/* Main animation container with professional black/grey styling */}
          <div className="relative w-full h-44 bg-gradient-to-br from-gray-900/40 via-gray-800/30 to-gray-900/20 rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl backdrop-blur-sm">
            {/* Subtle grid background */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle, rgba(200,200,200,0.15) 1px, transparent 1px)',
              backgroundSize: '12px 12px'
            }}></div>
            
            <svg className="w-full h-full relative z-10" viewBox="0 0 240 180" preserveAspectRatio="xMidYMid meet">
              {/* Original dataset points - grid layout with grey tones */}
              {Array.from({ length: 24 }).map((_, i) => {
                const x = (i % 6) * 40 + 30;
                const y = Math.floor(i / 6) * 35 + 25;
                return (
                  <circle
                    key={`original-${i}`}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="rgba(200,200,200,0.4)"
                    stroke="rgba(150,150,150,0.3)"
                    strokeWidth="0.5"
                    className="animate-pulse"
                    style={{ 
                      animationDelay: `${i * 80}ms`,
                      animationDuration: '2s'
                    }}
                  />
                );
              })}
              
              {/* Sampled points being selected with professional grey/silver tones */}
              {sampledPoints.map((point, i) => (
                <g key={point.id}>
                  {/* Base circle */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={point.selected ? "6" : "3.5"}
                    fill={point.selected ? "#6b7280" : "rgba(200,200,200,0.5)"}
                    stroke={point.selected ? "#9ca3af" : "rgba(150,150,150,0.4)"}
                    strokeWidth={point.selected ? "1.5" : "0.5"}
                    className={point.selected ? "animate-ping" : ""}
                    style={{ 
                      animationDelay: `${point.delay}ms`,
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  />
                  {/* Ripple effect for selected points - grey tones */}
                  {point.selected && (
                    <>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="10"
                        fill="rgba(107,114,128,0.2)"
                        className="animate-ping"
                        style={{ animationDelay: `${point.delay + 100}ms` }}
                      />
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="14"
                        fill="rgba(107,114,128,0.1)"
                        className="animate-ping"
                        style={{ animationDelay: `${point.delay + 200}ms` }}
                      />
                    </>
                  )}
                </g>
              ))}
              
              {/* Animated connecting lines showing data flow to models - grey theme */}
              {sampledPoints.filter(p => p.selected).slice(0, 6).map((point, i) => {
                const modelIndex = i % 4;
                const modelX = [35, 95, 155, 215][modelIndex];
                const modelY = 150;
                return (
                  <g key={`connection-${i}`}>
                    <line
                      x1={point.x}
                      y1={point.y}
                      x2={modelX}
                      y2={modelY}
                      stroke="rgba(156,163,175,0.5)"
                      strokeWidth="1.5"
                      strokeDasharray="4,3"
                      className="animate-pulse"
                      style={{ 
                        animationDelay: `${i * 150}ms`,
                        opacity: 0.7
                      }}
                      markerEnd="url(#arrowhead)"
                    />
                  </g>
                );
              })}
              
              {/* Arrow marker for lines - grey theme */}
              <defs>
                <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="rgba(156,163,175,0.6)" />
                </marker>
              </defs>
              
              {/* Professional model buckets with grey/black theme */}
              <g>
                {[
                  { x: 30, label: 'M1', color: 'rgba(75,85,99,0.3)', border: 'rgba(107,114,128,0.6)', shade: 'rgba(107,114,128,0.4)' },
                  { x: 90, label: 'M2', color: 'rgba(55,65,81,0.3)', border: 'rgba(75,85,99,0.6)', shade: 'rgba(75,85,99,0.4)' },
                  { x: 150, label: 'M3', color: 'rgba(31,41,55,0.3)', border: 'rgba(55,65,81,0.6)', shade: 'rgba(55,65,81,0.4)' },
                  { x: 210, label: 'M4', color: 'rgba(17,24,39,0.35)', border: 'rgba(31,41,55,0.6)', shade: 'rgba(31,41,55,0.4)' }
                ].map((model, i) => (
                  <g key={i}>
                    <rect 
                      x={model.x - 20} 
                      y={140} 
                      width="40" 
                      height="22" 
                      fill={model.color}
                      stroke={model.border}
                      strokeWidth="1.5"
                      rx="3"
                      className="animate-pulse"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                    <text 
                      x={model.x} 
                      y={155} 
                      textAnchor="middle" 
                      fill="rgba(229,231,235,0.9)" 
                      fontSize="9" 
                      fontWeight="600"
                    >
                      {model.label}
                    </text>
                    {/* Count indicator - grey */}
                    <circle 
                      cx={model.x + 12} 
                      cy={148} 
                      r="4" 
                      fill={model.shade}
                      opacity="0.7"
                    />
                  </g>
                ))}
              </g>
            </svg>
            
            {/* Professional status indicator - grey theme */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-20">
              <div className="flex items-center space-x-2 bg-gray-800/40 rounded-full px-3 py-1.5 backdrop-blur-sm border border-gray-600/40">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse shadow-lg shadow-gray-400/30"></div>
                <span className="text-gray-300 text-xs font-medium">Sampling in progress</span>
              </div>
            </div>
            
            {/* Gradient overlay for depth - grey tones */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-gray-900/10 pointer-events-none"></div>
          </div>
          
          {/* Educational hint - grey theme */}
          <div className="mt-3 text-center">
            <p className="text-gray-400 text-xs italic">Each model receives a random sample from the dataset</p>
          </div>
        </div>
      </div>
    </div>
  );
}
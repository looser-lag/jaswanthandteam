import { useState, useEffect } from 'react';
import Layout from '../components/layout';
import Sidebar from '../components/sidebar';
import MetricsChart from '../components/metricschart';
import ConfusionMatrix from '../components/confusionmetrics';
import ProbabilityHistogram from '../components/probabilityhistogram';
import DensityPlot from '../components/densityplot';
import DecisionBoundary from '../components/desicionboundary';

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataset, setDataset] = useState(null);
  const [sidebarState, setSidebarState] = useState({
    dataOption: 'iris',
    baseModel: 'Decision Tree',
    nEstimators: 10,
    testSize: 30,
    maxDepth: 3,
    compareWith: ['Random Forest', 'AdaBoost']
  });

  const storySteps = [
    {
      title: "Welcome to Bagging Explorer! 🎯",
      content: "Bagging (Bootstrap Aggregating) is a powerful ensemble method that creates multiple models from different subsets of your training data and combines their predictions for better accuracy and stability.",
      visual: "🎯",
      tips: ["Reduces model variance", "Works great with high-variance models", "Improves generalization", "Easy to parallelize"]
    },
    {
      title: "Choose Your Dataset 📊",
      content: "Select a dataset to explore how bagging performs across different types of machine learning problems. Each dataset has unique characteristics that affect ensemble performance.",
      visual: "📊",
      tips: ["Flower: Classic 3-class classification", "Wine: Multi-feature analysis", "Cancer: Medical binary classification"]
    },
    {
      title: "Select Your Base Model 🌱",
      content: "Choose the base algorithm that will be bagged. Decision Trees are ideal because they have high variance and benefit greatly from ensemble methods.",
      visual: "🌱",
      tips: ["Decision Trees work best", "High-variance models benefit most", "Each model sees different data samples"]
    },
    {
      title: "Configure Ensemble Size 🔢",
      content: "Set how many models to train in your ensemble. More models generally mean better performance, but with diminishing returns after a certain point.",
      visual: "🔢",
      tips: ["10-50 models is typical", "More models = more computation time", "Find the sweet spot for your data"]
    },
    {
      title: "Compare Ensemble Methods ⚖️",
      content: "See how bagging stacks up against other popular ensemble methods. Each technique has unique strengths for different scenarios.",
      visual: "⚖️",
      tips: ["Random Forest: Bagging + feature randomness", "AdaBoost: Focuses on difficult examples", "Gradient Boosting: Sequential improvement"]
    },
    {
      title: "Train & Analyze Results 🚀",
      content: "Watch as we train all models and compare their performance. See firsthand why ensemble methods often outperform single models!",
      visual: "🚀",
      tips: ["Bagging reduces overfitting", "Look at accuracy improvements", "Compare confusion matrices", "Analyze feature importance"]
    }
  ];

  const handleTrainModel = async () => {
    setLoading(true);
    setCurrentStep(5);
    
    try {
      const response = await fetch('/api/train-model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sidebarState),
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        // Fallback to educational demo data
        const demoResults = generateDemoResults();
        setResults(demoResults);
      }
    } catch (error) {
      console.error('Training failed, using demo data:', error);
      const demoResults = generateDemoResults();
      setResults(demoResults);
    } finally {
      setLoading(false);
    }
  };

  const generateDemoResults = () => {
    const baseAccuracy = 0.75 + Math.random() * 0.15;
    const baggingBoost = 0.08 + Math.random() * 0.07;
    
    return {
      ensemble_results: {
        'Single Model': baseAccuracy,
        'Bagged Model': baseAccuracy + baggingBoost,
        'Random Forest': baseAccuracy + baggingBoost - 0.02,
        'AdaBoost': baseAccuracy + 0.05 + Math.random() * 0.05,
        'Gradient Boosting': baseAccuracy + 0.06 + Math.random() * 0.04
      },
      confusion_matrix: [
        [Math.floor(Math.random() * 40) + 10, Math.floor(Math.random() * 5), Math.floor(Math.random() * 3)],
        [Math.floor(Math.random() * 5), Math.floor(Math.random() * 40) + 10, Math.floor(Math.random() * 5)],
        [Math.floor(Math.random() * 3), Math.floor(Math.random() * 5), Math.floor(Math.random() * 40) + 10]
      ],
      probability_data: Array.from({ length: 15 }, () => 0.6 + Math.random() * 0.4),
      feature_importance: Array.from({ length: 4 }, () => Math.random()).map(val => val / 4),
      training_progress: [0.6, 0.72, 0.81, 0.87, 0.92]
    };
  };

  const handleDatasetLoad = (dataOption) => {
    const datasets = {
      'iris': {
        name: 'Flower Dataset',
        headers: ['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'],
        rows: Array(150).fill().map(() => Array(4).fill().map(() => Math.random())),
        target: Array(150).fill().map(() => Math.floor(Math.random() * 3)),
        description: 'Classic 3-class classification with 4 features'
      },
      'wine': {
        name: 'Wine Recognition Dataset', 
        headers: Array.from({length: 13}, (_, i) => `Chemical ${i+1}`),
        rows: Array(178).fill().map(() => Array(13).fill().map(() => Math.random())),
        target: Array(178).fill().map(() => Math.floor(Math.random() * 3)),
        description: '13 chemical analysis features, 3 wine classes'
      },
      'cancer': {
        name: 'Breast Cancer Diagnostic Dataset',
        headers: Array.from({length: 30}, (_, i) => `Feature ${i+1}`),
        rows: Array(569).fill().map(() => Array(30).fill().map(() => Math.random())),
        target: Array(569).fill().map(() => Math.floor(Math.random() * 2)),
        description: '30 features, binary classification (malignant/benign)'
      }
    };
    
    setDataset(datasets[dataOption]);
    setSidebarState(prev => ({ ...prev, dataOption }));
    setCurrentStep(2);
  };

  return (
    <Layout>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Sidebar */}
        <div className="w-72 bg-gray-800/80 backdrop-blur-lg border-r border-gray-700/50 shadow-xl flex-shrink-0">
          <Sidebar 
            sidebarState={sidebarState}
            setSidebarState={setSidebarState}
            dataset={dataset}
            onDatasetLoad={handleDatasetLoad}
            onTrainModel={handleTrainModel}
            loading={loading}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex justify-center overflow-y-auto">
          <main className="p-8 w-full max-w-7xl">
            {/* Storytelling Header Card */}
            <div className="glass-morphism rounded-2xl p-8 mb-8 hover-lift relative">
              <div className="flex items-start space-x-6">
                <div className="text-6xl flex-shrink-0">{storySteps[currentStep].visual}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold text-gray-100">
                      {storySteps[currentStep].title}
                    </h1>
                    <div className="flex space-x-2">
                      {storySteps.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentStep(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentStep 
                              ? 'bg-gray-300 scale-125 shadow-lg' 
                              : 'bg-gray-500/50 hover:bg-gray-400/70'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                    {storySteps[currentStep].content}
                  </p>
                  <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                    <h3 className="text-gray-200 font-semibold mb-2 flex items-center">
                      <span className="text-lg mr-2">💡</span>
                      Quick Tips
                    </h3>
                    <ul className="text-gray-400 space-y-1">
                      {storySteps[currentStep].tips.map((tip, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <span className="text-gray-400 mr-2">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Removed inline Next button here to avoid duplicate controls */}
                </div>
              </div>
              {currentStep < storySteps.length - 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2 px-4 rounded shadow-md"
                >
                  Next →
                </button>
              )}
            </div>

            {/* Step-specific Content */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-morphism rounded-2xl p-6 text-center hover-lift border border-gray-700/50">
                    <div className="text-4xl mb-4">🔄</div>
                    <h3 className="text-gray-200 font-semibold mb-3">Bootstrap Sampling</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Create multiple training sets by randomly sampling with replacement from the original data
                    </p>
                  </div>
                  <div className="glass-morphism rounded-2xl p-6 text-center hover-lift border border-gray-700/50">
                    <div className="text-4xl mb-4">🤝</div>
                    <h3 className="text-gray-200 font-semibold mb-3">Model Aggregation</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Combine predictions from all trained models through voting or averaging for final decision
                    </p>
                  </div>
                  <div className="glass-morphism rounded-2xl p-6 text-center hover-lift border border-gray-700/50">
                    <div className="text-4xl mb-4">📈</div>
                    <h3 className="text-gray-200 font-semibold mb-3">Variance Reduction</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Smooth decision boundaries and improve generalization by reducing model variance
                    </p>
                  </div>
                </div>
                
                {/* Interactive Explanation */}
                <div className="glass-morphism rounded-2xl p-6 hover-lift border border-gray-700/50">
                  <h3 className="text-gray-200 font-semibold mb-4 flex items-center text-xl">
                    <span className="mr-2">🎓</span>
                    What is Bagging? (In Simple Terms)
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                      <p className="text-gray-300 leading-relaxed mb-3">
                        Imagine you're trying to guess if it will rain tomorrow. Instead of asking just one weather expert, 
                        you ask <strong className="text-gray-300">10 different experts</strong> who each looked at different 
                        weather patterns. Then you take a <strong className="text-gray-300">vote</strong> - if most say "yes", 
                        you decide it will rain.
                      </p>
                      <p className="text-gray-300 leading-relaxed">
                        That's exactly what bagging does! It creates <strong className="text-gray-300">multiple AI models</strong>, 
                        each trained on slightly different data, then combines their answers to make a better prediction than any single model alone.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                        <div className="text-2xl mb-2">❌ Single Model</div>
                        <div className="text-gray-400 text-sm">One opinion → Can be wrong</div>
                      </div>
                      <div className="bg-gray-700/40 rounded-lg p-4 border border-gray-600/50">
                        <div className="text-2xl mb-2">✅ Bagged Model</div>
                        <div className="text-gray-400 text-sm">Many opinions → More reliable</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Dataset Selection - Show Dataset Preview */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="glass-morphism rounded-2xl p-6 hover-lift">
                  <h3 className="text-white font-semibold mb-4 flex items-center text-xl">
                    <span className="mr-2">📋</span>
                    Dataset Preview
                  </h3>
                  <p className="text-white/70 text-sm mb-4">
                    Select a dataset from the sidebar to see a preview. Each dataset has different characteristics that affect how well bagging works.
                  </p>
                  {dataset ? (
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-semibold">{dataset.name}</h4>
                          <span className="text-green-300 text-sm">✓ Loaded</span>
                        </div>
                        <p className="text-white/70 text-xs mb-3">{dataset.description}</p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="bg-white/5 rounded p-2 text-center">
                            <div className="text-white/50 text-xs">Features</div>
                            <div className="text-white font-semibold">{dataset.headers.length}</div>
                          </div>
                          <div className="bg-white/5 rounded p-2 text-center">
                            <div className="text-white/50 text-xs">Samples</div>
                            <div className="text-white font-semibold">{dataset.rows.length}</div>
                          </div>
                          <div className="bg-white/5 rounded p-2 text-center">
                            <div className="text-white/50 text-xs">Classes</div>
                            <div className="text-white font-semibold">{new Set(dataset.target).size}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/10 rounded-lg p-4 border border-white/20 max-h-64 overflow-y-auto">
                        <div className="text-white/70 text-xs mb-2 font-semibold">First 5 Samples:</div>
                        <div className="space-y-1">
                          {dataset.rows.slice(0, 5).map((row, idx) => (
                            <div key={idx} className="text-white/60 text-xs font-mono flex gap-2">
                              <span className="w-20">Sample {idx + 1}:</span>
                              <span>{row.slice(0, 4).map((v, i) => dataset.headers[i] ? `${dataset.headers[i]}: ${v.toFixed(2)}` : '').filter(Boolean).join(', ')}</span>
                              <span className="ml-auto text-green-300">Class {dataset.target[idx]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/5 rounded-lg p-8 text-center border border-white/10 border-dashed">
                      <div className="text-4xl mb-3">👈</div>
                      <p className="text-white/70">Select a dataset from the sidebar to get started!</p>
                    </div>
                  )}
                </div>

                {/* Interactive Bootstrap Sampling Explanation */}
                <div className="glass-morphism rounded-2xl p-6 hover-lift">
                  <h3 className="text-white font-semibold mb-4 flex items-center text-xl">
                    <span className="mr-2">🔄</span>
                    How Bagging Works with Your Data
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4 border border-white/20">
                      <p className="text-white/90 text-sm leading-relaxed mb-3">
                        <strong className="text-yellow-300">Bootstrap Sampling:</strong> When you train {sidebarState.nEstimators} models with bagging, each model gets a 
                        <strong className="text-yellow-300"> random sample</strong> of your {dataset ? dataset.rows.length : '150'} data points. 
                        Some points appear multiple times, some not at all!
                      </p>
                    </div>

                    {/* Visual Bootstrap Sampling */}
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <h4 className="text-white font-semibold mb-3 text-sm">Visual Example:</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-12 h-12 bg-blue-500/30 rounded-lg flex items-center justify-center border border-blue-400/50">
                            <span className="text-white text-xs font-bold">All</span>
                          </div>
                          <div className="flex-1">
                            <div className="text-white/70 text-xs mb-1">Original Dataset ({dataset ? dataset.rows.length : '150'} samples)</div>
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500" style={{ width: '100%' }}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-white/50 text-xs text-center">↓ Bootstrap Sampling →</div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          {[1, 2, 3].map((num) => (
                            <div key={num} className="bg-white/5 rounded-lg p-2 border border-white/10">
                              <div className="text-white/60 text-xs mb-1">Model {num}</div>
                              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-green-400 to-blue-500" 
                                  style={{ width: `${60 + Math.random() * 20}%` }}
                                ></div>
                              </div>
                              <div className="text-white/50 text-xs mt-1">~{Math.floor((dataset ? dataset.rows.length : 150) * 0.63)} unique samples</div>
                            </div>
                          ))}
                          <div className="col-span-3 text-white/50 text-xs text-center mt-2">
                            ...and {sidebarState.nEstimators - 3} more models
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-green-500/10 rounded-lg p-3 border border-green-400/30">
                        <div className="text-2xl mb-2">🎯</div>
                        <div className="text-white font-semibold text-xs mb-1">Reduces Overfitting</div>
                        <p className="text-white/70 text-xs">
                          Each model sees different data, preventing memorization
                        </p>
                      </div>
                      <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-400/30">
                        <div className="text-2xl mb-2">🤝</div>
                        <div className="text-white font-semibold text-xs mb-1">Voting System</div>
                        <p className="text-white/70 text-xs">
                          Final prediction = majority vote from all models
                        </p>
                      </div>
                      <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-400/30">
                        <div className="text-2xl mb-2">📈</div>
                        <div className="text-white font-semibold text-xs mb-1">Better Accuracy</div>
                        <p className="text-white/70 text-xs">
                          Combining predictions reduces errors significantly
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dataset Comparison Guide */}
                <div className="glass-morphism rounded-2xl p-6 hover-lift">
                  <h3 className="text-white font-semibold mb-4 flex items-center text-xl">
                    <span className="mr-2">📊</span>
                    Which Dataset Works Best with Bagging?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`rounded-xl p-4 border-2 transition-all ${
                      dataset?.name?.includes('Flower') 
                        ? 'bg-green-500/20 border-green-400/50 scale-105' 
                        : 'bg-white/5 border-white/10'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-2xl">🌺</div>
                        {dataset?.name?.includes('Flower') && <span className="text-green-300 text-xs">✓ Selected</span>}
                      </div>
                      <div className="text-white font-semibold mb-2">Flower Dataset</div>
                      <ul className="text-white/70 text-xs space-y-1 mb-2">
                        <li>• Small, clean data</li>
                        <li>• 3 classes, 4 features</li>
                        <li>• Perfect for learning</li>
                      </ul>
                      <div className="bg-white/5 rounded p-2 text-xs text-white/60">
                        💡 Great starting point! Bagging helps with high variance models.
                      </div>
                    </div>

                    <div className={`rounded-xl p-4 border-2 transition-all ${
                      dataset?.name?.includes('Wine') 
                        ? 'bg-green-500/20 border-green-400/50 scale-105' 
                        : 'bg-white/5 border-white/10'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-2xl">🍷</div>
                        {dataset?.name?.includes('Wine') && <span className="text-green-300 text-xs">✓ Selected</span>}
                      </div>
                      <div className="text-white font-semibold mb-2">Wine Dataset</div>
                      <ul className="text-white/70 text-xs space-y-1 mb-2">
                        <li>• 13 features, complex</li>
                        <li>• 3 wine classes</li>
                        <li>• More challenging</li>
                      </ul>
                      <div className="bg-white/5 rounded p-2 text-xs text-white/60">
                        💡 More features = bagging shines even more!
                      </div>
                    </div>

                    <div className={`rounded-xl p-4 border-2 transition-all ${
                      dataset?.name?.includes('Cancer') 
                        ? 'bg-green-500/20 border-green-400/50 scale-105' 
                        : 'bg-white/5 border-white/10'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-2xl">🎗️</div>
                        {dataset?.name?.includes('Cancer') && <span className="text-green-300 text-xs">✓ Selected</span>}
                      </div>
                      <div className="text-white font-semibold mb-2">Cancer Dataset</div>
                      <ul className="text-white/70 text-xs space-y-1 mb-2">
                        <li>• 30 features</li>
                        <li>• Binary classification</li>
                        <li>• Real-world medical data</li>
                      </ul>
                      <div className="bg-white/5 rounded p-2 text-xs text-white/60">
                        💡 High-dimensional data benefits most from bagging!
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-World Example */}
                <div className="glass-morphism rounded-2xl p-6 hover-lift">
                  <h3 className="text-white font-semibold mb-4 flex items-center text-xl">
                    <span className="mr-2">🌍</span>
                    Real-World Analogy
                  </h3>
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">🎓</div>
                        <div className="flex-1">
                          <p className="text-white/90 text-sm leading-relaxed">
                            Imagine you're taking an exam. Instead of studying alone (single model), 
                            you form a study group (bagging) where each person focuses on different chapters.
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="bg-red-500/10 rounded-lg p-3 border border-red-400/30">
                          <div className="text-white font-semibold text-xs mb-1">❌ Single Model</div>
                          <p className="text-white/70 text-xs">
                            One person studies everything → might miss important details
                          </p>
                        </div>
                        <div className="bg-green-500/10 rounded-lg p-3 border border-green-400/30">
                          <div className="text-white font-semibold text-xs mb-1">✅ Bagging</div>
                          <p className="text-white/70 text-xs">
                            Group members vote on answers → more reliable, better results
                          </p>
                        </div>
                      </div>
                      <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-400/30 mt-3">
                        <p className="text-white/80 text-xs leading-relaxed">
                          <strong>That's bagging!</strong> Each model in your ensemble "studies" different random samples 
                          of your data, then they "vote" on the final prediction. The majority vote is usually more accurate 
                          than any single model alone!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Base Model Selection - Explain Models */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="glass-morphism rounded-2xl p-6 hover-lift">
                  <h3 className="text-white font-semibold mb-4 flex items-center text-xl">
                    <span className="mr-2">🌱</span>
                    Why {sidebarState.baseModel}?
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <p className="text-white/90 leading-relaxed mb-3">
                        You've selected <strong className="text-yellow-300">{sidebarState.baseModel}</strong>. 
                        This base model will be used to create {sidebarState.nEstimators} different versions, 
                        each trained on different data samples.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`rounded-lg p-4 border-2 ${
                        sidebarState.baseModel === 'Decision Tree' 
                          ? 'bg-green-500/20 border-green-400/50' 
                          : 'bg-white/5 border-white/10'
                      }`}>
                        <div className="text-2xl mb-2">🌳</div>
                        <div className="text-white font-semibold mb-1">Decision Tree</div>
                        <div className="text-white/70 text-xs">
                          High variance → Perfect for bagging! Creates many different tree structures.
                        </div>
                      </div>
                      <div className={`rounded-lg p-4 border-2 ${
                        sidebarState.baseModel === 'Logistic Regression' 
                          ? 'bg-green-500/20 border-green-400/50' 
                          : 'bg-white/5 border-white/10'
                      }`}>
                        <div className="text-2xl mb-2">📊</div>
                        <div className="text-white font-semibold mb-1">Logistic Regression</div>
                        <div className="text-white/70 text-xs">
                          Low variance → Less benefit from bagging, but still works.
                        </div>
                      </div>
                      <div className={`rounded-lg p-4 border-2 ${
                        sidebarState.baseModel === 'K-Nearest Neighbors' 
                          ? 'bg-green-500/20 border-green-400/50' 
                          : 'bg-white/5 border-white/10'
                      }`}>
                        <div className="text-2xl mb-2">📍</div>
                        <div className="text-white font-semibold mb-1">K-Nearest Neighbors</div>
                        <div className="text-white/70 text-xs">
                          Medium variance → Moderate benefit from bagging.
                        </div>
                      </div>
                      <div className={`rounded-lg p-4 border-2 ${
                        sidebarState.baseModel === 'Support Vector Machine' 
                          ? 'bg-green-500/20 border-green-400/50' 
                          : 'bg-white/5 border-white/10'
                      }`}>
                        <div className="text-2xl mb-2">🧭</div>
                        <div className="text-white font-semibold mb-1">Support Vector Machine</div>
                        <div className="text-white/70 text-xs">
                          Can be high variance with certain kernels → benefits from bagging sometimes.
                        </div>
                      </div>
                      <div className={`rounded-lg p-4 border-2 ${
                        sidebarState.baseModel === 'Naive Bayes' 
                          ? 'bg-green-500/20 border-green-400/50' 
                          : 'bg-white/5 border-white/10'
                      }`}>
                        <div className="text-2xl mb-2">🧪</div>
                        <div className="text-white font-semibold mb-1">Naive Bayes</div>
                        <div className="text-white/70 text-xs">
                          Low variance, strong baseline → limited gains from bagging.
                        </div>
                      </div>
                      <div className={`rounded-lg p-4 border-2 ${
                        sidebarState.baseModel === 'Neural Network' 
                          ? 'bg-green-500/20 border-green-400/50' 
                          : 'bg-white/5 border-white/10'
                      }`}>
                        <div className="text-2xl mb-2">🧠</div>
                        <div className="text-white font-semibold mb-1">Neural Network</div>
                        <div className="text-white/70 text-xs">
                          Often high variance → ensembles can improve stability and accuracy.
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-400/30">
                      <p className="text-white/80 text-sm">
                        💡 <strong>Tip:</strong> Decision Trees are ideal for bagging because they have high variance - 
                        meaning small changes in data create very different trees. Bagging combines these variations to 
                        create a more stable and accurate final model!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Ensemble Size - Interactive Explanation */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="glass-morphism rounded-2xl p-6 hover-lift">
                  <h3 className="text-white font-semibold mb-4 flex items-center text-xl">
                    <span className="mr-2">🔢</span>
                    Ensemble Size: {sidebarState.nEstimators} Models
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <p className="text-white/90 leading-relaxed mb-3">
                        You're creating an ensemble of <strong className="text-yellow-300">{sidebarState.nEstimators} models</strong>. 
                        Each model will be trained on a different random sample of your data, then their predictions will be combined!
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-2">
                      {Array.from({ length: Math.min(sidebarState.nEstimators, 25) }, (_, i) => (
                        <div 
                          key={i}
                          className="bg-gradient-to-br from-green-400/30 to-blue-500/30 rounded-lg p-3 text-center border border-white/20 hover:scale-110 transition-transform"
                          style={{ animationDelay: `${i * 50}ms` }}
                        >
                          <div className="text-xl mb-1">🤖</div>
                          <div className="text-white/80 text-xs">Model {i + 1}</div>
                        </div>
                      ))}
                      {sidebarState.nEstimators > 25 && (
                        <div className="bg-white/10 rounded-lg p-3 text-center border border-white/20 flex items-center justify-center">
                          <div className="text-white/60 text-xs">+{sidebarState.nEstimators - 25} more</div>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-400/30">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">💭</div>
                        <div className="flex-1">
                          <p className="text-white/80 text-sm font-semibold mb-2">How Many Models Should You Use?</p>
                          <ul className="text-white/70 text-xs space-y-1">
                            <li>• <strong>1-5 models:</strong> Quick but limited improvement</li>
                            <li>• <strong>10-30 models:</strong> Sweet spot! Good balance of accuracy and speed</li>
                            <li>• <strong>50+ models:</strong> Diminishing returns, slower training</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4 border border-white/20">
                      <p className="text-white/90 text-sm leading-relaxed">
                        <strong className="text-yellow-300">Real Example:</strong> If you have 1000 samples and create 10 models, 
                        each model sees about 632 unique samples (with some overlap due to bootstrap sampling). 
                        The models make different decisions, and voting among them gives a more reliable answer!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Compare Methods - Explain Each Method */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="glass-morphism rounded-2xl p-6 hover-lift">
                  <h3 className="text-white font-semibold mb-4 flex items-center text-xl">
                    <span className="mr-2">⚖️</span>
                    Compare Different Ensemble Methods
                  </h3>
                  <div className="space-y-4">
                    <p className="text-white/90 text-sm leading-relaxed mb-4">
                      Bagging isn't the only way to combine models! See how different methods work:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`rounded-xl p-4 border-2 transition-all ${
                        sidebarState.compareWith.includes('Random Forest')
                          ? 'bg-green-500/20 border-green-400/50 scale-105'
                          : 'bg-white/5 border-white/10'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-2xl">🌲</div>
                          {sidebarState.compareWith.includes('Random Forest') && (
                            <span className="text-green-300 text-xs">✓ Selected</span>
                          )}
                        </div>
                        <div className="text-white font-semibold mb-2">Random Forest</div>
                        <p className="text-white/70 text-xs leading-relaxed mb-3">
                          Like bagging, but each tree also sees different random features. More diversity!
                        </p>
                        <div className="bg-white/5 rounded p-2 text-xs text-white/60">
                          📌 Best for: High-dimensional data with many features
                        </div>
                      </div>

                      <div className={`rounded-xl p-4 border-2 transition-all ${
                        sidebarState.compareWith.includes('AdaBoost')
                          ? 'bg-green-500/20 border-green-400/50 scale-105'
                          : 'bg-white/5 border-white/10'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-2xl">🚀</div>
                          {sidebarState.compareWith.includes('AdaBoost') && (
                            <span className="text-green-300 text-xs">✓ Selected</span>
                          )}
                        </div>
                        <div className="text-white font-semibold mb-2">AdaBoost</div>
                        <p className="text-white/70 text-xs leading-relaxed mb-3">
                          Trains models sequentially. Each new model focuses on mistakes of previous ones.
                        </p>
                        <div className="bg-white/5 rounded p-2 text-xs text-white/60">
                          📌 Best for: Improving weak learners step-by-step
                        </div>
                      </div>

                      <div className={`rounded-xl p-4 border-2 transition-all ${
                        sidebarState.compareWith.includes('Gradient Boosting')
                          ? 'bg-green-500/20 border-green-400/50 scale-105'
                          : 'bg-white/5 border-white/10'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-2xl">📈</div>
                          {sidebarState.compareWith.includes('Gradient Boosting') && (
                            <span className="text-green-300 text-xs">✓ Selected</span>
                          )}
                        </div>
                        <div className="text-white font-semibold mb-2">Gradient Boosting</div>
                        <p className="text-white/70 text-xs leading-relaxed mb-3">
                          Also sequential. Uses gradient descent to optimize each new model's contribution.
                        </p>
                        <div className="bg-white/5 rounded p-2 text-xs text-white/60">
                          📌 Best for: Maximizing accuracy with careful optimization
                        </div>
                      </div>

                      <div className={`rounded-xl p-4 border-2 transition-all ${
                        sidebarState.compareWith.includes('Extra Trees')
                          ? 'bg-green-500/20 border-green-400/50 scale-105'
                          : 'bg-white/5 border-white/10'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-2xl">🌳</div>
                          {sidebarState.compareWith.includes('Extra Trees') && (
                            <span className="text-green-300 text-xs">✓ Selected</span>
                          )}
                        </div>
                        <div className="text-white font-semibold mb-2">Extra Trees</div>
                        <p className="text-white/70 text-xs leading-relaxed mb-3">
                          Like Random Forest but splits chosen more randomly for higher diversity.
                        </p>
                        <div className="bg-white/5 rounded p-2 text-xs text-white/60">
                          📌 Best for: Very fast, strong baselines on tabular data
                        </div>
                      </div>

                      <div className={`rounded-xl p-4 border-2 transition-all ${
                        sidebarState.compareWith.includes('XGBoost')
                          ? 'bg-green-500/20 border-green-400/50 scale-105'
                          : 'bg-white/5 border-white/10'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-2xl">⚡</div>
                          {sidebarState.compareWith.includes('XGBoost') && (
                            <span className="text-green-300 text-xs">✓ Selected</span>
                          )}
                        </div>
                        <div className="text-white font-semibold mb-2">XGBoost</div>
                        <p className="text-white/70 text-xs leading-relaxed mb-3">
                          Optimized gradient boosting with regularization and advanced tree methods.
                        </p>
                        <div className="bg-white/5 rounded p-2 text-xs text-white/60">
                          📌 Best for: Tabular competitions and strong accuracy
                        </div>
                      </div>

                      <div className={`rounded-xl p-4 border-2 transition-all ${
                        sidebarState.compareWith.includes('LightGBM')
                          ? 'bg-green-500/20 border-green-400/50 scale-105'
                          : 'bg-white/5 border-white/10'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-2xl">💡</div>
                          {sidebarState.compareWith.includes('LightGBM') && (
                            <span className="text-green-300 text-xs">✓ Selected</span>
                          )}
                        </div>
                        <div className="text-white font-semibold mb-2">LightGBM</div>
                        <p className="text-white/70 text-xs leading-relaxed mb-3">
                          Gradient boosting using leaf-wise growth for speed on large datasets.
                        </p>
                        <div className="bg-white/5 rounded p-2 text-xs text-white/60">
                          📌 Best for: Large-scale, high-dimensional tabular data
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-400/30">
                      <p className="text-white/90 text-sm leading-relaxed">
                        <strong>💡 Key Difference:</strong> Bagging trains models <strong>in parallel</strong> (all at once, independently), 
                        while AdaBoost and Gradient Boosting train <strong>sequentially</strong> (one after another, learning from previous mistakes). 
                        Both approaches work, but bagging is easier to parallelize and often faster!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results Display */}
            {currentStep === 5 && results && (
              <div className="space-y-6">
                {/* Performance Comparison */}
                <div className="glass-morphism rounded-2xl p-6 hover-lift">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <span className="mr-3">📊</span>
                    Model Performance Comparison
                  </h2>
                  <div className="space-y-4 mb-6">
                    {Object.entries(results.ensemble_results).map(([model, score]) => (
                      <div key={model} className="flex items-center justify-between">
                        <span className="text-white font-medium w-48 text-lg">{model}</span>
                        <div className="flex-1 mx-6">
                          <div className="w-full bg-white/20 rounded-full h-8 shadow-inner">
                            <div 
                              className="bg-gradient-to-r from-green-400 to-blue-500 h-8 rounded-full transition-all duration-1000 flex items-center justify-end pr-3"
                              style={{ width: `${score * 100}%` }}
                            >
                              <span className="text-white text-sm font-bold">
                                {(score * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Interactive Bar Chart */}
                  {/* Chart removed per request */}

                  {/* Scatterplot View removed */}
                </div>

                {/* Key Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass-morphism rounded-2xl p-6 hover-lift">
                    <h3 className="text-white font-semibold mb-4 flex items-center text-xl">
                      <span className="mr-2">🎯</span>
                      Key Insight
                    </h3>
                    <div className="space-y-3">
                      <p className="text-white/80 leading-relaxed">
                        Bagging improved model accuracy by{' '}
                        <span className="text-green-300 font-bold text-lg">
                          {((results.ensemble_results['Bagged Model'] - results.ensemble_results['Single Model']) * 100).toFixed(1)}%
                        </span>{' '}
                        compared to the single base model!
                      </p>
                      <div className="bg-green-500/10 rounded-lg p-3 border border-green-400/30">
                        <p className="text-white/90 text-sm leading-relaxed">
                          This demonstrates the power of combining multiple models to achieve better generalization and stability. 
                          By averaging predictions from {sidebarState.nEstimators} different models, bagging reduces overfitting and 
                          creates more reliable results.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="glass-morphism rounded-2xl p-6 hover-lift">
                    <h3 className="text-white font-semibold mb-4 flex items-center text-xl">
                      <span className="mr-2">📚</span>
                      What This Means
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                        <p className="text-white/90 text-sm leading-relaxed">
                          <strong className="text-yellow-300">Single Model:</strong> One decision tree makes predictions. 
                          If it saw slightly different training data, it might make different decisions - high variance!
                        </p>
                      </div>
                      <div className="bg-green-500/10 rounded-lg p-3 border border-green-400/30">
                        <p className="text-white/90 text-sm leading-relaxed">
                          <strong className="text-green-300">Bagged Model:</strong> {sidebarState.nEstimators} trees vote on each prediction. 
                          Even if individual trees disagree, the majority vote is usually more accurate and stable!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visualizations Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Confusion Matrix */}
                  <div className="glass-morphism rounded-2xl p-6 hover-lift">
                    <ConfusionMatrix results={results} />
                  </div>
                  
                  {/* Decision Boundary */}
                  <DecisionBoundary dataset={dataset} results={results} />
                </div>

                {/* Probability Histogram */}
                <ProbabilityHistogram results={results} />

                {/* Density Plot with scales */}
                <div className="glass-morphism rounded-2xl p-6 hover-lift">
                  <DensityPlot values={results?.probability_data || []} />
                </div>

                {/* Next Steps */}
                <div className="glass-morphism rounded-2xl p-6 hover-lift">
                  <h3 className="text-white font-semibold mb-4 flex items-center text-xl">
                    <span className="mr-2">🚀</span>
                    Try Different Configurations!
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <div className="text-2xl mb-2">🔢</div>
                      <div className="text-white font-semibold mb-2">Change Ensemble Size</div>
                      <p className="text-white/70 text-xs">
                        Try 5, 20, or 50 models. See how accuracy changes!
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <div className="text-2xl mb-2">🌱</div>
                      <div className="text-white font-semibold mb-2">Try Different Base Models</div>
                      <p className="text-white/70 text-xs">
                        Compare how Decision Trees vs KNN perform with bagging
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <div className="text-2xl mb-2">📊</div>
                      <div className="text-white font-semibold mb-2">Test Different Datasets</div>
                      <p className="text-white/70 text-xs">
                        See how bagging helps with different types of data
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="glass-morphism text-white px-8 py-3 rounded-xl hover-lift disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold"
              >
                ← Previous Step
              </button>
              
              {currentStep >= 0 && currentStep < 5 && (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="glass-morphism text-white px-8 py-3 rounded-xl hover-lift transition-all duration-300 font-semibold"
                >
                  Next Step →
                </button>
              )}
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}
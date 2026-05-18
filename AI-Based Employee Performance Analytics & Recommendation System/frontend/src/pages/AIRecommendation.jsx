import React, { useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Award, AlertTriangle, CheckCircle, Target } from 'lucide-react';

const RecommendationCard = ({ rec, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="glass-card p-6"
  >
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
          #{rec.ranking}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">{rec.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-1 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">AI Score: {rec.aiScore}/100</span>
          </div>
        </div>
      </div>
      <div className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${rec.promotionSuggestion.toLowerCase().includes('yes') ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
        <Award size={16} />
        {rec.promotionSuggestion.split(',')[0]}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
            <CheckCircle size={16} className="text-green-400" /> Key Strengths
          </h4>
          <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
            {rec.strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
            <AlertTriangle size={16} className="text-yellow-400" /> Areas for Improvement
          </h4>
          <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
            {rec.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
            <Target size={16} className="text-blue-400" /> Training Recommendation
          </h4>
          <p className="text-sm text-slate-400">{rec.trainingRecommendation}</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
            <TrendingUp size={16} className="text-purple-400" /> Performance Analysis
          </h4>
          <p className="text-sm text-slate-400">{rec.performanceAnalysis}</p>
        </div>
      </div>
    </div>

    <div className="mt-6 pt-4 border-t border-slate-700/50">
      <h4 className="text-sm font-semibold text-slate-300 mb-2">HR Feedback Summary</h4>
      <p className="text-sm text-slate-400 italic">"{rec.hrFeedback}"</p>
    </div>
  </motion.div>
);

const AIRecommendation = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/ai/recommend');
      setRecommendations(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-purple-900/40 to-blue-900/40 p-6 rounded-2xl border border-purple-500/20">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Brain className="text-purple-400" /> AI Insights Panel
          </h1>
          <p className="text-slate-400 mt-1">Generate deep performance insights using OpenRouter AI</p>
        </div>
        <button 
          onClick={generateRecommendations} 
          disabled={loading}
          className="btn-primary flex items-center gap-2 py-3 px-6"
        >
          {loading ? (
            <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Analyzing...</>
          ) : (
            <><Brain size={20} /> Generate AI Report</>
          )}
        </button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-4 rounded-xl">{error}</div>}

      <div className="space-y-6">
        {recommendations.length > 0 ? (
          recommendations.sort((a,b) => a.ranking - b.ranking).map((rec, index) => (
            <RecommendationCard key={index} rec={rec} index={index} />
          ))
        ) : (
          !loading && (
            <div className="text-center py-20 glass-card">
              <Brain size={48} className="mx-auto text-slate-600 mb-4" />
              <h3 className="text-xl font-medium text-slate-300">No Insights Generated Yet</h3>
              <p className="text-slate-500 mt-2">Click the button above to analyze your employee data.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AIRecommendation;

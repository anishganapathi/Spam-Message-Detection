"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Send, ShieldCheck, ShieldAlert, Loader2, CheckCircle2, Copy, X, FileText, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EXAMPLES = {
  spam: [
    "URGENT! You have won a 1 week FREE membership in our £100,000 Prize Jackpot! Txt the word: CLAIM to No: 81010",
    "Free entry in 2 a wkly comp to win FA Cup final tkts 21st May 2005. Text FA to 87121 to receive entry question(std txt rate)T&C's apply 08452810075over18's",
    "WINNER!! As a valued network customer you have been selected to receivea £900 prize reward! To claim call 09061701461. Claim code KL341. Valid 12 hours only.",
    "Had your mobile 11 months or more? U R entitled to Update to the latest colour mobiles with camera for Free! Call The Mobile Update Co FREE on 08002986030",
    "SIX chances to win CASH! From 100 to 20,000 pounds txt> CSH11 and send to 87575. Cost 150p/day, 6days, 16+ TsandCs apply Reply HL 4 info"
  ],
  ham: [
    "Hey, are we still meeting for lunch today?",
    "Mom called, she wants to know if you're coming over for dinner this weekend.",
    "Can you send me the files for the project? Thanks!",
    "I'll be there in 10 minutes, traffic is a bit heavy.",
    "Did you see the game last night? It was amazing!"
  ]
};

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<null | { label: string; confidence: number }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modelInfo, setModelInfo] = useState<any>(null);

  // Modal states
  const [showExamples, setShowExamples] = useState(false);
  const [activeTab, setActiveTab] = useState<'spam' | 'ham'>('spam');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    axios.get("http://localhost:8000/model-info")
      .then(res => setModelInfo(res.data))
      .catch(err => console.error("Failed to fetch model info", err));
  }, []);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await axios.post("http://localhost:8000/predict", { text });
      setResult(response.data);
    } catch (err) {
      setError("Failed to analyze text. Is the backend running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4 text-white font-sans overflow-y-auto relative">

      {/* Top Right Button */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={() => setShowExamples(true)}
          className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 rounded-full px-4 py-2 transition-all shadow-lg backdrop-blur-sm"
        >
          <FileText className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium">Example Inputs</span>
        </button>
      </div>

      {/* Examples Modal */}
      <AnimatePresence>
        {showExamples && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                <h3 className="font-bold text-lg text-slate-200">Test Examples</h3>
                <button
                  onClick={() => setShowExamples(false)}
                  className="p-1 hover:bg-slate-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="flex border-b border-slate-700">
                <button
                  onClick={() => setActiveTab('spam')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'spam'
                      ? 'bg-red-500/10 text-red-400 border-b-2 border-red-500'
                      : 'text-slate-400 hover:bg-slate-800'
                    }`}
                >
                  Spam Examples
                </button>
                <button
                  onClick={() => setActiveTab('ham')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'ham'
                      ? 'bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-500'
                      : 'text-slate-400 hover:bg-slate-800'
                    }`}
                >
                  Not Spam Examples
                </button>
              </div>

              <div className="p-4 overflow-y-auto custom-scrollbar">
                <div className="space-y-3">
                  {EXAMPLES[activeTab].map((ex, i) => (
                    <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 group hover:border-slate-600 transition-all">
                      <p className="text-slate-300 text-sm mb-3 leading-relaxed">{ex}</p>
                      <div className="flex justify-end">
                        <button
                          onClick={() => copyToClipboard(ex, i)}
                          className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                        >
                          {copiedIndex === i ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy Text
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl overflow-hidden mb-8">
        <div className="p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20">
              <ShieldCheck className="w-10 h-10 text-blue-400" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            Spam Detector
          </h1>
          <p className="text-slate-400 text-center mb-8 text-sm">
            AI-powered SMS spam classification
          </p>

          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste SMS text here..."
                className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Analyze Message
                </>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`border-t ${result.label === "Spam"
                  ? "bg-red-500/10 border-red-500/20"
                  : "bg-emerald-500/10 border-emerald-500/20"
                }`}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {result.label === "Spam" ? (
                      <ShieldAlert className="w-8 h-8 text-red-400" />
                    ) : (
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    )}
                    <div>
                      <h3 className={`text-xl font-bold ${result.label === "Spam" ? "text-red-400" : "text-emerald-400"
                        }`}>
                        {result.label}
                      </h3>
                      <p className="text-slate-400 text-xs">Classification Result</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-200">
                      {(result.confidence * 100).toFixed(1)}%
                    </div>
                    <p className="text-slate-400 text-xs">Confidence</p>
                  </div>
                </div>

                <div className="w-full bg-slate-900/50 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`h-full ${result.label === "Spam" ? "bg-red-500" : "bg-emerald-500"
                      }`}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {modelInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-md w-full bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6"
        >
          <h2 className="text-lg font-semibold mb-4 text-slate-200 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            Model Performance
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
              <div className="text-slate-400 text-xs mb-1">Accuracy</div>
              <div className="text-2xl font-bold text-blue-400">{(modelInfo.metrics.accuracy * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
              <div className="text-slate-400 text-xs mb-1">Precision</div>
              <div className="text-2xl font-bold text-emerald-400">{(modelInfo.metrics.precision * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
              <div className="text-slate-400 text-xs mb-1">Recall</div>
              <div className="text-2xl font-bold text-purple-400">{(modelInfo.metrics.recall * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
              <div className="text-slate-400 text-xs mb-1">F1 Score</div>
              <div className="text-2xl font-bold text-amber-400">{(modelInfo.metrics.f1_score * 100).toFixed(1)}%</div>
            </div>
          </div>

          <div className="space-y-3 text-sm text-slate-400 border-t border-slate-700/50 pt-4">
            <div className="flex justify-between">
              <span>Algorithm</span>
              <span className="text-slate-200">{modelInfo.model_name}</span>
            </div>
            <div className="flex justify-between">
              <span>Feature Extraction</span>
              <span className="text-slate-200">{modelInfo.vectorizer}</span>
            </div>
            <div className="flex justify-between">
              <span>Training Samples</span>
              <span className="text-slate-200">{modelInfo.dataset_info.training_samples.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

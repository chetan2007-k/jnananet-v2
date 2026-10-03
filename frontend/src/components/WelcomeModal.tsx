import React, { useState, useEffect } from "react";
import { Sparkles, FileText, Zap, ArrowRight, X } from "lucide-react";

export const WelcomeModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenJnanaNetTour");
    if (!hasSeenTour) {
      // Small delay so it feels natural
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("hasSeenJnanaNetTour", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-brand-600 to-indigo-600 p-8 text-white">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/20 shadow-inner">
            <Zap className="w-8 h-8 text-brand-100" />
          </div>
          <h2 className="text-3xl font-extrabold mb-2">Welcome to JnanaNet V2</h2>
          <p className="text-brand-100 text-lg">The intelligent way to find, match, and auto-apply for scholarships.</p>
        </div>

        {/* Feature Cards */}
        <div className="p-8">
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">1. Smart Document Vault</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Upload your marksheet in the Identity Hub. Our AI (OCR) will automatically extract your marks and fill your profile.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">2. Deterministic Matching</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our engine instantly compares your profile against thousands of scholarships and scores your exact eligibility percentage.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">3. Magic Auto-Apply</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Found a match? Click "Magic Auto-Apply" to automatically map your profile data into government portals.
              </p>
            </div>

          </div>

          <div className="mt-10 flex justify-end">
            <button 
              onClick={handleClose}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};
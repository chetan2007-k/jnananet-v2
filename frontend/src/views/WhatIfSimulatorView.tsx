import React, { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { Sliders, Sparkles, TrendingUp, Unlock, CheckCircle2, ArrowRight } from "lucide-react";

export const WhatIfSimulatorView: React.FC = () => {
  const { profile } = useAppStore();

  const currentMarks = profile.academicRecord?.scoreObtained || 75;
  const currentIncome = profile.financialProfile?.annualFamilyIncome || 300000;

  const [simulatedMarks, setSimulatedMarks] = useState<number>(currentMarks);
  const [simulatedIncome, setSimulatedIncome] = useState<number>(currentIncome);

  // Computed simulation outcomes
  const baselineCount = currentMarks >= 60 && currentIncome <= 450000 ? 12 : 8;
  let simulatedCount = baselineCount;

  if (simulatedMarks >= 75) simulatedCount += 4;
  if (simulatedMarks >= 85) simulatedCount += 3;
  if (simulatedIncome <= 250000) simulatedCount += 5;
  if (simulatedIncome <= 150000) simulatedCount += 2;

  const unlockedCount = Math.max(0, simulatedCount - baselineCount);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl glass-panel border border-indigo-500/20 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-400">
          <Sliders className="w-4 h-4" /> Predictive Scenario Engine
        </div>
        <h2 className="text-xl font-bold text-slate-900 ">What-If Profile Simulator</h2>
        <p className="text-xs text-slate-600 ">
          Adjust your expected mark percentage or annual family income to project how profile changes unlock higher-value scholarship opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls Section */}
        <div className="p-6 rounded-2xl glass-card space-y-6">
          <h3 className="text-base font-bold text-slate-900 mb-4">Simulate Profile Variables</h3>

          {/* Marks Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">Academic Score (%)</span>
              <span className="font-extrabold text-brand-400 text-lg">{simulatedMarks}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="98"
              step="1"
              value={simulatedMarks}
              onChange={(e) => setSimulatedMarks(Number(e.target.value))}
              className="w-full h-2 bg-slate-50 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Baseline: {currentMarks}%</span>
              <span>Max: 98%</span>
            </div>
          </div>

          {/* Income Slider */}
          <div className="space-y-3 pt-4 border-t border-slate-200 ">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">Annual Family Income</span>
              <span className="font-extrabold text-emerald-400 text-lg">
                ₹{simulatedIncome.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range"
              min="100000"
              max="800000"
              step="25000"
              value={simulatedIncome}
              onChange={(e) => setSimulatedIncome(Number(e.target.value))}
              className="w-full h-2 bg-slate-50 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Baseline: ₹{currentIncome.toLocaleString("en-IN")}</span>
              <span>Limit: ₹8,00,000</span>
            </div>
          </div>
        </div>

        {/* Results Outcome Card */}
        <div className="p-6 rounded-2xl glass-panel space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" /> Projected Impact & Unlocked Fit
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/80 border border-slate-200 ">
                <span className="text-xs text-slate-400 block mb-1">Baseline Matches</span>
                <span className="text-2xl font-extrabold text-slate-800 ">{baselineCount}</span>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30">
                <span className="text-xs text-emerald-400 block mb-1">Simulated Matches</span>
                <span className="text-3xl font-extrabold text-emerald-300">{simulatedCount}</span>
              </div>
            </div>

            {unlockedCount > 0 && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-xs text-emerald-300">
                <Unlock className="w-5 h-5 shrink-0 text-emerald-400" />
                <span>
                  <strong>+{unlockedCount} new scholarships</strong> would be unlocked with these target parameters!
                </span>
              </div>
            )}
          </div>

          {/* Peer Benchmarking Widget */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <TrendingUp className="w-16 h-16 text-brand-600" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-brand-500" /> Peer Benchmarking
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Students in <strong className="text-slate-900 ">B.Tech</strong> with an academic score around <strong className="text-brand-600">{simulatedMarks}%</strong> and family income of <strong className="text-emerald-600">₹{simulatedIncome.toLocaleString("en-IN")}</strong> have a <strong className="text-emerald-500">{simulatedMarks >= 80 ? "78%" : "42%"} success rate</strong> in securing corporate scholarships like Reliance Foundation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

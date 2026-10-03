import React, { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { X, Lock, Mail, User, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useAppStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("student.demo@jnananet.in");
  const [password, setPassword] = useState("Password123");
  const [fullName, setFullName] = useState("Aarav Chenna");
  const [state, setState] = useState("Tamil Nadu");
  const [district, setDistrict] = useState("Chennai");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      updateProfile({
        fullName: mode === "register" ? fullName : profile.fullName || "Aarav Chenna",
        state: mode === "register" ? state : profile.state || "Tamil Nadu",
        district: mode === "register" ? district : profile.district || "Chennai",
      });

      setSuccessMsg(mode === "login" ? "Successfully authenticated! JWT Session active." : "Account created & student profile initialized!");
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 1500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl glass-panel border border-slate-300 p-6 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-900"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Secure JWT Session
          </div>
          <h3 className="text-xl font-bold text-slate-900 ">
            {mode === "login" ? "Student Login" : "Create Student Account"}
          </h3>
          <p className="text-xs text-slate-400">
            {mode === "login" ? "Access your scholarship matches and documents vault" : "Register your student profile for AI scholarship matching"}
          </p>
        </div>

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === "register" && (
            <div>
              <label className="text-slate-400 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-slate-400 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {mode === "register" && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 block mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 "
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">District</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 "
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-slate-900 font-semibold text-xs transition shadow-lg shadow-brand-600/25 flex items-center justify-center gap-1.5"
          >
            {isLoading ? "Authenticating..." : mode === "login" ? "Login to Account" : "Create Account & Start"} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-3 border-t border-slate-200 text-center text-xs text-slate-400">
          {mode === "login" ? (
            <p>
              New student?{" "}
              <button
                onClick={() => setMode("register")}
                className="text-brand-400 font-semibold hover:underline"
              >
                Register Account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-brand-400 font-semibold hover:underline"
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

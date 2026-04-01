import { useNavigate, useLocation } from "react-router";
import { Scale, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAnalysis = location.pathname === "/analysis";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[#C2EDE2]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#3BBFA3] flex items-center justify-center shadow-sm group-hover:bg-[#2A9178] transition-colors">
            <Scale size={16} className="text-white" />
          </div>
          <span className="text-[#0D2B25] tracking-tight">
            Zan<span className="text-[#3BBFA3]">Drive</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => navigate("/")}
            className={`text-sm transition-colors ${
              !isAnalysis
                ? "text-[#3BBFA3]"
                : "text-[#5A8278] hover:text-[#0D2B25]"
            }`}
          >
            Главная
          </button>
          <button
            onClick={() => navigate("/analysis")}
            className={`text-sm transition-colors ${
              isAnalysis
                ? "text-[#3BBFA3]"
                : "text-[#5A8278] hover:text-[#0D2B25]"
            }`}
          >
            Анализ
          </button>
          <a href="#features" className="text-sm text-[#5A8278] hover:text-[#0D2B25] transition-colors">
            Возможности
          </a>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate("/analysis")}
            className="px-4 py-2 rounded-lg bg-[#3BBFA3] text-white text-sm hover:bg-[#2A9178] transition-colors shadow-sm"
          >
            Начать анализ
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[#0D2B25]"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#C2EDE2] px-6 py-4 flex flex-col gap-4">
          <button
            onClick={() => { navigate("/"); setMobileOpen(false); }}
            className="text-sm text-[#5A8278] text-left"
          >
            Главная
          </button>
          <button
            onClick={() => { navigate("/analysis"); setMobileOpen(false); }}
            className="text-sm text-[#5A8278] text-left"
          >
            Анализ
          </button>
          <button
            onClick={() => { navigate("/analysis"); setMobileOpen(false); }}
            className="px-4 py-2 rounded-lg bg-[#3BBFA3] text-white text-sm text-center"
          >
            Начать анализ
          </button>
        </div>
      )}
    </nav>
  );
}

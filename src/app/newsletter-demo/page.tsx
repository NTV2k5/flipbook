import React from "react";
import FlipbookWrapper from "@/components/FlipbookWrapper";
import { BookOpen, Sparkles, Shield, Cpu } from "lucide-react";

export const metadata = {
  title: "Interactive 3D PDF Flipbook - Lifestyle Magazine",
  description: "Experience premium interactive 3D PDF page flipping built with Next.js, react-pdf, and page-flip.",
};

const DEFAULT_PDF_URL = "https://millennia-cms-dev.dxfuturetech.com.vn/uploads/Lifestyle_Magazine_741369f362.pdf";

export default function HomePage() {
  return (
    <div className="flex-1 min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      
      {/* 1. Header Area */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between border-b border-slate-900 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/20 animate-pulse">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent tracking-wide">
              FLIPBOOK 3D
            </h1>
            <p className="text-xs text-slate-500 font-mono tracking-wider">NEXT.JS 16 PREMIUM VIEWER</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800/60 backdrop-blur-md">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-slate-400 font-mono">
            Active Magazine: Lifestyle Magazine
          </span>
        </div>
      </header>

      {/* 2. Interactive Viewer Container */}
      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 py-6 md:py-8 gap-8">
        
        {/* Flipbook Wrapper */}
        <section className="flex-1 flex flex-col border border-slate-900 rounded-3xl overflow-hidden shadow-2xl bg-slate-950 shadow-black/80 h-[75vh] min-h-[600px] relative">
          <FlipbookWrapper pdfUrl={DEFAULT_PDF_URL} />
        </section>

        {/* 3. Features Dashboard */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          
          <div className="group p-6 rounded-2xl bg-slate-900/30 border border-slate-900 hover:border-cyan-500/30 transition-all duration-300 backdrop-blur-md">
            <div className="p-3 w-max rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-200 mb-2">3D Page-Turning</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Realistic, physics-inspired flip animations simulating actual book pages using canvas rendering. Supports touch swipe and mouse drag actions.
            </p>
          </div>

          <div className="group p-6 rounded-2xl bg-slate-900/30 border border-slate-900 hover:border-emerald-500/30 transition-all duration-300 backdrop-blur-md">
            <div className="p-3 w-max rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-200 mb-2">Synthesized Sound & Zoom</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Synthesized realistic friction audio using the browser's Web Audio API. CSS-accelerated hardware scaling for responsive, crisp canvas zooming up to 300%.
            </p>
          </div>

          <div className="group p-6 rounded-2xl bg-slate-900/30 border border-slate-900 hover:border-teal-500/30 transition-all duration-300 backdrop-blur-md">
            <div className="p-3 w-max rounded-xl bg-slate-900 border border-slate-800 text-teal-400 mb-4 group-hover:scale-110 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-200 mb-2">Dynamic Client Load</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Bypasses Next.js server pre-rendering. Completely isolates browser API execution, improving initial page loads and protecting Core Web Vitals.
            </p>
          </div>

        </section>
      </main>

      {/* 4. Footer */}
      <footer className="w-full border-t border-slate-900 py-6 text-center text-xs text-slate-600 font-mono mt-auto">
        &copy; {new Date().getFullYear()} Flipbook 3D. Powered by Next.js & PDF.js.
      </footer>
    </div>
  );
}

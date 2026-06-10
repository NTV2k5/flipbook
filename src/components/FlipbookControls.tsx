"use client";

import React from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface FlipbookControlsProps {
  currentPage: number;
  totalPages: number;
  zoom: number;
  isMuted: boolean;
  isFullscreen: boolean;
  isLoading: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onFirstPage: () => void;
  onLastPage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onDownload: () => void;
  onJumpToPage: (page: number) => void;
}

export const FlipbookControls: React.FC<FlipbookControlsProps> = ({
  currentPage,
  totalPages,
  zoom,
  isMuted,
  isFullscreen,
  isLoading,
  onPrevPage,
  onNextPage,
  onFirstPage,
  onLastPage,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleMute,
  onToggleFullscreen,
  onDownload,
  onJumpToPage,
}) => {
  const [pageInput, setPageInput] = React.useState((currentPage + 1).toString());

  React.useEffect(() => {
    setPageInput((currentPage + 1).toString());
  }, [currentPage]);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onJumpToPage(pageNum - 1);
    } else {
      setPageInput((currentPage + 1).toString());
    }
  };

  const handlePageInputBlur = () => {
    setPageInput((currentPage + 1).toString());
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 px-6 py-3 rounded-2xl bg-slate-950/80 border border-slate-800/60 shadow-2xl backdrop-blur-xl transition-all duration-300 max-w-[90vw] md:max-w-max">
      <div className="flex flex-wrap items-center justify-center gap-4 text-slate-200">
        
        {/* Navigation Group */}
        <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/40">
          <button
            onClick={onFirstPage}
            disabled={currentPage === 0 || isLoading}
            className="p-2 rounded-lg hover:bg-slate-800/80 disabled:opacity-40 disabled:hover:bg-transparent transition-all duration-200"
            title="First Page"
          >
            <ChevronsLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onPrevPage}
            disabled={currentPage === 0 || isLoading}
            className="p-2 rounded-lg hover:bg-slate-800/80 disabled:opacity-40 disabled:hover:bg-transparent transition-all duration-200"
            title="Previous Page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Page Display & Input */}
          <form
            onSubmit={handlePageInputSubmit}
            className="flex items-center gap-1.5 px-2 font-mono text-sm"
          >
            <input
              type="text"
              value={pageInput}
              onChange={handlePageInputChange}
              onBlur={handlePageInputBlur}
              disabled={isLoading || totalPages <= 0}
              className="w-10 h-7 text-center rounded bg-slate-950 border border-slate-800 focus:outline-none focus:border-cyan-500 font-bold text-cyan-400 selection:bg-cyan-500/30"
            />
            <span className="text-slate-400">/</span>
            <span className="text-slate-300 font-medium select-none pr-1">
              {totalPages || "-"}
            </span>
          </form>

          <button
            onClick={onNextPage}
            disabled={currentPage >= totalPages - 1 || isLoading}
            className="p-2 rounded-lg hover:bg-slate-800/80 disabled:opacity-40 disabled:hover:bg-transparent transition-all duration-200"
            title="Next Page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={onLastPage}
            disabled={currentPage >= totalPages - 1 || isLoading}
            className="p-2 rounded-lg hover:bg-slate-800/80 disabled:opacity-40 disabled:hover:bg-transparent transition-all duration-200"
            title="Last Page"
          >
            <ChevronsRight className="w-5 h-5" />
          </button>
        </div>

        <div className="w-px h-6 bg-slate-800/60 hidden sm:block" />

        {/* Zoom Group */}
        <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/40">
          <button
            onClick={onZoomOut}
            disabled={zoom <= 0.8 || isLoading}
            className="p-2 rounded-lg hover:bg-slate-800/80 disabled:opacity-40 disabled:hover:bg-transparent transition-all duration-200"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="w-14 text-center font-mono text-xs text-slate-400 select-none">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={onZoomIn}
            disabled={zoom >= 3.0 || isLoading}
            className="p-2 rounded-lg hover:bg-slate-800/80 disabled:opacity-40 disabled:hover:bg-transparent transition-all duration-200"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          {zoom !== 1 && (
            <button
              onClick={onResetZoom}
              className="p-2 rounded-lg hover:bg-slate-800/80 text-cyan-400 hover:text-cyan-300 transition-all duration-200"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="w-px h-6 bg-slate-800/60" />

        {/* Utility Group */}
        <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/40">
          {/* Mute Button */}
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isMuted
                ? "text-rose-400 hover:text-rose-300 hover:bg-slate-800/80"
                : "text-emerald-400 hover:text-emerald-300 hover:bg-slate-800/80"
            }`}
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-lg hover:bg-slate-800/80 hover:text-cyan-400 transition-all duration-200"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>

          {/* Download Button */}
          <button
            onClick={onDownload}
            className="p-2 rounded-lg hover:bg-slate-800/80 hover:text-cyan-400 transition-all duration-200"
            title="Download PDF"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};

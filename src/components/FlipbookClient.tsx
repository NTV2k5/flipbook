"use client";

import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import { playPageFlipSound } from "@/utils/sound";
import { FlipbookControls } from "./FlipbookControls";
import { Loader2, AlertCircle } from "lucide-react";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface FlipbookClientProps {
  pdfUrl: string;
}

export default function FlipbookClient({ pdfUrl }: FlipbookClientProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [renderedPagesCount, setRenderedPagesCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for HTMLFlipBook and outer container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const flipBookRef = useRef<any>(null);

  // Drag-to-pan state when zoomed
  const [isDragging, setIsDragging] = useState(false);
  const [panState, setPanState] = useState({ startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 });

  // 1. Fullscreen sync listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Document callbacks
  const onDocumentLoadSuccess = ({ numPages: totalPages }: { numPages: number }) => {
    setNumPages(totalPages);
    setRenderedPagesCount(0);
    setIsReady(false);
    setError(null);
  };

  const onDocumentLoadError = (err: Error) => {
    console.error("PDF load error:", err);
    setError("Failed to load PDF. Please make sure the URL is accessible and valid.");
  };

  const onPageRenderSuccess = () => {
    setRenderedPagesCount((prev) => prev + 1);
  };

  // Helper to get raw pageflip instance
  const getPageFlipInstance = () => {
    return flipBookRef.current?.pageFlip();
  };

  // Navigation handlers
  const handlePrevPage = () => getPageFlipInstance()?.flipPrev();
  const handleNextPage = () => getPageFlipInstance()?.flipNext();
  const handleFirstPage = () => getPageFlipInstance()?.flip(0);
  const handleLastPage = () => getPageFlipInstance()?.flip(numPages - 1);
  const handleJumpToPage = (pageIdx: number) => getPageFlipInstance()?.flip(pageIdx);

  // Click-to-flip handler (adds tap-to-turn support for tablets/mobiles and ease of use for desktops)
  const handlePageClick = (index: number) => {
    if (zoom > 1.0) return; // Disable click flipping during zoom so pan dragging works
    const pageFlip = getPageFlipInstance();
    if (!pageFlip) return;

    const isCover = index === 0;
    const isLast = index === numPages - 1;

    if (isCover) {
      pageFlip.flipNext();
    } else if (isLast) {
      pageFlip.flipPrev();
    } else if (index % 2 === 1) {
      // Left pages (odd index in 0-based page list)
      pageFlip.flipPrev();
    } else {
      // Right pages (even index in 0-based page list)
      pageFlip.flipNext();
    }
  };

  // Zoom handlers
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.8));
  const handleResetZoom = () => setZoom(1.0);

  // Mute handler
  const handleToggleMute = () => setIsMuted((prev) => !prev);

  // Fullscreen handler
  const handleToggleFullscreen = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.error("Fullscreen error:", err));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch((err) => console.error("Exit fullscreen error:", err));
    }
  };

  // Download handler
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.target = "_blank";
    link.download = pdfUrl.split("/").pop() || "lifestyle-magazine.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Drag and pan handlers (active only when zoomed in)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1.0 || !scrollContainerRef.current) return;
    setIsDragging(true);
    setPanState({
      startX: e.pageX - scrollContainerRef.current.offsetLeft,
      startY: e.pageY - scrollContainerRef.current.offsetTop,
      scrollLeft: scrollContainerRef.current.scrollLeft,
      scrollTop: scrollContainerRef.current.scrollTop,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1.0 || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const y = e.pageY - scrollContainerRef.current.offsetTop;
    const walkX = (x - panState.startX) * 1.5;
    const walkY = (y - panState.startY) * 1.5;
    scrollContainerRef.current.scrollLeft = panState.scrollLeft - walkX;
    scrollContainerRef.current.scrollTop = panState.scrollTop - walkY;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const renderingProgress = numPages > 0 ? Math.round((renderedPagesCount / numPages) * 100) : 0;
  // Sách sẵn sàng khi tất cả các trang đã render thành công và HTMLFlipBook đã init
  const isLoading = numPages === 0 || renderedPagesCount < numPages || !isReady;

  return (
    <div className="relative flex flex-col flex-1 w-full h-full bg-slate-950 overflow-hidden select-none">
      
      {/* 1. Loader Overlay */}
      {isLoading && !error && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-950/90 text-slate-200 gap-4 transition-all duration-300">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
          <div className="flex flex-col items-center gap-1.5 text-center">
            <h3 className="font-semibold text-lg">Preparing your Flipbook</h3>
            <p className="text-slate-400 text-sm max-w-xs px-4">
              {numPages === 0
                ? "Downloading and parsing PDF document..."
                : `Rendering pages: ${renderedPagesCount} of ${numPages} (${renderingProgress}%)`}
            </p>
          </div>
          {numPages > 0 && (
            <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-200"
                style={{ width: `${renderingProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* 2. Error Display */}
      {error && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-950 text-slate-200 gap-4 p-6 text-center">
          <AlertCircle className="w-14 h-14 text-rose-500" />
          <h3 className="font-bold text-xl text-rose-400">Unable to Load Book</h3>
          <p className="text-slate-400 max-w-md text-sm">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setNumPages(0);
              setRenderedPagesCount(0);
            }}
            className="mt-2 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-semibold text-sm transition-all duration-200 shadow-lg"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* 3. Flipbook Area */}
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`flex-1 w-full h-full flex items-center justify-center px-4 py-8 md:px-12 md:py-16 ${
          zoom > 1.0 ? "overflow-auto cursor-grab" : "overflow-hidden"
        } ${isDragging ? "cursor-grabbing" : ""}`}
      >
        <div
          className="w-full max-w-6xl flex justify-center transition-transform duration-300 ease-out animate-fade-in"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={null}
            error={null}
            className="w-full flex items-center justify-center"
          >
            {numPages > 0 && (
              <HTMLFlipBook
                ref={flipBookRef}
                width={550} // Base single page width
                height={780} // Base single page height
                size="stretch"
                minWidth={310}
                maxWidth={1000}
                minHeight={440}
                maxHeight={1400}
                maxShadowOpacity={0.3}
                showCover={true}
                mobileScrollSupport={false}
                useMouseEvents={true}
                swipeDistance={30}
                onFlip={(e) => {
                  setCurrentPage(e.data);
                  if (!isMuted) {
                    playPageFlipSound();
                  }
                }}
                onInit={() => {
                  setIsReady(true);
                }}
                className={`st-page-flip shadow-2xl transition-opacity duration-500 ${
                  isReady ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                {Array.from(new Array(numPages), (_, index) => {
                  const isCover = index === 0 || index === numPages - 1;
                  return (
                    <div
                      key={`page_${index + 1}`}
                      className="page-wrapper bg-slate-900 overflow-hidden select-none cursor-pointer"
                      data-density={isCover ? "hard" : "soft"}
                      onClick={() => handlePageClick(index)}
                    >
                      <div className="relative w-full h-full bg-white flex items-center justify-center overflow-hidden">
                        <Page
                          pageNumber={index + 1}
                          width={600} // High resolution canvas page render
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          onRenderSuccess={onPageRenderSuccess}
                          loading={
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-400 gap-2">
                              <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                              <span className="text-xs font-mono">Page {index + 1}</span>
                            </div>
                          }
                        />
                        {/* Shadow Overlay for book depth */}
                        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
                        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
                        
                        {/* Page number indicators on the page itself */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-400 font-mono select-none">
                          {index + 1}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </HTMLFlipBook>
            )}
          </Document>
        </div>
      </div>

      {/* 4. Glassmorphism Controls */}
      <FlipbookControls
        currentPage={currentPage}
        totalPages={numPages}
        zoom={zoom}
        isMuted={isMuted}
        isFullscreen={isFullscreen}
        isLoading={isLoading}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        onFirstPage={handleFirstPage}
        onLastPage={handleLastPage}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onToggleMute={handleToggleMute}
        onToggleFullscreen={handleToggleFullscreen}
        onDownload={handleDownload}
        onJumpToPage={handleJumpToPage}
      />
    </div>
  );
}

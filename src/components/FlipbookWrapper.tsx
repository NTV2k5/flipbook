"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import the Flipbook component to disable Server-Side Rendering (SSR).
// By placing this in a client component wrapper (FlipbookWrapper), we allow the main page.tsx
// to remain a Server Component, preserving SEO metadata optimization.
const FlipbookClient = dynamic(() => import("./FlipbookClient"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-950 text-slate-300 gap-4">
      <Loader2 className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin text-cyan-400" />
      <p className="font-mono text-sm tracking-wider animate-pulse text-cyan-400">
        LOADING INTERACTIVE ENVIRONMENT...
      </p>
    </div>
  ),
});

interface FlipbookWrapperProps {
  pdfUrl: string;
}

export default function FlipbookWrapper({ pdfUrl }: FlipbookWrapperProps) {
  return <FlipbookClient pdfUrl={pdfUrl} />;
}

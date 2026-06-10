# Next.js 3D PDF Flipbook

A premium, interactive 3D PDF Flipbook application built with Next.js App Router, completely from scratch. This project aims to replicate the smooth, realistic page-turning experience of premium libraries like DearFlip, but entirely tailored within the React ecosystem.

## 🚀 Technologies Used

- **Framework**: Next.js 16.2 (App Router)
- **Styling**: Tailwind CSS v4
- **PDF Parsing**: `react-pdf`
- **3D Flip Effect**: `react-pageflip` (and `page-flip` core)
- **Icons**: `lucide-react`

---

## 📖 How It Works

Creating a high-performance 3D flipbook from a raw PDF file requires two main steps: Parsing and 3D Wrapping.

### 1. Parsing PDF with `react-pdf`
- We utilize `react-pdf` (which acts as a React wrapper around Mozilla's `pdf.js`) to fetch the target PDF document.
- We initialize a dedicated Web Worker to process the heavy PDF file asynchronously, preventing the main browser thread from freezing.
- Once the document is loaded, we loop through the total number of pages and render each page into a high-resolution HTML5 `<canvas>` element. Text and annotation layers are intentionally hidden to keep the DOM clean and focus entirely on visual presentation.

### 2. Adding the 3D Flip Effect with `react-pageflip`
- The `<HTMLFlipBook>` component from `react-pageflip` wraps all the generated PDF `<canvas>` pages.
- It provides the 3D physics engine that calculates page curls, realistic shadows based on page depth, and smooth transition animations.
- It handles complex responsive states seamlessly: displaying two pages side-by-side (landscape spread) on Desktop, and automatically stacking to single pages (portrait) on Mobile.

---

## ✨ Features & Fixes Implemented

### 🎨 Premium UI/UX
- **Glassmorphism Control Bar**: A sleek, floating control interface allowing users to Zoom, toggle Sound, enter Fullscreen, Download the PDF, and jump to the First/Last/Next/Prev pages.
- **Dynamic Loading Screen**: A futuristic loading spinner displaying the exact percentage of pages rendered to `<canvas>` before revealing the book.
- **Audio Feedback**: Realistic paper-flipping sound effects integrated upon page turn.

### 🛠️ SEO & Performance (Hybrid Rendering)
- The application leverages Next.js 16's **Server Components** for the main entry point (`app/page.tsx`), providing full `metadata` export for aggressive SEO optimization.
- The heavy PDF Flipbook (`FlipbookClient.tsx`) is injected using **Dynamic Imports (`ssr: false`)**. This technique isolates the browser-specific APIs (Canvas, Window, DOM manipulation) from the Node.js server, preventing Hydration errors while keeping the rest of the site SEO-friendly.

### 🐛 Touch & Pointer Event Optimizations
Working with complex 3D drag-and-drop libraries often brings cross-device event conflicts. We have deeply customized the event handling:
- **Mobile/Tablet Tap to Flip Fix**: Natively, iOS Safari and touch devices often require a double-tap to register a click in these libraries. We fixed this by implementing a highly responsive `onPointerUp` listener. It calculates exactly where the user taps relative to the container width (Right half = Next page, Left half = Previous page).
- **Desktop Double-Flip Fix**: To prevent custom pointer events from conflicting with `react-pageflip`'s internal mouse listeners (which caused a 4-page jump on PC), we implemented a `pointerType` check. Mouse events are passed down natively to the library, while touch events are intercepted and handled by our custom logic, resulting in perfect UX across all devices.

---

## 📦 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

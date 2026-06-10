declare module "page-flip" {
  export interface PageFlipOptions {
    width: number;
    height: number;
    size?: "fixed" | "stretch";
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    drawShadow?: boolean;
    maxShadowOpacity?: number;
    flippingTime?: number;
    useMouseEvents?: boolean;
    swipeDistance?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    clickEventForward?: boolean;
    usePortrait?: boolean;
    startPage?: number;
  }

  export interface FlipEvent {
    data: number; // Page index
  }

  export class PageFlip {
    constructor(element: HTMLElement, options: PageFlipOptions);
    loadFromHTML(elements: HTMLElement[] | NodeListOf<Element>): void;
    loadFromImages(imagesParts: string[]): void;
    destroy(): void;
    flipNext(): void;
    flipPrev(): void;
    flip(pageIndex: number): void;
    getCurrentPageIndex(): number;
    getPageCount(): number;
    on(eventName: "flip", callback: (e: FlipEvent) => void): void;
    on(eventName: string, callback: (e: any) => void): void;
  }
}

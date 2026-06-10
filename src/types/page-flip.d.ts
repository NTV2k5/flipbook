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

declare module "react-pageflip" {
  import * as React from "react";
  import { PageFlipOptions, FlipEvent } from "page-flip";

  export interface HTMLFlipBookProps extends Partial<PageFlipOptions> {
    className?: string;
    style?: React.CSSProperties;
    onFlip?: (e: FlipEvent) => void;
    onChangeState?: (e: any) => void;
    onChangeOrientation?: (e: any) => void;
    onInit?: (e: any) => void;
    children: React.ReactNode;
  }

  // We export HTMLFlipBook as a forwardRef component or a class component
  // react-pageflip uses React.forwardRef, exposing .pageFlip() on its ref.
  const HTMLFlipBook: React.ForwardRefExoticComponent<
    HTMLFlipBookProps & React.RefAttributes<any>
  >;

  export default HTMLFlipBook;
}

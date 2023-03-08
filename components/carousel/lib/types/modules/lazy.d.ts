import { Dom7Array } from 'dom7';
import { CSSSelector } from '../../../shared';
import carousel from '../carousel-class';

export interface LazyMethods {
  /**
   * Load/update lazy images based on current slider state (position)
   */
  load(): void;

  /**
   * Force to load lazy images in slide by specified index
   * @param number index number of slide to load lazy images in
   */
  loadInSlide(index: number): void;
}

export interface LazyEvents {
  /**
   * Event will be fired in the beginning of lazy loading of image
   */
  lazyImageLoad: (carousel: carousel, slideEl: HTMLElement, imageEl: HTMLElement) => void;
  /**
   * Event will be fired when lazy loading image will be loaded
   */
  lazyImageReady: (carousel: carousel, slideEl: HTMLElement, imageEl: HTMLElement) => void;
}

export interface LazyOptions {
  /**
   * Whether the lazy loading images is enabled
   *
   * @default false
   */
  enabled?: boolean;
  /**
   * Enables to check is the carousel in view before lazy loading images on initial slides
   *
   * @default false
   */
  checkInView?: boolean;
  /**
   * Element to check scrolling on for `checkInView`. Defaults to `window`
   */
  scrollingElement?: CSSSelector | null | Dom7Array | HTMLElement;
  /**
   * Set to `true` to enable lazy loading for the closest slides images (for previous and next slide images)
   *
   * @default false
   */
  loadPrevNext?: boolean;
  /**
   * Amount of next/prev slides to preload lazy images in. Can't be less than `slidesPerView`
   *
   * @default 1
   */
  loadPrevNextAmount?: number;
  /**
   * By default, carousel will load lazy images after transition to this slide, so you may enable this parameter if you need it to start loading of new image in the beginning of transition
   *
   * @default false
   */
  loadOnTransitionStart?: boolean;
  /**
   * CSS class name of lazy element
   *
   * @default 'vts-carousel-lazy'
   */
  elementClass?: string;
  /**
   * CSS class name of lazy loading element
   *
   * @default 'vts-carousel-lazy-loading'
   */
  loadingClass?: string;
  /**
   * CSS class name of lazy loaded element
   *
   * @default 'vts-carousel-lazy-loaded'
   */
  loadedClass?: string;
  /**
   * CSS class name of lazy preloader
   *
   * @default 'vts-carousel-lazy-preloader'
   */
  preloaderClass?: string;
}

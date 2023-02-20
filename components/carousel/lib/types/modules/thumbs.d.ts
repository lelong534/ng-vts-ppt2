import VtsCarousel from '../vts-carousel-class';

export interface ThumbsMethods {
  /**
   * VtsCarousel instance of thumbs swiper
   */
  vtsCarousel: VtsCarousel;

  /**
   * Update thumbs
   */
  update(initial: boolean): void;

  /**
   * Initialize thumbs
   */
  init(): boolean;
}

export interface ThumbsEvents {}

export interface ThumbsOptions {
  /**
   * VtsCarousel instance of vtsCarousel used as thumbs or object with VtsCarousel parameters to initialize thumbs vtsCarousel
   *
   * @default null
   */
  vtsCarousel?: VtsCarousel | null;
  /**
   * Additional class that will be added to activated thumbs vtsCarousel slide
   *
   * @default 'vts-carousel-slide-thumb-active'
   */
  slideThumbActiveClass?: string;
  /**
   * Additional class that will be added to thumbs vtsCarousel
   *
   * @default 'vts-carousel-thumbs'
   */
  thumbsContainerClass?: string;
  /**
   * When enabled multiple thumbnail slides may get activated
   *
   * @default true
   */
  multipleActiveThumbs?: boolean;
  /**
   * Allows to set on which thumbs active slide from edge it should automatically move scroll thumbs. For example, if set to 1 and last visible thumb will be activated (1 from edge) it will auto scroll thumbs

   *
   * @default 0
   */
  autoScrollOffset?: number;
}

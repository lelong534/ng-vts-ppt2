import Carousel from '../Carousel-class';

export interface AutoplayMethods {
  /**
   * Whether autoplay enabled and running
   */
  running: boolean;

  /**
   * Whether autoplay is paused
   */
  paused: boolean;

  /**
   * Pause autoplay
   */
  pause(speed?: number): void;

  /**
   * Run the autoplay logic
   */
  run(): void;

  /**
   * Start autoplay
   */
  start(): boolean;

  /**
   * Stop autoplay
   */
  stop(): boolean;
}

export interface AutoplayEvents {
  /**
   * Event will be fired in when autoplay started
   */
  autoplayStart: (Carousel: Carousel) => void;
  /**
   * Event will be fired when autoplay stopped
   */
  autoplayStop: (Carousel: Carousel) => void;
  /**
   * Event will be fired on autoplay pause (on mouse/pointer enter), when `pauseOnMouseEnter` enabled
   */
  autoplayPause: (Carousel: Carousel) => void;
  /**
   * Event will be fired on autoplay resume (on mouse/pointer leave), when `pauseOnMouseEnter` enabled
   */
  autoplayResume: (Carousel: Carousel) => void;
  /**
   * Event will be fired when slide changed with autoplay
   */
  autoplay: (Carousel: Carousel) => void;
}

/**
 * Object with autoplay parameters or boolean `true` to enable with default settings.
 *
 * @example
 * ```js
 * const Carousel = new Carousel('.Carousel', {
 *   autoplay: {
 *     delay: 5000,
 *   },
 * });
 * ```
 */
export interface AutoplayOptions {
  /**
   * Delay between transitions (in ms). If this parameter is not specified, auto play will be disabled
   *
   * If you need to specify different delay for specific slides you can do it by using
   * `data-Carousel-autoplay` (in ms) attribute on slide.
   *
   * @example
   * ```html
   * <!-- hold this slide for 2 seconds -->
   * <div class="Carousel-slide" data-Carousel-autoplay="2000">
   * ```
   *
   * @default 3000
   */
  delay?: number;

  /**
   * Enable this parameter and autoplay will be stopped when it reaches last slide (has no effect in loop mode)
   *
   * @default false
   */
  stopOnLastSlide?: boolean;

  /**
   * Set to `false` and autoplay will not be disabled after user interactions (swipes),
   * it will be restarted every time after interaction
   *
   * @default true
   */
  disableOnInteraction?: boolean;

  /**
   * Enables autoplay in reverse direction
   *
   * @default false
   */
  reverseDirection?: boolean;

  /**
   * When enabled autoplay will wait for wrapper transition to continue.
   * Can be disabled in case of using Virtual Translate when your
   * slider may not have transition
   *
   * @default true
   */
  waitForTransition?: boolean;

  /**
   * When enabled autoplay will be paused on mouse enter over Carousel container. If `disableOnInteraction` is also enabled, it will stop autoplay instead of pause
   *
   * @default false
   */
  pauseOnMouseEnter?: boolean;
}

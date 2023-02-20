import { VtsCarouselOptions } from './vts-carousel-options';
import VtsCarousel from './vts-carousel-class';

import { A11yEvents } from './modules/a11y';
import { AutoplayEvents } from './modules/autoplay';
import { ControllerEvents } from './modules/controller';
import { CoverflowEffectEvents } from './modules/effect-coverflow';
import { CubeEffectEvents } from './modules/effect-cube';
import { FadeEffectEvents } from './modules/effect-fade';
import { FlipEffectEvents } from './modules/effect-flip';
import { CreativeEffectEvents } from './modules/effect-creative';
import { CardsEffectEvents } from './modules/effect-cards';
import { HashNavigationEvents } from './modules/hash-navigation';
import { HistoryEvents } from './modules/history';
import { KeyboardEvents } from './modules/keyboard';
import { LazyEvents } from './modules/lazy';
import { MousewheelEvents } from './modules/mousewheel';
import { NavigationEvents } from './modules/navigation';
import { PaginationEvents } from './modules/pagination';
import { ParallaxEvents } from './modules/parallax';
import { ScrollbarEvents } from './modules/scrollbar';
import { ThumbsEvents } from './modules/thumbs';
import { VirtualEvents } from './modules/virtual';
import { ZoomEvents } from './modules/zoom';
import { FreeModeEvents } from './modules/free-mode';

export interface VtsCarouselEvents {
  // CORE_EVENTS_START
  /**
   * Fired right after VtsCarousel initialization.
   * @note Note that with `vtsCarousel.on('init')` syntax it will
   * work only in case you set `init: false` parameter.
   *
   * @example
   * ```js
   * const vtsCarousel = new VtsCarousel('.vtsCarousel', {
   *   init: false,
   *   // other parameters
   * });
   * vtsCarousel.on('init', function() {
   *  // do something
   * });
   * // init VtsCarousel
   * vtsCarousel.init();
   * ```
   *
   * @example
   * ```js
   * // Otherwise use it as the parameter:
   * const vtsCarousel = new VtsCarousel('.vtsCarousel', {
   *   // other parameters
   *   on: {
   *     init: function () {
   *       // do something
   *     },
   *   }
   * });
   * ```
   */
  init: (vtsCarousel: VtsCarousel) => any;

  /**
   * Event will be fired right before VtsCarousel destroyed
   */
  beforeDestroy: (vtsCarousel: VtsCarousel) => void;

  /**
   * Event will be fired when currently active slide is changed
   */
  slideChange: (vtsCarousel: VtsCarousel) => void;

  /**
   * Event will be fired in the beginning of animation to other slide (next or previous).
   */
  slideChangeTransitionStart: (vtsCarousel: VtsCarousel) => void;

  /**
   * Event will be fired after animation to other slide (next or previous).
   */
  slideChangeTransitionEnd: (vtsCarousel: VtsCarousel) => void;

  /**
   * Same as "slideChangeTransitionStart" but for "forward" direction only
   */
  slideNextTransitionStart: (vtsCarousel: VtsCarousel) => void;

  /**
   * Same as "slideChangeTransitionEnd" but for "forward" direction only
   */
  slideNextTransitionEnd: (vtsCarousel: VtsCarousel) => void;

  /**
   * Same as "slideChangeTransitionStart" but for "backward" direction only
   */
  slidePrevTransitionStart: (vtsCarousel: VtsCarousel) => void;

  /**
   * Same as "slideChangeTransitionEnd" but for "backward" direction only
   */
  slidePrevTransitionEnd: (vtsCarousel: VtsCarousel) => void;

  /**
   * Event will be fired in the beginning of transition.
   */
  transitionStart: (vtsCarousel: VtsCarousel) => void;

  /**
   * Event will be fired after transition.
   */
  transitionEnd: (vtsCarousel: VtsCarousel) => void;

  /**
   * Event will be fired when user touch VtsCarousel. Receives `touchstart` event as an arguments.
   */
  touchStart: (vtsCarousel: VtsCarousel, event: MouseEvent | TouchEvent | PointerEvent) => void;

  /**
   * Event will be fired when user touch and move finger over VtsCarousel. Receives `touchmove` event as an arguments.
   */
  touchMove: (vtsCarousel: VtsCarousel, event: MouseEvent | TouchEvent | PointerEvent) => void;

  /**
   * Event will be fired when user touch and move finger over VtsCarousel in direction opposite to direction parameter. Receives `touchmove` event as an arguments.
   */
  touchMoveOpposite: (vtsCarousel: VtsCarousel, event: MouseEvent | TouchEvent | PointerEvent) => void;

  /**
   * Event will be fired when user touch and move finger over VtsCarousel and move it. Receives `touchmove` event as an arguments.
   */
  sliderMove: (vtsCarousel: VtsCarousel, event: MouseEvent | TouchEvent | PointerEvent) => void;

  /**
   * Event will be fired when user release VtsCarousel. Receives `touchend` event as an arguments.
   */
  touchEnd: (vtsCarousel: VtsCarousel, event: MouseEvent | TouchEvent | PointerEvent) => void;

  /**
   * Event will be fired when user click/tap on VtsCarousel. Receives `touchend` event as an arguments.
   */
  click: (vtsCarousel: VtsCarousel, event: MouseEvent | TouchEvent | PointerEvent) => void;

  /**
   * Event will be fired when user click/tap on VtsCarousel. Receives `touchend` event as an arguments.
   */
  tap: (vtsCarousel: VtsCarousel, event: MouseEvent | TouchEvent | PointerEvent) => void;

  /**
   * Event will be fired when user double tap on VtsCarousel's container. Receives `touchend` event as an arguments
   */
  doubleTap: (vtsCarousel: VtsCarousel, event: MouseEvent | TouchEvent | PointerEvent) => void;

  /**
   * Event will be fired right after all inner images are loaded. updateOnImagesReady should be also enabled
   */
  imagesReady: (vtsCarousel: VtsCarousel) => void;

  /**
   * Event will be fired when VtsCarousel progress is changed, as an arguments it receives progress that is always from 0 to 1
   */
  progress: (vtsCarousel: VtsCarousel, progress: number) => void;

  /**
   * Event will be fired when VtsCarousel reach its beginning (initial position)
   */
  reachBeginning: (vtsCarousel: VtsCarousel) => void;

  /**
   * Event will be fired when VtsCarousel reach last slide
   */
  reachEnd: (vtsCarousel: VtsCarousel) => void;

  /**
   * Event will be fired when VtsCarousel goes to beginning or end position
   */
  toEdge: (vtsCarousel: VtsCarousel) => void;

  /**
   * Event will be fired when VtsCarousel goes from beginning or end position
   */
  fromEdge: (vtsCarousel: VtsCarousel) => void;

  /**
   * Event will be fired when vtsCarousel's wrapper change its position. Receives current translate value as an arguments
   */
  setTranslate: (vtsCarousel: VtsCarousel, translate: number) => void;

  /**
   * Event will be fired everytime when vtsCarousel starts animation. Receives current transition duration (in ms) as an arguments
   */
  setTransition: (vtsCarousel: VtsCarousel, transition: number) => void;

  /**
   * Event will be fired on window resize right before vtsCarousel's onresize manipulation
   */
  resize: (vtsCarousel: VtsCarousel) => void;

  /**
   * Event will be fired if observer is enabled and it detects DOM mutations
   */
  observerUpdate: (vtsCarousel: VtsCarousel) => void;

  /**
   * Event will be fired right before "loop fix"
   */
  beforeLoopFix: (vtsCarousel: VtsCarousel) => void;

  /**
   * Event will be fired after "loop fix"
   */
  loopFix: (vtsCarousel: VtsCarousel) => void;

  /**
   * Event will be fired on breakpoint change
   */
  breakpoint: (vtsCarousel: VtsCarousel, breakpointParams: VtsCarouselOptions) => void;

  /**
   * !INTERNAL: Event will fired right before breakpoint change
   */
  _beforeBreakpoint?: (vtsCarousel: VtsCarousel, breakpointParams: VtsCarouselOptions) => void;

  /**
   * !INTERNAL: Event will fired after setting CSS classes on vtsCarousel container element
   */
  _containerClasses?: (vtsCarousel: VtsCarousel, classNames: string) => void;

  /**
   * !INTERNAL: Event will fired after setting CSS classes on vtsCarousel slide element
   */
  _slideClass?: (vtsCarousel: VtsCarousel, slideEl: HTMLElement, classNames: string) => void;

  /**
   * !INTERNAL: Event will fired after setting CSS classes on all vtsCarousel slides
   */
  _slideClasses?: (
    vtsCarousel: VtsCarousel,
    slides: { slideEl: HTMLElement; classNames: string; index: number }[],
  ) => void;

  /**
   * !INTERNAL: Event will fired as soon as vtsCarousel instance available (before init)
   */
  _vtsCarousel?: (vtsCarousel: VtsCarousel) => void;

  /**
   * !INTERNAL: Event will be fired on free mode touch end (release) and there will no be momentum
   */
  _freeModeNoMomentumRelease?: (vtsCarousel: VtsCarousel) => void;

  /**
   * Event will fired on active index change
   */
  activeIndexChange: (vtsCarousel: VtsCarousel) => void;
  /**
   * Event will fired on snap index change
   */
  snapIndexChange: (vtsCarousel: VtsCarousel) => void;
  /**
   * Event will fired on real index change
   */
  realIndexChange: (vtsCarousel: VtsCarousel) => void;
  /**
   * Event will fired right after initialization
   */
  afterInit: (vtsCarousel: VtsCarousel) => void;
  /**
   * Event will fired right before initialization
   */
  beforeInit: (vtsCarousel: VtsCarousel) => void;
  /**
   * Event will fired before resize handler
   */
  beforeResize: (vtsCarousel: VtsCarousel) => void;
  /**
   * Event will fired before slide change transition start
   */
  beforeSlideChangeStart: (vtsCarousel: VtsCarousel) => void;
  /**
   * Event will fired before transition start
   */
  beforeTransitionStart: (vtsCarousel: VtsCarousel, speed: number, internal: any) => void; // what is internal?
  /**
   * Event will fired on direction change
   */
  changeDirection: (vtsCarousel: VtsCarousel) => void;
  /**
   * Event will be fired when user double click/tap on VtsCarousel
   */
  doubleClick: (vtsCarousel: VtsCarousel, event: MouseEvent | TouchEvent | PointerEvent) => void;
  /**
   * Event will be fired on vtsCarousel destroy
   */
  destroy: (vtsCarousel: VtsCarousel) => void;
  /**
   * Event will be fired on momentum bounce
   */
  momentumBounce: (vtsCarousel: VtsCarousel) => void;
  /**
   * Event will be fired on orientation change (e.g. landscape -> portrait)
   */
  orientationchange: (vtsCarousel: VtsCarousel) => void;
  /**
   * Event will be fired in the beginning of animation of resetting slide to current one
   */
  slideResetTransitionStart: (vtsCarousel: VtsCarousel) => void;
  /**
   * Event will be fired in the end of animation of resetting slide to current one
   */
  slideResetTransitionEnd: (vtsCarousel: VtsCarousel) => void;
  /**
   * Event will be fired with first touch/drag move
   */
  sliderFirstMove: (vtsCarousel: VtsCarousel, event: TouchEvent) => void;
  /**
   * Event will be fired when number of slides has changed
   */
  slidesLengthChange: (vtsCarousel: VtsCarousel) => void;
  /**
   * Event will be fired when slides grid has changed
   */
  slidesGridLengthChange: (vtsCarousel: VtsCarousel) => void;
  /**
   * Event will be fired when snap grid has changed
   */
  snapGridLengthChange: (vtsCarousel: VtsCarousel) => void;
  /**
   * Event will be fired after vtsCarousel.update() call
   */
  update: (vtsCarousel: VtsCarousel) => void;
  /**
   * Event will be fired when vtsCarousel is locked (when `watchOverflow` enabled)
   */
  lock: (vtsCarousel: VtsCarousel) => void;
  /**
   * Event will be fired when vtsCarousel is unlocked (when `watchOverflow` enabled)
   */
  unlock: (vtsCarousel: VtsCarousel) => void;
  // CORE_EVENTS_END
}

interface VtsCarouselEvents extends A11yEvents {}
interface VtsCarouselEvents extends AutoplayEvents {}
interface VtsCarouselEvents extends ControllerEvents {}
interface VtsCarouselEvents extends CoverflowEffectEvents {}
interface VtsCarouselEvents extends CubeEffectEvents {}
interface VtsCarouselEvents extends FadeEffectEvents {}
interface VtsCarouselEvents extends FlipEffectEvents {}
interface VtsCarouselEvents extends CreativeEffectEvents {}
interface VtsCarouselEvents extends CardsEffectEvents {}
interface VtsCarouselEvents extends HashNavigationEvents {}
interface VtsCarouselEvents extends HistoryEvents {}
interface VtsCarouselEvents extends KeyboardEvents {}
interface VtsCarouselEvents extends LazyEvents {}
interface VtsCarouselEvents extends MousewheelEvents {}
interface VtsCarouselEvents extends NavigationEvents {}
interface VtsCarouselEvents extends PaginationEvents {}
interface VtsCarouselEvents extends ParallaxEvents {}
interface VtsCarouselEvents extends ScrollbarEvents {}
interface VtsCarouselEvents extends ThumbsEvents {}
interface VtsCarouselEvents extends VirtualEvents {}
interface VtsCarouselEvents extends ZoomEvents {}
interface VtsCarouselEvents extends FreeModeEvents {}

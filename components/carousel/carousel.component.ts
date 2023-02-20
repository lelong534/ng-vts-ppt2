import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  NgZone,
  OnInit,
  Output,
  PLATFORM_ID,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
// @ts-ignore
import VtsCarousel from './lib/vts-carousel';
import { Observable, of, Subject } from 'rxjs';
import { getParams } from './lib/angular/utils/get-params';
import { VtsCarouselSlideDirective } from './carousel-slide.directive';
import { EventsParams } from './carousel-events';
import { ThumbsOptions } from './lib/types/modules/thumbs';
import { ControllerOptions } from './lib/types/modules/controller';
import {
  extend,
  isObject,
  setProperty,
  ignoreNgOnChanges,
  coerceBooleanProperty,
  isShowEl,
  isEnabled,
} from './lib/angular/utils/utils';
import {
  VtsCarouselOptions,
  VtsCarouselEvents,
  NavigationOptions,
  PaginationOptions,
  ScrollbarOptions,
  VirtualOptions,
} from './lib/types';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'vts-carousel',
  templateUrl: './carousel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  
  exportAs: 'vtsCarousel',
  styles: [
    `
      vts-carousel {
        display: block;
      }
    `,
  ],
})
export class VtsCarouselComponent implements OnInit {
  @Input() enabled?: boolean;
  // @Input() on?: "on";
  @Input() direction?: 'horizontal' | 'vertical';
  //@Input() touchEventsTarget: "touchEventsTarget";
  //@Input() initialSlide: "initialSlide";
  @Input() speed?: number;
  // @Input() cssMode: "cssMode";
  // @Input() updateOnWindowResize: "updateOnWindowResize";
  // @Input() resizeObserver: "resizeObserver";
  // @Input() nested: "nested";
  // @Input() focusableElements: "focusableElements";
  // @Input() width: "width";
  // @Input() height: "height";
  // @Input() preventInteractionOnTransition: "preventInteractionOnTransition";
  // @Input() userAgent: "userAgent";
  // @Input() url: "url";
  @Input() edgeSwipeDetection: boolean | string = '';
  @Input() edgeSwipeThreshold: number = 1;
  // @Input() freeMode: "freeMode";
  // @Input() autoHeight: "autoHeight";
  // @Input() setWrapperSize: "setWrapperSize";
  // @Input() virtualTranslate: "virtualTranslate";
  // @Input() effect: "effect";
  @Input() breakpoints?: {
    [width: number]: VtsCarouselOptions;
    [ratio: string]: VtsCarouselOptions;
  };
  @Input() spaceBetween?: number;
  @Input() slidesPerView?: number | "auto";
  // @Input() maxBackfaceHiddenSlides: "maxBackfaceHiddenSlides";
  // @Input() grid: "grid";
  // @Input() slidesPerGroup: "slidesPerGroup";
  // @Input() slidesPerGroupSkip: "slidesPerGroupSkip";
  // @Input() centeredSlides: "centeredSlides";
  // @Input() centeredSlidesBounds: "centeredSlidesBounds";
  // @Input() slidesOffsetBefore: "slidesOffsetBefore";
  // @Input() slidesOffsetAfter: "slidesOffsetAfter";
  // @Input() normalizeSlideIndex: "normalizeSlideIndex";
  // @Input() centerInsufficientSlides: "centerInsufficientSlides";
  // @Input() watchOverflow: "watchOverflow";
  // @Input() roundLengths: "roundLengths";
  // @Input() touchRatio: "touchRatio";
  // @Input() touchAngle: "touchAngle";
  // @Input() simulateTouch: "simulateTouch";
  // @Input() shortSwipes: "shortSwipes";
  // @Input() longSwipes: "longSwipes";
  // @Input() longSwipesRatio: "longSwipesRatio";
  // @Input() longSwipesMs: "longSwipesMs";
  // @Input() followFinger: "followFinger";
  // @Input() allowTouchMove: "allowTouchMove";
  // @Input() threshold: "threshold";
  // @Input() touchMoveStopPropagation: "touchMoveStopPropagation";
  // @Input() touchStartPreventDefault: "touchStartPreventDefault";
  // @Input() touchStartForcePreventDefault: "touchStartForcePreventDefault";
  // @Input() touchReleaseOnEdges: "touchReleaseOnEdges";
  // @Input() uniqueNavElements: "uniqueNavElements";
  // @Input() resistance: "resistance";
  // @Input() resistanceRatio: "resistanceRatio";
  // @Input() watchSlidesProgress: "watchSlidesProgress";
  // @Input() grabCursor: "grabCursor";
  // @Input() preventClicks: "preventClicks";
  // @Input() preventClicksPropagation: "preventClicksPropagation";
  // @Input() slideToClickedSlide: "slideToClickedSlide";
  // @Input() preloadImages: "preloadImages";
  // @Input() updateOnImagesReady: "updateOnImagesReady";
  @Input() loop?: boolean;
  @Input() loopAdditionalSlides?: number;
  @Input() loopedSlides?: number | null;
  // @Input() loopedSlidesLimit: "loopedSlidesLimit";
  // @Input() loopFillGroupWithBlank: "loopFillGroupWithBlank";
  // @Input() loopPreventsSlide: "loopPreventsSlide";
  // @Input() rewind: "rewind";
  @Input() allowSlidePrev: boolean = true;
  @Input() allowSlideNext: boolean = true;
  // @Input() swipeHandler: "swipeHandler";
  // @Input() noSwiping: "noSwiping";
  // @Input() noSwipingClass: "noSwipingClass";
  // @Input() noSwipingSelector: "noSwipingSelector";
  // @Input() passiveListeners: "passiveListeners";
  // @Input() containerModifierClass: "containerModifierClass";
  @Input() slideClass?: string;
  // @Input() slideBlankClass: "slideBlankClass";
  // @Input() slideActiveClass: "slideActiveClass";
  // @Input() slideDuplicateActiveClass: "slideDuplicateActiveClass";
  // @Input() slideVisibleClass: "slideVisibleClass";
  @Input() slideDuplicateClass: string = "slideDuplicateClass";
  // @Input() slideNextClass: "slideNextClass";
  // @Input() slideDuplicateNextClass: "slideDuplicateNextClass";
  // @Input() slidePrevClass: "slidePrevClass";
  // @Input() slideDuplicatePrevClass: "slideDuplicatePrevClass";
  @Input() wrapperClass: string = 'vts-carousel-wrapper';
  // @Input() runCallbacksOnInit: "runCallbacksOnInit";
  // @Input() observeParents: "observeParents";
  // @Input() observeSlideChildren: "observeSlideChildren";
  // @Input() a11y: "a11y";
  // @Input() autoplay: "autoplay";
  @Input() controller?: ControllerOptions;
  // @Input() coverflowEffect: "coverflowEffect";
  // @Input() cubeEffect: "cubeEffect";
  // @Input() fadeEffect: "fadeEffect";
  // @Input() flipEffect: "flipEffect";
  // @Input() creativeEffect: "creativeEffect";
  // @Input() cardsEffect: "cardsEffect";
  // @Input() hashNavigation: "hashNavigation";
  // @Input() history: "history";
  // @Input() keyboard: "keyboard";
  // @Input() lazy: "lazy";
  // @Input() mousewheel: "mousewheel";
  // @Input() parallax: "parallax";
  @Input() thumbs?: ThumbsOptions;
  // @Input() zoom: "zoom";
  @Input() class: string = '';
  @Input() id: string = '';
  @Input()
  set navigation(val) {
    const currentNext =
      typeof this._navigation !== 'boolean' && this._navigation !== ''
        ? this._navigation?.nextEl
        : null;
    const currentPrev =
      typeof this._navigation !== 'boolean' && this._navigation !== ''
        ? this._navigation?.prevEl
        : null;
    this._navigation = setProperty(val, {
      nextEl: currentNext || null,
      prevEl: currentPrev || null,
    });
    this.showNavigation = !(
      coerceBooleanProperty(val) !== true ||
      (this._navigation &&
        typeof this._navigation !== 'boolean' &&
        this._navigation.prevEl !== this._prevElRef?.nativeElement &&
        (this._navigation.prevEl !== null || this._navigation.nextEl !== null) &&
        (typeof this._navigation.nextEl === 'string' ||
          typeof this._navigation.prevEl === 'string' ||
          typeof this._navigation.nextEl === 'object' ||
          typeof this._navigation.prevEl === 'object'))
    );
  }
  get navigation() {
    return this._navigation;
  }
  private _navigation: NavigationOptions | boolean | '';
  showNavigation: boolean = true;

  @Input()
  set pagination(val) {
    const current =
      typeof this._pagination !== 'boolean' && this._pagination !== ''
        ? this._pagination?.el
        : null;
    this._pagination = setProperty(val, {
      el: current || null,
    });
    this.showPagination = isShowEl(val, this._pagination, this._paginationElRef);
  }
  get pagination() {
    return this._pagination;
  }
  private _pagination: PaginationOptions | boolean | '';
  showPagination: boolean = true;

  @Input()
  set scrollbar(val) {
    const current =
      typeof this._scrollbar !== 'boolean' && this._scrollbar !== '' ? this._scrollbar?.el : null;
    this._scrollbar = setProperty(val, {
      el: current || null,
    });
    this.showScrollbar = isShowEl(val, this._scrollbar, this._scrollbarElRef);
  }
  get scrollbar() {
    return this._scrollbar;
  }
  private _scrollbar: ScrollbarOptions | boolean | '';
  showScrollbar: boolean = true;

  @Input()
  set virtual(val) {
    this._virtual = setProperty(val);
  }
  get virtual() {
    return this._virtual;
  }
  private _virtual: VirtualOptions | boolean | '';

  @Input()
  set config(val: VtsCarouselOptions) {
    this.updateVtsCarousel(val);
    const { params } = getParams(val);
    Object.assign(this, params);
  }
  @Output('_beforeBreakpoint') s__beforeBreakpoint = new EventEmitter<
    EventsParams['_beforeBreakpoint']
  >();

  @Output('_containerClasses') s__containerClasses = new EventEmitter<
    EventsParams['_containerClasses']
  >();

  @Output('_slideClass') s__slideClass = new EventEmitter<EventsParams['_slideClass']>();

  @Output('_vtsCarousel') s__vtsCarousel = new EventEmitter<EventsParams['_vtsCarousel']>();

  @Output('activeIndexChange') s_activeIndexChange = new EventEmitter<
    EventsParams['activeIndexChange']
  >();

  @Output('afterInit') s_afterInit = new EventEmitter<EventsParams['afterInit']>();

  @Output('autoplay') s_autoplay = new EventEmitter<EventsParams['autoplay']>();

  @Output('autoplayStart') s_autoplayStart = new EventEmitter<EventsParams['autoplayStart']>();

  @Output('autoplayStop') s_autoplayStop = new EventEmitter<EventsParams['autoplayStop']>();

  @Output('autoplayPause') s_autoplayPause = new EventEmitter<EventsParams['autoplayPause']>();

  @Output('autoplayResume') s_autoplayResume = new EventEmitter<EventsParams['autoplayResume']>();

  @Output('beforeDestroy') s_beforeDestroy = new EventEmitter<EventsParams['beforeDestroy']>();

  @Output('beforeInit') s_beforeInit = new EventEmitter<EventsParams['beforeInit']>();

  @Output('beforeLoopFix') s_beforeLoopFix = new EventEmitter<EventsParams['beforeLoopFix']>();

  @Output('beforeResize') s_beforeResize = new EventEmitter<EventsParams['beforeResize']>();

  @Output('beforeSlideChangeStart') s_beforeSlideChangeStart = new EventEmitter<
    EventsParams['beforeSlideChangeStart']
  >();

  @Output('beforeTransitionStart') s_beforeTransitionStart = new EventEmitter<
    EventsParams['beforeTransitionStart']
  >();

  @Output('breakpoint') s_breakpoint = new EventEmitter<EventsParams['breakpoint']>();

  @Output('changeDirection') s_changeDirection = new EventEmitter<
    EventsParams['changeDirection']
  >();

  @Output('click') s_click = new EventEmitter<EventsParams['click']>();

  @Output('doubleTap') s_doubleTap = new EventEmitter<EventsParams['doubleTap']>();

  @Output('doubleClick') s_doubleClick = new EventEmitter<EventsParams['doubleClick']>();

  @Output('destroy') s_destroy = new EventEmitter<EventsParams['destroy']>();

  @Output('fromEdge') s_fromEdge = new EventEmitter<EventsParams['fromEdge']>();

  @Output('hashChange') s_hashChange = new EventEmitter<EventsParams['hashChange']>();

  @Output('hashSet') s_hashSet = new EventEmitter<EventsParams['hashSet']>();

  @Output('imagesReady') s_imagesReady = new EventEmitter<EventsParams['imagesReady']>();

  @Output('init') s_init = new EventEmitter<EventsParams['init']>();

  @Output('keyPress') s_keyPress = new EventEmitter<EventsParams['keyPress']>();

  @Output('lazyImageLoad') s_lazyImageLoad = new EventEmitter<EventsParams['lazyImageLoad']>();

  @Output('lazyImageReady') s_lazyImageReady = new EventEmitter<EventsParams['lazyImageReady']>();

  @Output('loopFix') s_loopFix = new EventEmitter<EventsParams['loopFix']>();

  @Output('momentumBounce') s_momentumBounce = new EventEmitter<EventsParams['momentumBounce']>();

  @Output('navigationHide') s_navigationHide = new EventEmitter<EventsParams['navigationHide']>();

  @Output('navigationShow') s_navigationShow = new EventEmitter<EventsParams['navigationShow']>();

  @Output('navigationPrev') s_navigationPrev = new EventEmitter<EventsParams['navigationPrev']>();

  @Output('navigationNext') s_navigationNext = new EventEmitter<EventsParams['navigationNext']>();

  @Output('observerUpdate') s_observerUpdate = new EventEmitter<EventsParams['observerUpdate']>();

  @Output('orientationchange') s_orientationchange = new EventEmitter<
    EventsParams['orientationchange']
  >();

  @Output('paginationHide') s_paginationHide = new EventEmitter<EventsParams['paginationHide']>();

  @Output('paginationRender') s_paginationRender = new EventEmitter<
    EventsParams['paginationRender']
  >();

  @Output('paginationShow') s_paginationShow = new EventEmitter<EventsParams['paginationShow']>();

  @Output('paginationUpdate') s_paginationUpdate = new EventEmitter<
    EventsParams['paginationUpdate']
  >();

  @Output('progress') s_progress = new EventEmitter<EventsParams['progress']>();

  @Output('reachBeginning') s_reachBeginning = new EventEmitter<EventsParams['reachBeginning']>();

  @Output('reachEnd') s_reachEnd = new EventEmitter<EventsParams['reachEnd']>();

  @Output('realIndexChange') s_realIndexChange = new EventEmitter<
    EventsParams['realIndexChange']
  >();

  @Output('resize') s_resize = new EventEmitter<EventsParams['resize']>();

  @Output('scroll') s_scroll = new EventEmitter<EventsParams['scroll']>();

  @Output('scrollbarDragEnd') s_scrollbarDragEnd = new EventEmitter<
    EventsParams['scrollbarDragEnd']
  >();

  @Output('scrollbarDragMove') s_scrollbarDragMove = new EventEmitter<
    EventsParams['scrollbarDragMove']
  >();

  @Output('scrollbarDragStart') s_scrollbarDragStart = new EventEmitter<
    EventsParams['scrollbarDragStart']
  >();

  @Output('setTransition') s_setTransition = new EventEmitter<EventsParams['setTransition']>();

  @Output('setTranslate') s_setTranslate = new EventEmitter<EventsParams['setTranslate']>();

  @Output('slideChange') s_slideChange = new EventEmitter<EventsParams['slideChange']>();

  @Output('slideChangeTransitionEnd') s_slideChangeTransitionEnd = new EventEmitter<
    EventsParams['slideChangeTransitionEnd']
  >();

  @Output('slideChangeTransitionStart') s_slideChangeTransitionStart = new EventEmitter<
    EventsParams['slideChangeTransitionStart']
  >();

  @Output('slideNextTransitionEnd') s_slideNextTransitionEnd = new EventEmitter<
    EventsParams['slideNextTransitionEnd']
  >();

  @Output('slideNextTransitionStart') s_slideNextTransitionStart = new EventEmitter<
    EventsParams['slideNextTransitionStart']
  >();

  @Output('slidePrevTransitionEnd') s_slidePrevTransitionEnd = new EventEmitter<
    EventsParams['slidePrevTransitionEnd']
  >();

  @Output('slidePrevTransitionStart') s_slidePrevTransitionStart = new EventEmitter<
    EventsParams['slidePrevTransitionStart']
  >();

  @Output('slideResetTransitionStart') s_slideResetTransitionStart = new EventEmitter<
    EventsParams['slideResetTransitionStart']
  >();

  @Output('slideResetTransitionEnd') s_slideResetTransitionEnd = new EventEmitter<
    EventsParams['slideResetTransitionEnd']
  >();

  @Output('sliderMove') s_sliderMove = new EventEmitter<EventsParams['sliderMove']>();

  @Output('sliderFirstMove') s_sliderFirstMove = new EventEmitter<
    EventsParams['sliderFirstMove']
  >();

  @Output('slidesLengthChange') s_slidesLengthChange = new EventEmitter<
    EventsParams['slidesLengthChange']
  >();

  @Output('slidesGridLengthChange') s_slidesGridLengthChange = new EventEmitter<
    EventsParams['slidesGridLengthChange']
  >();

  @Output('snapGridLengthChange') s_snapGridLengthChange = new EventEmitter<
    EventsParams['snapGridLengthChange']
  >();

  @Output('snapIndexChange') s_snapIndexChange = new EventEmitter<
    EventsParams['snapIndexChange']
  >();

  @Output('tap') s_tap = new EventEmitter<EventsParams['tap']>();

  @Output('toEdge') s_toEdge = new EventEmitter<EventsParams['toEdge']>();

  @Output('touchEnd') s_touchEnd = new EventEmitter<EventsParams['touchEnd']>();

  @Output('touchMove') s_touchMove = new EventEmitter<EventsParams['touchMove']>();

  @Output('touchMoveOpposite') s_touchMoveOpposite = new EventEmitter<
    EventsParams['touchMoveOpposite']
  >();

  @Output('touchStart') s_touchStart = new EventEmitter<EventsParams['touchStart']>();

  @Output('transitionEnd') s_transitionEnd = new EventEmitter<EventsParams['transitionEnd']>();

  @Output('transitionStart') s_transitionStart = new EventEmitter<
    EventsParams['transitionStart']
  >();

  @Output('update') s_update = new EventEmitter<EventsParams['update']>();

  @Output('zoomChange') s_zoomChange = new EventEmitter<EventsParams['zoomChange']>();

  @Output('vtsCarousel') s_vtsCarousel = new EventEmitter<any>();

  @Output('lock') s_lock = new EventEmitter<EventsParams['lock']>();

  @Output('unlock') s_unlock = new EventEmitter<EventsParams['unlock']>();

  @ViewChild('prevElRef', { static: false })
  set prevElRef(el: ElementRef) {
    this._prevElRef = el;
    this._setElement(el, this.navigation, 'navigation', 'prevEl');
  }
  _prevElRef!: ElementRef;
  @ViewChild('nextElRef', { static: false })
  set nextElRef(el: ElementRef) {
    this._nextElRef = el;
    this._setElement(el, this.navigation, 'navigation', 'nextEl');
  }
  _nextElRef!: ElementRef;
  @ViewChild('scrollbarElRef', { static: false })
  set scrollbarElRef(el: ElementRef) {
    this._scrollbarElRef = el;
    this._setElement(el, this.scrollbar, 'scrollbar');
  }
  _scrollbarElRef!: ElementRef;
  @ViewChild('paginationElRef', { static: false })
  set paginationElRef(el: ElementRef) {
    this._paginationElRef = el;
    this._setElement(el, this.pagination, 'pagination');
  }
  _paginationElRef!: ElementRef;
  @ContentChildren(VtsCarouselSlideDirective, { descendants: false, emitDistinctChangesOnly: true })
  slidesEl!: QueryList<VtsCarouselSlideDirective>;
  private slides!: VtsCarouselSlideDirective[];

  prependSlides!: Observable<VtsCarouselSlideDirective[]>;
  appendSlides!: Observable<VtsCarouselSlideDirective[]>;

  vtsCarouselRef?: VtsCarousel;
  readonly _activeSlides = new Subject<VtsCarouselSlideDirective[]>();

  get activeSlides() {
    if (this.virtual) {
      return this._activeSlides;
    }
    return of(this.slides);
  }

  get zoomContainerClass() {
    // return this.zoom && typeof this.zoom !== 'boolean'
    //   ? this.zoom.containerClass
    //   : 'vts-carousel-zoom-container';
    return 'vts-carousel-zoom-container';
  }

  @HostBinding('class') containerClasses: string = 'vts-carousel';
  constructor(
    private _ngZone: NgZone,
    private elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private _platformId: Object,
  ) {
    this._pagination = false;
    this._navigation = false;
    this._scrollbar = false;
    this._virtual = false;
  }

  private _setElement(el: ElementRef, ref: any, update: string, key = 'el') {
    if (!ref || !el) return;
    if (el.nativeElement) {
      if (ref[key] === el.nativeElement) {
        return;
      }
      ref[key] = el.nativeElement;
    }
    const updateObj: { [key: string]: boolean } = {};
    updateObj[update] = true;
    this.updateInitVtsCarousel(updateObj);
  }
  ngOnInit(): void {
    const { params } = getParams(this);
    Object.assign(this, params);
  }
  ngAfterViewInit() {
    this.childrenSlidesInit();
    this.initVtsCarousel();
    this._changeDetectorRef.detectChanges();
    setTimeout(() => {
      this.s_vtsCarousel.emit(this.vtsCarouselRef);
    });
  }

  private childrenSlidesInit() {
    this.slidesChanges(this.slidesEl);
    this.slidesEl.changes.subscribe(this.slidesChanges);
  }

  private slidesChanges = (val: QueryList<VtsCarouselSlideDirective>) => {
    this.slides = val.map((slide: VtsCarouselSlideDirective, index: number) => {
      slide.slideIndex = index;
      slide.classNames = this.slideClass || '';
      return slide;
    });
    if (this.loop && !this.loopedSlides) {
      this.calcLoopedSlides();
    }
    if (!this.virtual) {
      if (this.loopedSlides) {
        this.prependSlides = of(this.slides.slice(this.slides.length - this.loopedSlides));
        this.appendSlides = of(this.slides.slice(0, this.loopedSlides));
      }
    } else if (this.vtsCarouselRef && this.vtsCarouselRef.hasOwnProperty('virtual')) {
      this._ngZone.runOutsideAngular(() => {
        this.vtsCarouselRef!.virtual.slides = this.slides;
        this.vtsCarouselRef!.virtual.update(true);
      });
    }
    this._changeDetectorRef.detectChanges();
  };

  get isVtsCarouselActive() {
    return this.vtsCarouselRef && !this.vtsCarouselRef.destroyed;
  }

  initVtsCarousel() {
    // const { params: vtsCarouselParams, passedParams } = getParams(this);
    const { params: vtsCarouselParams} = getParams(this);
    Object.assign(this, vtsCarouselParams);
    this._ngZone.runOutsideAngular(() => {
      vtsCarouselParams.init = false;
      if (!vtsCarouselParams.virtual) {
        vtsCarouselParams.observer = true;
      }

      vtsCarouselParams.onAny = (eventName: keyof VtsCarouselComponent, ...args: any[]) => {
        const emitter = this[('s_' + eventName) as keyof VtsCarouselComponent] as EventEmitter<any>;
        if (emitter) {
          emitter.emit([...args]);
        }
      };
      const _slideClasses: VtsCarouselEvents['_slideClasses'] = (_, updated) => {
        updated.forEach(({ slideEl, classNames }, index) => {
          const dataIndex = slideEl.getAttribute('data-vts-carousel-slide-index');
          const slideIndex = dataIndex ? parseInt(dataIndex) : index;
          if (this.virtual) {
            const virtualSlide = this.slides.find((item) => {
              return item.virtualIndex && item.virtualIndex === slideIndex;
            });
            if (virtualSlide) {
              virtualSlide.classNames = classNames;
              return;
            }
          }

          if (this.slides[slideIndex]) {
            this.slides[slideIndex].classNames = classNames;
          }
        });
        this._changeDetectorRef.detectChanges();
      };
      const _containerClasses: VtsCarouselEvents['_containerClasses'] = (_, classes) => {
        setTimeout(() => {
          this.containerClasses = classes;
        });
      };
      Object.assign(vtsCarouselParams.on, {
        _containerClasses,
        _slideClasses,
      });
      const vtsCarouselRef = new VtsCarousel(vtsCarouselParams);
      vtsCarouselRef.loopCreate = () => {};
      vtsCarouselRef.loopDestroy = () => {};
      if (vtsCarouselParams.loop) {
        vtsCarouselRef.loopedSlides = this.loopedSlides!;
      }
      const isVirtualEnabled = isEnabled(vtsCarouselRef.params.virtual!);
      if (vtsCarouselRef.virtual && isVirtualEnabled) {
        vtsCarouselRef.virtual.slides = this.slides;
        const extendWith = {
          cache: false,
          slides: this.slides,
          renderExternal: this.updateVirtualSlides,
          renderExternalUpdate: false,
        };
        extend(vtsCarouselRef.params.virtual, extendWith);
        extend(vtsCarouselRef.originalParams.virtual, extendWith);
      }

      if (isPlatformBrowser(this._platformId)) {
        this.vtsCarouselRef = vtsCarouselRef.init(this.elementRef.nativeElement);
        const isVirtualEnabled = isEnabled(this.vtsCarouselRef.params.virtual!);
        if (this.vtsCarouselRef.virtual && isVirtualEnabled) {
          this.vtsCarouselRef.virtual.update(true);
        }
        this._changeDetectorRef.detectChanges();
      }
    });
  }

  style: any = null;
  currentVirtualData: any; // TODO: type virtualData;
  private updateVirtualSlides = (virtualData: any) => {
    // TODO: type virtualData
    if (
      !this.vtsCarouselRef ||
      (this.currentVirtualData &&
        this.currentVirtualData.from === virtualData.from &&
        this.currentVirtualData.to === virtualData.to &&
        this.currentVirtualData.offset === virtualData.offset)
    ) {
      return;
    }
    this.style = this.vtsCarouselRef.isHorizontal()
      ? {
          [this.vtsCarouselRef.rtlTranslate ? 'right' : 'left']: `${virtualData.offset}px`,
        }
      : {
          top: `${virtualData.offset}px`,
        };
    this.currentVirtualData = virtualData;
    this._activeSlides.next(virtualData.slides);
    this._ngZone.run(() => {
      this._changeDetectorRef.detectChanges();
    });
    this._ngZone.runOutsideAngular(() => {
      this.vtsCarouselRef!.updateSlides();
      this.vtsCarouselRef!.updateProgress();
      this.vtsCarouselRef!.updateSlidesClasses();
      if (isEnabled(this.vtsCarouselRef!.params.lazy!)) {
        this.vtsCarouselRef!.lazy.load();
      }
      this.vtsCarouselRef!.virtual.update(true);
    });
    return;
  };

  ngOnChanges(changedParams: SimpleChanges) {
    this.updateVtsCarousel(changedParams);
    this._changeDetectorRef.detectChanges();
  }

  updateInitVtsCarousel(changedParams: any) {
    if (!(changedParams && this.vtsCarouselRef && !this.vtsCarouselRef.destroyed)) {
      return;
    }

    this._ngZone.runOutsideAngular(() => {
      const {
        // params: currentParams,
        pagination,
        navigation,
        scrollbar,
        // virtual,
        thumbs,
      } = this.vtsCarouselRef!;

      if (changedParams.pagination) {
        if (
          this.pagination &&
          typeof this.pagination !== 'boolean' &&
          this.pagination.el &&
          pagination &&
          !pagination.el
        ) {
          this.updateParameter('pagination', this.pagination);
          pagination.init();
          pagination.render();
          pagination.update();
        } else {
          pagination.destroy();
          // pagination.el = null;
        }
      }

      if (changedParams.scrollbar) {
        if (
          this.scrollbar &&
          typeof this.scrollbar !== 'boolean' &&
          this.scrollbar.el &&
          scrollbar &&
          !scrollbar.el
        ) {
          this.updateParameter('scrollbar', this.scrollbar);
          scrollbar.init();
          scrollbar.updateSize();
          scrollbar.setTranslate();
        } else {
          scrollbar.destroy();
          // scrollbar.el = null;
        }
      }

      if (changedParams.navigation) {
        if (
          this.navigation &&
          typeof this.navigation !== 'boolean' &&
          this.navigation.prevEl &&
          this.navigation.nextEl &&
          navigation &&
          !navigation.prevEl &&
          !navigation.nextEl
        ) {
          this.updateParameter('navigation', this.navigation);
          navigation.init();
          navigation.update();
        } else if (navigation.prevEl && navigation.nextEl) {
          navigation.destroy();
          //navigation.nextEl = null;
          //navigation.prevEl = null;
        }
      }
      if (changedParams.thumbs && this.thumbs && this.thumbs.vtsCarousel) {
        this.updateParameter('thumbs', this.thumbs);
        const initialized = thumbs.init();
        if (initialized) thumbs.update(true);
      }

      if (changedParams.controller && this.controller && this.controller.control) {
        this.vtsCarouselRef!.controller.control = this.controller.control;
      }

      this.vtsCarouselRef!.update();
    });
  }

  updateVtsCarousel(changedParams: SimpleChanges | any) {
    this._ngZone.runOutsideAngular(() => {
      if (changedParams.config) {
        return;
      }
      if (!(changedParams && this.vtsCarouselRef && !this.vtsCarouselRef.destroyed)) {
        return;
      }
      for (const key in changedParams) {
        if (ignoreNgOnChanges.indexOf(key) >= 0) {
          continue;
        }
        const newValue = changedParams[key]?.currentValue ?? changedParams[key];
        this.updateParameter(key, newValue);
      }

      if (changedParams.allowSlideNext) {
        this.vtsCarouselRef.allowSlideNext = this.allowSlideNext ? true : false;
      }
      if (changedParams.allowSlidePrev) {
        this.vtsCarouselRef.allowSlidePrev = this.allowSlidePrev ? true : false;
      }
      if (changedParams.direction) {
        this.vtsCarouselRef.changeDirection(this.direction, false);
      }
      if (changedParams.breakpoints) {
        if (this.loop && !this.loopedSlides) {
          this.calcLoopedSlides();
        }
        this.vtsCarouselRef.currentBreakpoint = null;
        this.vtsCarouselRef.setBreakpoint();
      }

      if (changedParams.thumbs || changedParams.controller) {
        this.updateInitVtsCarousel(changedParams);
      }
      this.vtsCarouselRef.update();
    });
  }

  calcLoopedSlides() {
    if (!this.loop) {
      return false;
    }
    let slidesPerViewParams = this.slidesPerView;
    if (this.breakpoints) {
      const breakpoint = VtsCarousel.prototype.getBreakpoint(this.breakpoints);
      const breakpointOnlyParams =
        breakpoint in this.breakpoints ? this.breakpoints[breakpoint] : undefined;
      if (breakpointOnlyParams && breakpointOnlyParams.slidesPerView) {
        slidesPerViewParams = breakpointOnlyParams.slidesPerView;
      }
    }
    if (slidesPerViewParams === 'auto') {
      this.loopedSlides = this.slides.length;
      return this.slides.length;
    }
    let loopedSlides = this.loopedSlides || slidesPerViewParams;
    if (!loopedSlides) {
      // ?
      return false;
    }

    if (this.loopAdditionalSlides) {
      loopedSlides += this.loopAdditionalSlides;
    }
    if (loopedSlides > this.slides.length) {
      loopedSlides = this.slides.length;
    }
    this.loopedSlides = loopedSlides;
    return true;
  }

  updateParameter(key: string, value: any) {
    if (!(this.vtsCarouselRef && !this.vtsCarouselRef.destroyed)) {
      return;
    }
    const _key = key.replace(/^_/, '') as keyof VtsCarouselOptions;
    const isCurrentParamObj = isObject(this.vtsCarouselRef.params[_key]);

    if (_key === 'enabled') {
      if (value === true) {
        this.vtsCarouselRef.enable();
      } else if (value === false) {
        this.vtsCarouselRef.disable();
      }
      return;
    }
    if (isCurrentParamObj && isObject(value)) {
      extend(this.vtsCarouselRef.params[_key], value);
    } else {
      (this.vtsCarouselRef.params[_key] as any) = value;
    }
  }

  ngOnDestroy() {
    this._ngZone.runOutsideAngular(() => {
      this.vtsCarouselRef?.destroy(true, false);
    });
  }
}

/* eslint no-param-reassign: "off" */
import { getDocument } from 'ssr-window';
import $ from '../shared/dom.js';
import { extend, now, deleteProps } from '../shared/utils.js';
import { getSupport } from '../shared/get-support.js';
import { getDevice } from '../shared/get-device.js';
import { getBrowser } from '../shared/get-browser.js';

import Resize from './modules/resize/resize.js';
import Observer from './modules/observer/observer.js';

import eventsEmitter from './events-emitter.js';

import update from './update/index.js';
import translate from './translate/index.js';
import transition from './transition/index.js';
import slide from './slide/index.js';
import loop from './loop/index.js';
import grabCursor from './grab-cursor/index.js';
import events from './events/index.js';
import breakpoints from './breakpoints/index.js';
import classes from './classes/index.js';
import images from './images/index.js';
import checkOverflow from './check-overflow/index.js';

import defaults from './defaults.js';
import moduleExtendParams from './moduleExtendParams.js';

const prototypes = {
  eventsEmitter,
  update,
  translate,
  transition,
  slide,
  loop,
  grabCursor,
  events,
  breakpoints,
  checkOverflow,
  classes,
  images,
};

const extendedDefaults = {};

class VtsCarousel {
  isHorizontal() {
    throw new Error('Method not implemented.');
  }
  updateSlides() {
    throw new Error('Method not implemented.');
  }
  updateProgress() {
    throw new Error('Method not implemented.');
  }
  updateSlidesClasses() {
    throw new Error('Method not implemented.');
  }
  setBreakpoint() {
    throw new Error('Method not implemented.');
  }
  getBreakpoint(breakpoints) {
    throw new Error('Method not implemented.');
  }
  constructor(...args) {
    let el;
    let params;
    if (
      args.length === 1 &&
      args[0].constructor &&
      Object.prototype.toString.call(args[0]).slice(8, -1) === 'Object'
    ) {
      params = args[0];
    } else {
      [el, params] = args;
    }
    if (!params) params = {};

    params = extend({}, params);
    if (el && !params.el) params.el = el;

    if (params.el && $(params.el).length > 1) {
      const vtsCarousels = [];
      $(params.el).each((containerEl) => {
        const newParams = extend({}, params, { el: containerEl });
        vtsCarousels.push(new VtsCarousel(newParams));
      });
      // eslint-disable-next-line no-constructor-return
      return vtsCarousels;
    }

    // VtsCarousel Instance
    const vtsCarousel = this;
    vtsCarousel.__vtsCarousel = true;
    vtsCarousel.support = getSupport();
    vtsCarousel.device = getDevice({ userAgent: params.userAgent });
    vtsCarousel.browser = getBrowser();

    vtsCarousel.eventsListeners = {};
    vtsCarousel.eventsAnyListeners = [];
    vtsCarousel.modules = [...vtsCarousel.__modules__];
    if (params.modules && Array.isArray(params.modules)) {
      vtsCarousel.modules.push(...params.modules);
    }

    const allModulesParams = {};

    vtsCarousel.modules.forEach((mod) => {
      mod({
        vtsCarousel,
        extendParams: moduleExtendParams(params, allModulesParams),
        on: vtsCarousel.on.bind(vtsCarousel),
        once: vtsCarousel.once.bind(vtsCarousel),
        off: vtsCarousel.off.bind(vtsCarousel),
        emit: vtsCarousel.emit.bind(vtsCarousel),
      });
    });

    // Extend defaults with modules params
    const vtsCarouselParams = extend({}, defaults, allModulesParams);

    // Extend defaults with passed params
    vtsCarousel.params = extend({}, vtsCarouselParams, extendedDefaults, params);
    vtsCarousel.originalParams = extend({}, vtsCarousel.params);
    vtsCarousel.passedParams = extend({}, params);

    // add event listeners
    if (vtsCarousel.params && vtsCarousel.params.on) {
      Object.keys(vtsCarousel.params.on).forEach((eventName) => {
        vtsCarousel.on(eventName, vtsCarousel.params.on[eventName]);
      });
    }
    if (vtsCarousel.params && vtsCarousel.params.onAny) {
      vtsCarousel.onAny(vtsCarousel.params.onAny);
    }

    // Save Dom lib
    vtsCarousel.$ = $;

    // Extend VtsCarousel
    Object.assign(vtsCarousel, {
      enabled: vtsCarousel.params.enabled,
      el,

      // Classes
      classNames: [],

      // Slides
      slides: $(),
      slidesGrid: [],
      snapGrid: [],
      slidesSizesGrid: [],

      // isDirection
      isHorizontal() {
        return vtsCarousel.params.direction === 'horizontal';
      },
      isVertical() {
        return vtsCarousel.params.direction === 'vertical';
      },

      // Indexes
      activeIndex: 0,
      realIndex: 0,

      //
      isBeginning: true,
      isEnd: false,

      // Props
      translate: 0,
      previousTranslate: 0,
      progress: 0,
      velocity: 0,
      animating: false,

      // Locks
      allowSlideNext: vtsCarousel.params.allowSlideNext,
      allowSlidePrev: vtsCarousel.params.allowSlidePrev,

      // Touch Events
      touchEvents: (function touchEvents() {
        const touch = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
        const desktop = ['pointerdown', 'pointermove', 'pointerup'];

        vtsCarousel.touchEventsTouch = {
          start: touch[0],
          move: touch[1],
          end: touch[2],
          cancel: touch[3],
        };
        vtsCarousel.touchEventsDesktop = {
          start: desktop[0],
          move: desktop[1],
          end: desktop[2],
        };
        return vtsCarousel.support.touch || !vtsCarousel.params.simulateTouch
          ? vtsCarousel.touchEventsTouch
          : vtsCarousel.touchEventsDesktop;
      })(),
      touchEventsData: {
        isTouched: undefined,
        isMoved: undefined,
        allowTouchCallbacks: undefined,
        touchStartTime: undefined,
        isScrolling: undefined,
        currentTranslate: undefined,
        startTranslate: undefined,
        allowThresholdMove: undefined,
        // Form elements to match
        focusableElements: vtsCarousel.params.focusableElements,
        // Last click time
        lastClickTime: now(),
        clickTimeout: undefined,
        // Velocities
        velocities: [],
        allowMomentumBounce: undefined,
        isTouchEvent: undefined,
        startMoving: undefined,
      },

      // Clicks
      allowClick: true,

      // Touches
      allowTouchMove: vtsCarousel.params.allowTouchMove,

      touches: {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        diff: 0,
      },

      // Images
      imagesToLoad: [],
      imagesLoaded: 0,
    });

    vtsCarousel.emit('_vtsCarousel');

    // Init
    if (vtsCarousel.params.init) {
      vtsCarousel.init();
    }

    // Return app instance
    // eslint-disable-next-line no-constructor-return
    return vtsCarousel;
    this.virtual = undefined;
    this.loopCreate = undefined;
    this.loopDestroy = undefined;
    this.loopedSlides = undefined;
    this.lazy = undefined;
    this.controller = undefined;
    this.allowSlideNext = undefined;
    this.allowSlidePrev = undefined;
    this.currentBreakpoint = undefined;
  }

  enable() {
    const vtsCarousel = this;
    if (vtsCarousel.enabled) return;
    vtsCarousel.enabled = true;
    if (vtsCarousel.params.grabCursor) {
      vtsCarousel.setGrabCursor();
    }
    vtsCarousel.emit('enable');
  }

  disable() {
    const vtsCarousel = this;
    if (!vtsCarousel.enabled) return;
    vtsCarousel.enabled = false;
    if (vtsCarousel.params.grabCursor) {
      vtsCarousel.unsetGrabCursor();
    }
    vtsCarousel.emit('disable');
  }

  setProgress(progress, speed) {
    const vtsCarousel = this;
    progress = Math.min(Math.max(progress, 0), 1);
    const min = vtsCarousel.minTranslate();
    const max = vtsCarousel.maxTranslate();
    const current = (max - min) * progress + min;
    vtsCarousel.translateTo(current, typeof speed === 'undefined' ? 0 : speed);
    vtsCarousel.updateActiveIndex();
    vtsCarousel.updateSlidesClasses();
  }

  emitContainerClasses() {
    const vtsCarousel = this;
    if (!vtsCarousel.params._emitClasses || !vtsCarousel.el) return;
    const cls = vtsCarousel.el.className.split(' ').filter((className) => {
      return (
        className.indexOf('vtsCarousel') === 0 ||
        className.indexOf(vtsCarousel.params.containerModifierClass) === 0
      );
    });
    vtsCarousel.emit('_containerClasses', cls.join(' '));
  }

  getSlideClasses(slideEl) {
    const vtsCarousel = this;
    if (vtsCarousel.destroyed) return '';

    return slideEl.className
      .split(' ')
      .filter((className) => {
        return (
          className.indexOf('vtsCarousel-slide') === 0 ||
          className.indexOf(vtsCarousel.params.slideClass) === 0
        );
      })
      .join(' ');
  }

  emitSlidesClasses() {
    const vtsCarousel = this;
    if (!vtsCarousel.params._emitClasses || !vtsCarousel.el) return;
    const updates = [];
    vtsCarousel.slides.each((slideEl) => {
      const classNames = vtsCarousel.getSlideClasses(slideEl);
      updates.push({ slideEl, classNames });
      vtsCarousel.emit('_slideClass', slideEl, classNames);
    });
    vtsCarousel.emit('_slideClasses', updates);
  }

  slidesPerViewDynamic(view = 'current', exact = false) {
    const vtsCarousel = this;
    const { params, slides, slidesGrid, slidesSizesGrid, size: vtsCarouselSize, activeIndex } = vtsCarousel;
    let spv = 1;
    if (params.centeredSlides) {
      let slideSize = slides[activeIndex].vtsCarouselSlideSize;
      let breakLoop;
      for (let i = activeIndex + 1; i < slides.length; i += 1) {
        if (slides[i] && !breakLoop) {
          slideSize += slides[i].vtsCarouselSlideSize;
          spv += 1;
          if (slideSize > vtsCarouselSize) breakLoop = true;
        }
      }
      for (let i = activeIndex - 1; i >= 0; i -= 1) {
        if (slides[i] && !breakLoop) {
          slideSize += slides[i].vtsCarouselSlideSize;
          spv += 1;
          if (slideSize > vtsCarouselSize) breakLoop = true;
        }
      }
    } else {
      // eslint-disable-next-line
      if (view === 'current') {
        for (let i = activeIndex + 1; i < slides.length; i += 1) {
          const slideInView = exact
            ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < vtsCarouselSize
            : slidesGrid[i] - slidesGrid[activeIndex] < vtsCarouselSize;
          if (slideInView) {
            spv += 1;
          }
        }
      } else {
        // previous
        for (let i = activeIndex - 1; i >= 0; i -= 1) {
          const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < vtsCarouselSize;
          if (slideInView) {
            spv += 1;
          }
        }
      }
    }
    return spv;
  }

  update() {
    const vtsCarousel = this;
    if (!vtsCarousel || vtsCarousel.destroyed) return;
    const { snapGrid, params } = vtsCarousel;
    // Breakpoints
    if (params.breakpoints) {
      vtsCarousel.setBreakpoint();
    }
    vtsCarousel.updateSize();
    vtsCarousel.updateSlides();
    vtsCarousel.updateProgress();
    vtsCarousel.updateSlidesClasses();

    function setTranslate() {
      const translateValue = vtsCarousel.rtlTranslate ? vtsCarousel.translate * -1 : vtsCarousel.translate;
      const newTranslate = Math.min(
        Math.max(translateValue, vtsCarousel.maxTranslate()),
        vtsCarousel.minTranslate(),
      );
      vtsCarousel.setTranslate(newTranslate);
      vtsCarousel.updateActiveIndex();
      vtsCarousel.updateSlidesClasses();
    }
    let translated;
    if (vtsCarousel.params.freeMode && vtsCarousel.params.freeMode.enabled) {
      setTranslate();
      if (vtsCarousel.params.autoHeight) {
        vtsCarousel.updateAutoHeight();
      }
    } else {
      if (
        (vtsCarousel.params.slidesPerView === 'auto' || vtsCarousel.params.slidesPerView > 1) &&
        vtsCarousel.isEnd &&
        !vtsCarousel.params.centeredSlides
      ) {
        translated = vtsCarousel.slideTo(vtsCarousel.slides.length - 1, 0, false, true);
      } else {
        translated = vtsCarousel.slideTo(vtsCarousel.activeIndex, 0, false, true);
      }
      if (!translated) {
        setTranslate();
      }
    }
    if (params.watchOverflow && snapGrid !== vtsCarousel.snapGrid) {
      vtsCarousel.checkOverflow();
    }
    vtsCarousel.emit('update');
  }

  changeDirection(newDirection, needUpdate = true) {
    const vtsCarousel = this;
    const currentDirection = vtsCarousel.params.direction;
    if (!newDirection) {
      // eslint-disable-next-line
      newDirection = currentDirection === 'horizontal' ? 'vertical' : 'horizontal';
    }
    if (
      newDirection === currentDirection ||
      (newDirection !== 'horizontal' && newDirection !== 'vertical')
    ) {
      return vtsCarousel;
    }

    vtsCarousel.$el
      .removeClass(`${vtsCarousel.params.containerModifierClass}${currentDirection}`)
      .addClass(`${vtsCarousel.params.containerModifierClass}${newDirection}`);
    vtsCarousel.emitContainerClasses();

    vtsCarousel.params.direction = newDirection;

    vtsCarousel.slides.each((slideEl) => {
      if (newDirection === 'vertical') {
        slideEl.style.width = '';
      } else {
        slideEl.style.height = '';
      }
    });

    vtsCarousel.emit('changeDirection');
    if (needUpdate) vtsCarousel.update();

    return vtsCarousel;
  }

  changeLanguageDirection(direction) {
    const vtsCarousel = this;
    if ((vtsCarousel.rtl && direction === 'rtl') || (!vtsCarousel.rtl && direction === 'ltr')) return;
    vtsCarousel.rtl = direction === 'rtl';
    vtsCarousel.rtlTranslate = vtsCarousel.params.direction === 'horizontal' && vtsCarousel.rtl;
    if (vtsCarousel.rtl) {
      vtsCarousel.$el.addClass(`${vtsCarousel.params.containerModifierClass}rtl`);
      vtsCarousel.el.dir = 'rtl';
    } else {
      vtsCarousel.$el.removeClass(`${vtsCarousel.params.containerModifierClass}rtl`);
      vtsCarousel.el.dir = 'ltr';
    }
    vtsCarousel.update();
  }

  mount(el) {
    const vtsCarousel = this;
    if (vtsCarousel.mounted) return true;

    // Find el
    const $el = $(el || vtsCarousel.params.el);
    el = $el[0];

    if (!el) {
      return false;
    }

    el.vtsCarousel = vtsCarousel;

    const getWrapperSelector = () => {
      return `.${(vtsCarousel.params.wrapperClass || '').trim().split(' ').join('.')}`;
    };

    const getWrapper = () => {
      if (el && el.shadowRoot && el.shadowRoot.querySelector) {
        const res = $(el.shadowRoot.querySelector(getWrapperSelector()));
        // Children needs to return slot items
        res.children = (options) => $el.children(options);
        return res;
      }
      if (!$el.children) {
        return $($el).children(getWrapperSelector());
      }
      return $el.children(getWrapperSelector());
    };
    // Find Wrapper
    let $wrapperEl = getWrapper();
    if ($wrapperEl.length === 0 && vtsCarousel.params.createElements) {
      const document = getDocument();
      const wrapper = document.createElement('div');
      $wrapperEl = $(wrapper);
      wrapper.className = vtsCarousel.params.wrapperClass;
      $el.append(wrapper);
      $el.children(`.${vtsCarousel.params.slideClass}`).each((slideEl) => {
        $wrapperEl.append(slideEl);
      });
    }

    Object.assign(vtsCarousel, {
      $el,
      el,
      $wrapperEl,
      wrapperEl: $wrapperEl[0],
      mounted: true,

      // RTL
      rtl: el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl',
      rtlTranslate:
        vtsCarousel.params.direction === 'horizontal' &&
        (el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl'),
      wrongRTL: $wrapperEl.css('display') === '-webkit-box',
    });

    return true;
  }

  init(el) {
    const vtsCarousel = this;
    if (vtsCarousel.initialized) return vtsCarousel;

    const mounted = vtsCarousel.mount(el);
    if (mounted === false) return vtsCarousel;

    vtsCarousel.emit('beforeInit');

    // Set breakpoint
    if (vtsCarousel.params.breakpoints) {
      vtsCarousel.setBreakpoint();
    }

    // Add Classes
    vtsCarousel.addClasses();

    // Create loop
    if (vtsCarousel.params.loop) {
      vtsCarousel.loopCreate();
    }

    // Update size
    vtsCarousel.updateSize();

    // Update slides
    vtsCarousel.updateSlides();

    if (vtsCarousel.params.watchOverflow) {
      vtsCarousel.checkOverflow();
    }

    // Set Grab Cursor
    if (vtsCarousel.params.grabCursor && vtsCarousel.enabled) {
      vtsCarousel.setGrabCursor();
    }

    if (vtsCarousel.params.preloadImages) {
      vtsCarousel.preloadImages();
    }

    // Slide To Initial Slide
    if (vtsCarousel.params.loop) {
      vtsCarousel.slideTo(
        vtsCarousel.params.initialSlide + vtsCarousel.loopedSlides,
        0,
        vtsCarousel.params.runCallbacksOnInit,
        false,
        true,
      );
    } else {
      vtsCarousel.slideTo(vtsCarousel.params.initialSlide, 0, vtsCarousel.params.runCallbacksOnInit, false, true);
    }

    // Attach events
    vtsCarousel.attachEvents();

    // Init Flag
    vtsCarousel.initialized = true;

    // Emit
    vtsCarousel.emit('init');
    vtsCarousel.emit('afterInit');

    return vtsCarousel;
  }

  destroy(deleteInstance = true, cleanStyles = true) {
    const vtsCarousel = this;
    const { params, $el, $wrapperEl, slides } = vtsCarousel;

    if (typeof vtsCarousel.params === 'undefined' || vtsCarousel.destroyed) {
      return null;
    }

    vtsCarousel.emit('beforeDestroy');

    // Init Flag
    vtsCarousel.initialized = false;

    // Detach events
    vtsCarousel.detachEvents();

    // Destroy loop
    if (params.loop) {
      vtsCarousel.loopDestroy();
    }

    // Cleanup styles
    if (cleanStyles) {
      vtsCarousel.removeClasses();
      $el.removeAttr('style');
      $wrapperEl.removeAttr('style');
      if (slides && slides.length) {
        slides
          .removeClass(
            [
              params.slideVisibleClass,
              params.slideActiveClass,
              params.slideNextClass,
              params.slidePrevClass,
            ].join(' '),
          )
          .removeAttr('style')
          .removeAttr('data-vtsCarousel-slide-index');
      }
    }

    vtsCarousel.emit('destroy');

    // Detach emitter events
    Object.keys(vtsCarousel.eventsListeners).forEach((eventName) => {
      vtsCarousel.off(eventName);
    });

    if (deleteInstance !== false) {
      vtsCarousel.$el[0].vtsCarousel = null;
      deleteProps(vtsCarousel);
    }
    vtsCarousel.destroyed = true;

    return null;
  }

  static extendDefaults(newDefaults) {
    extend(extendedDefaults, newDefaults);
  }

  static get extendedDefaults() {
    return extendedDefaults;
  }

  static get defaults() {
    return defaults;
  }

  static installModule(mod) {
    if (!VtsCarousel.prototype.__modules__) VtsCarousel.prototype.__modules__ = [];
    const modules = VtsCarousel.prototype.__modules__;

    if (typeof mod === 'function' && modules.indexOf(mod) < 0) {
      modules.push(mod);
    }
  }

  static use(module) {
    if (Array.isArray(module)) {
      module.forEach((m) => VtsCarousel.installModule(m));
      return VtsCarousel;
    }
    VtsCarousel.installModule(module);
    return VtsCarousel;
  }
}

Object.keys(prototypes).forEach((prototypeGroup) => {
  Object.keys(prototypes[prototypeGroup]).forEach((protoMethod) => {
    VtsCarousel.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
  });
});

VtsCarousel.use([Resize, Observer]);

export default VtsCarousel;

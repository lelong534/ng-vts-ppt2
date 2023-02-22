/* eslint-disable consistent-return */
import { getWindow } from 'ssr-window';
import $ from '../../shared/dom.js';
import { now, nextTick } from '../../shared/utils.js';

export default function Mousewheel({ carousel, extendParams, on, emit }) {
  const window = getWindow();

  extendParams({
    mousewheel: {
      enabled: false,
      releaseOnEdges: false,
      invert: false,
      forceToAxis: false,
      sensitivity: 1,
      eventsTarget: 'container',
      thresholdDelta: null,
      thresholdTime: null,
    },
  });

  carousel.mousewheel = {
    enabled: false,
  };

  let timeout;
  let lastScrollTime = now();
  let lastEventBeforeSnap;
  const recentWheelEvents = [];

  function normalize(e) {
    // Reasonable defaults
    const PIXEL_STEP = 10;
    const LINE_HEIGHT = 40;
    const PAGE_HEIGHT = 800;

    let sX = 0;
    let sY = 0; // spinX, spinY
    let pX = 0;
    let pY = 0; // pixelX, pixelY

    // Legacy
    if ('detail' in e) {
      sY = e.detail;
    }
    if ('wheelDelta' in e) {
      sY = -e.wheelDelta / 120;
    }
    if ('wheelDeltaY' in e) {
      sY = -e.wheelDeltaY / 120;
    }
    if ('wheelDeltaX' in e) {
      sX = -e.wheelDeltaX / 120;
    }

    // side scrolling on FF with DOMMouseScroll
    if ('axis' in e && e.axis === e.HORIZONTAL_AXIS) {
      sX = sY;
      sY = 0;
    }

    pX = sX * PIXEL_STEP;
    pY = sY * PIXEL_STEP;

    if ('deltaY' in e) {
      pY = e.deltaY;
    }
    if ('deltaX' in e) {
      pX = e.deltaX;
    }

    if (e.shiftKey && !pX) {
      // if user scrolls with shift he wants horizontal scroll
      pX = pY;
      pY = 0;
    }

    if ((pX || pY) && e.deltaMode) {
      if (e.deltaMode === 1) {
        // delta in LINE units
        pX *= LINE_HEIGHT;
        pY *= LINE_HEIGHT;
      } else {
        // delta in PAGE units
        pX *= PAGE_HEIGHT;
        pY *= PAGE_HEIGHT;
      }
    }

    // Fall-back if spin cannot be determined
    if (pX && !sX) {
      sX = pX < 1 ? -1 : 1;
    }
    if (pY && !sY) {
      sY = pY < 1 ? -1 : 1;
    }

    return {
      spinX: sX,
      spinY: sY,
      pixelX: pX,
      pixelY: pY,
    };
  }
  function handleMouseEnter() {
    if (!carousel.enabled) return;
    carousel.mouseEntered = true;
  }
  function handleMouseLeave() {
    if (!carousel.enabled) return;
    carousel.mouseEntered = false;
  }
  function animateSlider(newEvent) {
    if (
      carousel.params.mousewheel.thresholdDelta &&
      newEvent.delta < carousel.params.mousewheel.thresholdDelta
    ) {
      // Prevent if delta of wheel scroll delta is below configured threshold
      return false;
    }

    if (
      carousel.params.mousewheel.thresholdTime &&
      now() - lastScrollTime < carousel.params.mousewheel.thresholdTime
    ) {
      // Prevent if time between scrolls is below configured threshold
      return false;
    }

    // If the movement is NOT big enough and
    // if the last time the user scrolled was too close to the current one (avoid continuously triggering the slider):
    //   Don't go any further (avoid insignificant scroll movement).
    if (newEvent.delta >= 6 && now() - lastScrollTime < 60) {
      // Return false as a default
      return true;
    }
    // If user is scrolling towards the end:
    //   If the slider hasn't hit the latest slide or
    //   if the slider is a loop and
    //   if the slider isn't moving right now:
    //     Go to next slide and
    //     emit a scroll event.
    // Else (the user is scrolling towards the beginning) and
    // if the slider hasn't hit the first slide or
    // if the slider is a loop and
    // if the slider isn't moving right now:
    //   Go to prev slide and
    //   emit a scroll event.
    if (newEvent.direction < 0) {
      if ((!carousel.isEnd || carousel.params.loop) && !carousel.animating) {
        carousel.slideNext();
        emit('scroll', newEvent.raw);
      }
    } else if ((!carousel.isBeginning || carousel.params.loop) && !carousel.animating) {
      carousel.slidePrev();
      emit('scroll', newEvent.raw);
    }
    // If you got here is because an animation has been triggered so store the current time
    lastScrollTime = new window.Date().getTime();
    // Return false as a default
    return false;
  }
  function releaseScroll(newEvent) {
    const params = carousel.params.mousewheel;
    if (newEvent.direction < 0) {
      if (carousel.isEnd && !carousel.params.loop && params.releaseOnEdges) {
        // Return true to animate scroll on edges
        return true;
      }
    } else if (carousel.isBeginning && !carousel.params.loop && params.releaseOnEdges) {
      // Return true to animate scroll on edges
      return true;
    }
    return false;
  }
  function handle(event) {
    let e = event;
    let disableParentcarousel = true;
    if (!carousel.enabled) return;
    const params = carousel.params.mousewheel;

    if (carousel.params.cssMode) {
      e.preventDefault();
    }

    let target = carousel.$el;
    if (carousel.params.mousewheel.eventsTarget !== 'container') {
      target = $(carousel.params.mousewheel.eventsTarget);
    }
    if (!carousel.mouseEntered && !target[0].contains(e.target) && !params.releaseOnEdges)
      return true;

    if (e.originalEvent) e = e.originalEvent; // jquery fix
    let delta = 0;
    const rtlFactor = carousel.rtlTranslate ? -1 : 1;

    const data = normalize(e);

    if (params.forceToAxis) {
      if (carousel.isHorizontal()) {
        if (Math.abs(data.pixelX) > Math.abs(data.pixelY)) delta = -data.pixelX * rtlFactor;
        else return true;
      } else if (Math.abs(data.pixelY) > Math.abs(data.pixelX)) delta = -data.pixelY;
      else return true;
    } else {
      delta =
        Math.abs(data.pixelX) > Math.abs(data.pixelY) ? -data.pixelX * rtlFactor : -data.pixelY;
    }

    if (delta === 0) return true;

    if (params.invert) delta = -delta;

    // Get the scroll positions
    let positions = carousel.getTranslate() + delta * params.sensitivity;

    if (positions >= carousel.minTranslate()) positions = carousel.minTranslate();
    if (positions <= carousel.maxTranslate()) positions = carousel.maxTranslate();

    // When loop is true:
    //     the disableParentcarousel will be true.
    // When loop is false:
    //     if the scroll positions is not on edge,
    //     then the disableParentcarousel will be true.
    //     if the scroll on edge positions,
    //     then the disableParentcarousel will be false.
    disableParentcarousel = carousel.params.loop
      ? true
      : !(positions === carousel.minTranslate() || positions === carousel.maxTranslate());

    if (disableParentcarousel && carousel.params.nested) e.stopPropagation();

    if (!carousel.params.freeMode || !carousel.params.freeMode.enabled) {
      // Register the new event in a variable which stores the relevant data
      const newEvent = {
        time: now(),
        delta: Math.abs(delta),
        direction: Math.sign(delta),
        raw: event,
      };

      // Keep the most recent events
      if (recentWheelEvents.length >= 2) {
        recentWheelEvents.shift(); // only store the last N events
      }
      const prevEvent = recentWheelEvents.length
        ? recentWheelEvents[recentWheelEvents.length - 1]
        : undefined;
      recentWheelEvents.push(newEvent);

      // If there is at least one previous recorded event:
      //   If direction has changed or
      //   if the scroll is quicker than the previous one:
      //     Animate the slider.
      // Else (this is the first time the wheel is moved):
      //     Animate the slider.
      if (prevEvent) {
        if (
          newEvent.direction !== prevEvent.direction ||
          newEvent.delta > prevEvent.delta ||
          newEvent.time > prevEvent.time + 150
        ) {
          animateSlider(newEvent);
        }
      } else {
        animateSlider(newEvent);
      }

      // If it's time to release the scroll:
      //   Return now so you don't hit the preventDefault.
      if (releaseScroll(newEvent)) {
        return true;
      }
    } else {
      // Freemode or scrollContainer:

      // If we recently snapped after a momentum scroll, then ignore wheel events
      // to give time for the deceleration to finish. Stop ignoring after 500 msecs
      // or if it's a new scroll (larger delta or inverse sign as last event before
      // an end-of-momentum snap).
      const newEvent = {
        time: now(),
        delta: Math.abs(delta),
        direction: Math.sign(delta),
      };
      const ignoreWheelEvents =
        lastEventBeforeSnap &&
        newEvent.time < lastEventBeforeSnap.time + 500 &&
        newEvent.delta <= lastEventBeforeSnap.delta &&
        newEvent.direction === lastEventBeforeSnap.direction;
      if (!ignoreWheelEvents) {
        lastEventBeforeSnap = undefined;

        if (carousel.params.loop) {
          carousel.loopFix();
        }
        let position = carousel.getTranslate() + delta * params.sensitivity;
        const wasBeginning = carousel.isBeginning;
        const wasEnd = carousel.isEnd;

        if (position >= carousel.minTranslate()) position = carousel.minTranslate();
        if (position <= carousel.maxTranslate()) position = carousel.maxTranslate();

        carousel.setTransition(0);
        carousel.setTranslate(position);
        carousel.updateProgress();
        carousel.updateActiveIndex();
        carousel.updateSlidesClasses();

        if ((!wasBeginning && carousel.isBeginning) || (!wasEnd && carousel.isEnd)) {
          carousel.updateSlidesClasses();
        }

        if (carousel.params.freeMode.sticky) {
          // When wheel scrolling starts with sticky (aka snap) enabled, then detect
          // the end of a momentum scroll by storing recent (N=15?) wheel events.
          // 1. do all N events have decreasing or same (absolute value) delta?
          // 2. did all N events arrive in the last M (M=500?) msecs?
          // 3. does the earliest event have an (absolute value) delta that's
          //    at least P (P=1?) larger than the most recent event's delta?
          // 4. does the latest event have a delta that's smaller than Q (Q=6?) pixels?
          // If 1-4 are "yes" then we're near the end of a momentum scroll deceleration.
          // Snap immediately and ignore remaining wheel events in this scroll.
          // See comment above for "remaining wheel events in this scroll" determination.
          // If 1-4 aren't satisfied, then wait to snap until 500ms after the last event.
          clearTimeout(timeout);
          timeout = undefined;
          if (recentWheelEvents.length >= 15) {
            recentWheelEvents.shift(); // only store the last N events
          }
          const prevEvent = recentWheelEvents.length
            ? recentWheelEvents[recentWheelEvents.length - 1]
            : undefined;
          const firstEvent = recentWheelEvents[0];
          recentWheelEvents.push(newEvent);
          if (
            prevEvent &&
            (newEvent.delta > prevEvent.delta || newEvent.direction !== prevEvent.direction)
          ) {
            // Increasing or reverse-sign delta means the user started scrolling again. Clear the wheel event log.
            recentWheelEvents.splice(0);
          } else if (
            recentWheelEvents.length >= 15 &&
            newEvent.time - firstEvent.time < 500 &&
            firstEvent.delta - newEvent.delta >= 1 &&
            newEvent.delta <= 6
          ) {
            // We're at the end of the deceleration of a momentum scroll, so there's no need
            // to wait for more events. Snap ASAP on the next tick.
            // Also, because there's some remaining momentum we'll bias the snap in the
            // direction of the ongoing scroll because it's better UX for the scroll to snap
            // in the same direction as the scroll instead of reversing to snap.  Therefore,
            // if it's already scrolled more than 20% in the current direction, keep going.
            const snapToThreshold = delta > 0 ? 0.8 : 0.2;
            lastEventBeforeSnap = newEvent;
            recentWheelEvents.splice(0);
            timeout = nextTick(() => {
              carousel.slideToClosest(carousel.params.speed, true, undefined, snapToThreshold);
            }, 0); // no delay; move on next tick
          }
          if (!timeout) {
            // if we get here, then we haven't detected the end of a momentum scroll, so
            // we'll consider a scroll "complete" when there haven't been any wheel events
            // for 500ms.
            timeout = nextTick(() => {
              const snapToThreshold = 0.5;
              lastEventBeforeSnap = newEvent;
              recentWheelEvents.splice(0);
              carousel.slideToClosest(carousel.params.speed, true, undefined, snapToThreshold);
            }, 500);
          }
        }

        // Emit event
        if (!ignoreWheelEvents) emit('scroll', e);

        // Stop autoplay
        if (carousel.params.vtsAutoplay && carousel.params.autoplayDisableOnInteraction)
          carousel.vtsAutoplay.stop();
        // Return page scroll on edge positions
        if (position === carousel.minTranslate() || position === carousel.maxTranslate()) return true;
      }
    }

    if (e.preventDefault) e.preventDefault();
    else e.returnValue = false;
    return false;
  }

  function events(method) {
    let target = carousel.$el;
    if (carousel.params.mousewheel.eventsTarget !== 'container') {
      target = $(carousel.params.mousewheel.eventsTarget);
    }
    target[method]('mouseenter', handleMouseEnter);
    target[method]('mouseleave', handleMouseLeave);
    target[method]('wheel', handle);
  }

  function enable() {
    if (carousel.params.cssMode) {
      carousel.wrapperEl.removeEventListener('wheel', handle);
      return true;
    }
    if (carousel.mousewheel.enabled) return false;
    events('on');
    carousel.mousewheel.enabled = true;
    return true;
  }
  function disable() {
    if (carousel.params.cssMode) {
      carousel.wrapperEl.addEventListener(event, handle);
      return true;
    }
    if (!carousel.mousewheel.enabled) return false;
    events('off');
    carousel.mousewheel.enabled = false;
    return true;
  }

  on('init', () => {
    if (!carousel.params.mousewheel.enabled && carousel.params.cssMode) {
      disable();
    }
    if (carousel.params.mousewheel.enabled) enable();
  });
  on('destroy', () => {
    if (carousel.params.cssMode) {
      enable();
    }
    if (carousel.mousewheel.enabled) disable();
  });

  Object.assign(carousel.mousewheel, {
    enable,
    disable,
  });
}

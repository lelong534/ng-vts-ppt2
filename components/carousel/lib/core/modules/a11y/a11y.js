import classesToSelector from '../../shared/classes-to-selector.js';
import $ from '../../shared/dom.js';

export default function A11y({ carousel, extendParams, on }) {
  extendParams({
    a11y: {
      enabled: true,
      notificationClass: 'carousel-notification',
      prevSlideMessage: 'Previous slide',
      nextSlideMessage: 'Next slide',
      firstSlideMessage: 'This is the first slide',
      lastSlideMessage: 'This is the last slide',
      paginationBulletMessage: 'Go to slide {{index}}',
      slideLabelMessage: '{{index}} / {{slidesLength}}',
      containerMessage: null,
      containerRoleDescriptionMessage: null,
      itemRoleDescriptionMessage: null,
      slideRole: 'group',
      id: null,
    },
  });

  carousel.a11y = {
    clicked: false,
  };

  let liveRegion = null;

  function notify(message) {
    const notification = liveRegion;
    if (notification.length === 0) return;
    notification.html('');
    notification.html(message);
  }

  function getRandomNumber(size = 16) {
    const randomChar = () => Math.round(16 * Math.random()).toString(16);
    return 'x'.repeat(size).replace(/x/g, randomChar);
  }
  function makeElFocusable($el) {
    $el.attr('tabIndex', '0');
  }
  function makeElNotFocusable($el) {
    $el.attr('tabIndex', '-1');
  }
  function addElRole($el, role) {
    $el.attr('role', role);
  }
  function addElRoleDescription($el, description) {
    $el.attr('aria-roledescription', description);
  }
  function addElControls($el, controls) {
    $el.attr('aria-controls', controls);
  }
  function addElLabel($el, label) {
    $el.attr('aria-label', label);
  }
  function addElId($el, id) {
    $el.attr('id', id);
  }
  function addElLive($el, live) {
    $el.attr('aria-live', live);
  }
  function disableEl($el) {
    $el.attr('aria-disabled', true);
  }
  function enableEl($el) {
    $el.attr('aria-disabled', false);
  }

  function onEnterOrSpaceKey(e) {
    if (e.keyCode !== 13 && e.keyCode !== 32) return;
    const params = carousel.params.a11y;
    const $targetEl = $(e.target);
    if (carousel.vtsNavigation && carousel.vtsNavigation.$nextEl && $targetEl.is(carousel.vtsNavigation.$nextEl)) {
      if (!(carousel.isEnd && !carousel.params.vtsLoop)) {
        carousel.slideNext();
      }
      if (carousel.isEnd) {
        notify(params.lastSlideMessage);
      } else {
        notify(params.nextSlideMessage);
      }
    }
    if (carousel.vtsNavigation && carousel.vtsNavigation.$prevEl && $targetEl.is(carousel.vtsNavigation.$prevEl)) {
      if (!(carousel.isBeginning && !carousel.params.vtsLoop)) {
        carousel.slidePrev();
      }
      if (carousel.isBeginning) {
        notify(params.firstSlideMessage);
      } else {
        notify(params.prevSlideMessage);
      }
    }

    if (
      carousel.vtsPagination &&
      $targetEl.is(classesToSelector(carousel.params.vtsPagination.bulletClass))
    ) {
      $targetEl[0].click();
    }
  }

  function updateNavigation() {
    if (carousel.params.vtsLoop || carousel.params.rewind || !carousel.vtsNavigation) return;
    const { $nextEl, $prevEl } = carousel.vtsNavigation;

    if ($prevEl && $prevEl.length > 0) {
      if (carousel.isBeginning) {
        disableEl($prevEl);
        makeElNotFocusable($prevEl);
      } else {
        enableEl($prevEl);
        makeElFocusable($prevEl);
      }
    }
    if ($nextEl && $nextEl.length > 0) {
      if (carousel.isEnd) {
        disableEl($nextEl);
        makeElNotFocusable($nextEl);
      } else {
        enableEl($nextEl);
        makeElFocusable($nextEl);
      }
    }
  }

  function hasPagination() {
    return carousel.vtsPagination && carousel.vtsPagination.bullets && carousel.vtsPagination.bullets.length;
  }

  function hasClickablePagination() {
    return hasPagination() && carousel.params.vtsPagination.clickable;
  }

  function updatePagination() {
    const params = carousel.params.a11y;
    if (!hasPagination()) return;
    carousel.vtsPagination.bullets.each((bulletEl) => {
      const $bulletEl = $(bulletEl);
      if (carousel.params.vtsPagination.clickable) {
        makeElFocusable($bulletEl);
        if (!carousel.params.vtsPagination.renderBullet) {
          addElRole($bulletEl, 'button');
          addElLabel(
            $bulletEl,
            params.paginationBulletMessage.replace(/\{\{index\}\}/, $bulletEl.index() + 1),
          );
        }
      }
      if ($bulletEl.is(`.${carousel.params.vtsPagination.bulletActiveClass}`)) {
        $bulletEl.attr('aria-current', 'true');
      } else {
        $bulletEl.removeAttr('aria-current');
      }
    });
  }

  const initNavEl = ($el, wrapperId, message) => {
    makeElFocusable($el);
    if ($el[0].tagName !== 'BUTTON') {
      addElRole($el, 'button');
      $el.on('keydown', onEnterOrSpaceKey);
    }
    addElLabel($el, message);
    addElControls($el, wrapperId);
  };
  const handlePointerDown = () => {
    carousel.a11y.clicked = true;
  };
  const handlePointerUp = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!carousel.destroyed) {
          carousel.a11y.clicked = false;
        }
      });
    });
  };

  const handleFocus = (e) => {
    if (carousel.a11y.clicked) return;
    const slideEl = e.target.closest(`.${carousel.params.vtsSlideClass}`);
    if (!slideEl || !carousel.slides.includes(slideEl)) return;
    const isActive = carousel.slides.indexOf(slideEl) === carousel.activeIndex;
    const isVisible =
      carousel.params.watchSlidesProgress &&
      carousel.visibleSlides &&
      carousel.visibleSlides.includes(slideEl);
    if (isActive || isVisible) return;
    if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) return;
    if (carousel.isHorizontal()) {
      carousel.el.scrollLeft = 0;
    } else {
      carousel.el.scrollTop = 0;
    }
    carousel.slideTo(carousel.slides.indexOf(slideEl), 0);
  };

  const initSlides = () => {
    const params = carousel.params.a11y;
    if (params.itemRoleDescriptionMessage) {
      addElRoleDescription($(carousel.slides), params.itemRoleDescriptionMessage);
    }
    if (params.slideRole) {
      addElRole($(carousel.slides), params.slideRole);
    }

    const slidesLength = carousel.params.vtsLoop
      ? carousel.slides.filter((el) => !el.classList.contains(carousel.params.vtsSlideDuplicateClass))
          .length
      : carousel.slides.length;
    if (params.slideLabelMessage) {
      carousel.slides.each((slideEl, index) => {
        const $slideEl = $(slideEl);
        const slideIndex = carousel.params.vtsLoop
          ? parseInt($slideEl.attr('data-carousel-slide-index'), 10)
          : index;
        const ariaLabelMessage = params.slideLabelMessage
          .replace(/\{\{index\}\}/, slideIndex + 1)
          .replace(/\{\{slidesLength\}\}/, slidesLength);
        addElLabel($slideEl, ariaLabelMessage);
      });
    }
  };

  const init = () => {
    const params = carousel.params.a11y;

    carousel.$el.append(liveRegion);

    // Container
    const $containerEl = carousel.$el;
    if (params.containerRoleDescriptionMessage) {
      addElRoleDescription($containerEl, params.containerRoleDescriptionMessage);
    }
    if (params.containerMessage) {
      addElLabel($containerEl, params.containerMessage);
    }

    // Wrapper
    const $wrapperEl = carousel.$wrapperEl;
    const wrapperId = params.id || $wrapperEl.attr('id') || `carousel-wrapper-${getRandomNumber(16)}`;
    const live = carousel.params.vtsAutoplay && carousel.params.vtsAutoplay.enabled ? 'off' : 'polite';
    addElId($wrapperEl, wrapperId);
    addElLive($wrapperEl, live);

    // Slide
    initSlides();

    // Navigation
    let $nextEl;
    let $prevEl;
    if (carousel.vtsNavigation && carousel.vtsNavigation.$nextEl) {
      $nextEl = carousel.vtsNavigation.$nextEl;
    }
    if (carousel.vtsNavigation && carousel.vtsNavigation.$prevEl) {
      $prevEl = carousel.vtsNavigation.$prevEl;
    }

    if ($nextEl && $nextEl.length) {
      initNavEl($nextEl, wrapperId, params.nextSlideMessage);
    }
    if ($prevEl && $prevEl.length) {
      initNavEl($prevEl, wrapperId, params.prevSlideMessage);
    }

    // Pagination
    if (hasClickablePagination()) {
      carousel.vtsPagination.$el.on(
        'keydown',
        classesToSelector(carousel.params.vtsPagination.bulletClass),
        onEnterOrSpaceKey,
      );
    }

    // Tab focus
    carousel.$el.on('focus', handleFocus, true);
    carousel.$el.on('pointerdown', handlePointerDown, true);
    carousel.$el.on('pointerup', handlePointerUp, true);
  };
  function destroy() {
    if (liveRegion && liveRegion.length > 0) liveRegion.remove();

    let $nextEl;
    let $prevEl;
    if (carousel.vtsNavigation && carousel.vtsNavigation.$nextEl) {
      $nextEl = carousel.vtsNavigation.$nextEl;
    }
    if (carousel.vtsNavigation && carousel.vtsNavigation.$prevEl) {
      $prevEl = carousel.vtsNavigation.$prevEl;
    }
    if ($nextEl) {
      $nextEl.off('keydown', onEnterOrSpaceKey);
    }
    if ($prevEl) {
      $prevEl.off('keydown', onEnterOrSpaceKey);
    }

    // Pagination
    if (hasClickablePagination()) {
      carousel.vtsPagination.$el.off(
        'keydown',
        classesToSelector(carousel.params.vtsPagination.bulletClass),
        onEnterOrSpaceKey,
      );
    }

    // Tab focus
    carousel.$el.off('focus', handleFocus, true);
    carousel.$el.off('pointerdown', handlePointerDown, true);
    carousel.$el.off('pointerup', handlePointerUp, true);
  }

  on('beforeInit', () => {
    liveRegion = $(
      `<span class="${carousel.params.a11y.notificationClass}" aria-live="assertive" aria-atomic="true"></span>`,
    );
  });

  on('afterInit', () => {
    if (!carousel.params.a11y.enabled) return;
    init();
  });
  on('slidesLengthChange snapGridLengthChange slidesGridLengthChange', () => {
    if (!carousel.params.a11y.enabled) return;
    initSlides();
  });
  on('fromEdge toEdge afterInit lock unlock', () => {
    if (!carousel.params.a11y.enabled) return;
    updateNavigation();
  });
  on('paginationUpdate', () => {
    if (!carousel.params.a11y.enabled) return;
    updatePagination();
  });
  on('destroy', () => {
    if (!carousel.params.a11y.enabled) return;
    destroy();
  });
}

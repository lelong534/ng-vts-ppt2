import { getWindow } from 'ssr-window';

export default function Resize({ vtsCarousel, on, emit }) {
  const window = getWindow();
  let observer = null;
  let animationFrame = null;

  const resizeHandler = () => {
    if (!vtsCarousel || vtsCarousel.destroyed || !vtsCarousel.initialized) return;
    emit('beforeResize');
    emit('resize');
  };

  const createObserver = () => {
    if (!vtsCarousel || vtsCarousel.destroyed || !vtsCarousel.initialized) return;
    observer = new ResizeObserver((entries) => {
      animationFrame = window.requestAnimationFrame(() => {
        const { width, height } = vtsCarousel;
        let newWidth = width;
        let newHeight = height;
        entries.forEach(({ contentBoxSize, contentRect, target }) => {
          if (target && target !== vtsCarousel.el) return;
          newWidth = contentRect
            ? contentRect.width
            : (contentBoxSize[0] || contentBoxSize).inlineSize;
          newHeight = contentRect
            ? contentRect.height
            : (contentBoxSize[0] || contentBoxSize).blockSize;
        });
        if (newWidth !== width || newHeight !== height) {
          resizeHandler();
        }
      });
    });
    observer.observe(vtsCarousel.el);
  };

  const removeObserver = () => {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
    }
    if (observer && observer.unobserve && vtsCarousel.el) {
      observer.unobserve(vtsCarousel.el);
      observer = null;
    }
  };

  const orientationChangeHandler = () => {
    if (!vtsCarousel || vtsCarousel.destroyed || !vtsCarousel.initialized) return;
    emit('orientationchange');
  };

  on('init', () => {
    if (vtsCarousel.params.resizeObserver && typeof window.ResizeObserver !== 'undefined') {
      createObserver();
      return;
    }
    window.addEventListener('resize', resizeHandler);
    window.addEventListener('orientationchange', orientationChangeHandler);
  });

  on('destroy', () => {
    removeObserver();
    window.removeEventListener('resize', resizeHandler);
    window.removeEventListener('orientationchange', orientationChangeHandler);
  });
}

export default function updateSize() {
  const vtsCarousel = this;
  let width;
  let height;
  const $el = vtsCarousel.$el;
  if (typeof vtsCarousel.params.width !== 'undefined' && vtsCarousel.params.width !== null) {
    width = vtsCarousel.params.width;
  } else {
    width = $el[0].clientWidth;
  }
  if (typeof vtsCarousel.params.height !== 'undefined' && vtsCarousel.params.height !== null) {
    height = vtsCarousel.params.height;
  } else {
    height = $el[0].clientHeight;
  }
  if ((width === 0 && vtsCarousel.isHorizontal()) || (height === 0 && vtsCarousel.isVertical())) {
    return;
  }

  // Subtract paddings
  width =
    width -
    parseInt($el.css('padding-left') || 0, 10) -
    parseInt($el.css('padding-right') || 0, 10);
  height =
    height -
    parseInt($el.css('padding-top') || 0, 10) -
    parseInt($el.css('padding-bottom') || 0, 10);

  if (Number.isNaN(width)) width = 0;
  if (Number.isNaN(height)) height = 0;

  Object.assign(vtsCarousel, {
    width,
    height,
    size: vtsCarousel.isHorizontal() ? width : height,
  });
}

export default function Grid({ carousel, extendParams }) {
  extendParams({
    grid: {
      rows: 1,
      fill: 'column',
    },
  });

  let slidesNumberEvenToRows;
  let slidesPerRow;
  let numFullColumns;

  const initSlides = (slidesLength) => {
    const { vtsSlidesPerView } = carousel.params;
    const { rows, fill } = carousel.params.grid;
    slidesPerRow = slidesNumberEvenToRows / rows;
    numFullColumns = Math.floor(slidesLength / rows);
    if (Math.floor(slidesLength / rows) === slidesLength / rows) {
      slidesNumberEvenToRows = slidesLength;
    } else {
      slidesNumberEvenToRows = Math.ceil(slidesLength / rows) * rows;
    }
    if (vtsSlidesPerView !== 'auto' && fill === 'row') {
      slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, vtsSlidesPerView * rows);
    }
  };

  const updateSlide = (i, slide, slidesLength, getDirectionLabel) => {
    const { slidesPerGroup, vtsSpaceBetween } = carousel.params;
    const { rows, fill } = carousel.params.grid;
    // Set slides order
    let newSlideOrderIndex;
    let column;
    let row;
    if (fill === 'row' && slidesPerGroup > 1) {
      const groupIndex = Math.floor(i / (slidesPerGroup * rows));
      const slideIndexInGroup = i - rows * slidesPerGroup * groupIndex;
      const columnsInGroup =
        groupIndex === 0
          ? slidesPerGroup
          : Math.min(
              Math.ceil((slidesLength - groupIndex * rows * slidesPerGroup) / rows),
              slidesPerGroup,
            );
      row = Math.floor(slideIndexInGroup / columnsInGroup);
      column = slideIndexInGroup - row * columnsInGroup + groupIndex * slidesPerGroup;

      newSlideOrderIndex = column + (row * slidesNumberEvenToRows) / rows;
      slide.css({
        '-webkit-order': newSlideOrderIndex,
        order: newSlideOrderIndex,
      });
    } else if (fill === 'column') {
      column = Math.floor(i / rows);
      row = i - column * rows;
      if (column > numFullColumns || (column === numFullColumns && row === rows - 1)) {
        row += 1;
        if (row >= rows) {
          row = 0;
          column += 1;
        }
      }
    } else {
      row = Math.floor(i / slidesPerRow);
      column = i - row * slidesPerRow;
    }
    slide.css(
      getDirectionLabel('margin-top'),
      row !== 0 ? vtsSpaceBetween && `${vtsSpaceBetween}px` : '',
    );
  };

  const updateWrapperSize = (slideSize, snapGrid, getDirectionLabel) => {
    const { vtsSpaceBetween, centeredSlides, roundLengths } = carousel.params;
    const { rows } = carousel.params.grid;
    carousel.virtualSize = (slideSize + vtsSpaceBetween) * slidesNumberEvenToRows;
    carousel.virtualSize = Math.ceil(carousel.virtualSize / rows) - vtsSpaceBetween;
    carousel.$wrapperEl.css({
      [getDirectionLabel('width')]: `${carousel.virtualSize + vtsSpaceBetween}px`,
    });
    if (centeredSlides) {
      snapGrid.splice(0, snapGrid.length);
      const newSlidesGrid = [];
      for (let i = 0; i < snapGrid.length; i += 1) {
        let slidesGridItem = snapGrid[i];
        if (roundLengths) slidesGridItem = Math.floor(slidesGridItem);
        if (snapGrid[i] < carousel.virtualSize + snapGrid[0]) newSlidesGrid.push(slidesGridItem);
      }
      snapGrid.push(...newSlidesGrid);
    }
  };

  carousel.grid = {
    initSlides,
    updateSlide,
    updateWrapperSize,
  };
}

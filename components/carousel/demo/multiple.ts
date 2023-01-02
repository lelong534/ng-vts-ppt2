import { Component } from '@angular/core';

@Component({
  selector: 'vts-demo-carousel-multiple',
  template: `
    <vts-carousel 
      vtsAutoPlay
      [vtsDots]="enableDot"
      [vtsNavigation]="navigation"  
      [vtsItems]="items"
      [vtsSlideMargin]="slideMargin"
    >
      <div vts-carousel-content *ngFor="let index of array">
        <h3>{{ index }}</h3>
      </div>
    </vts-carousel>
  `,
  styles: [
    `
      [vts-carousel-content] {
        text-align: center;
        height: 160px;
        line-height: 160px;
        background: #364d79;
        color: #fff;
        overflow: hidden;
      }

      h3 {
        color: #fff;
        margin-bottom: 0;
      }

    `
  ]
})
export class VtsDemoCarouselMultipleComponent {
  array = [1, 2, 3, 4];
  enableDot = true;
  navigation = true;
  items = 3;
  slideMargin = 30;
}

import { Component } from '@angular/core';

@Component({
  selector: 'vts-demo-carousel-basic',
  template: `
    <vts-carousel
     [slidesPerView]="slidesPerView"
     [spaceBetween]="spaceBetween"
     [navigation]="navigation"
     [pagination]="pagination"
    >
      <ng-template vtsCarouselSlide>Slide 1</ng-template>
      <ng-template vtsCarouselSlide>Slide 2</ng-template>
      <ng-template vtsCarouselSlide>Slide 3</ng-template>
      <ng-template vtsCarouselSlide>Slide 4</ng-template>
      <ng-template vtsCarouselSlide>Slide 5</ng-template>
      <ng-template vtsCarouselSlide>Slide 6</ng-template>
    </vts-carousel>
  `
})
export class VtsDemoCarouselBasicComponent {
    slidesPerView = 3;
    spaceBetween = 50;
    navigation= true;
    pagination={ clickable: true };
}

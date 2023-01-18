import { Component } from '@angular/core';

@Component({
  selector: 'vts-demo-card-image',
  template: `
    <div vts-row [vtsGutter]="[8, 8]">
      <div vts-col [vtsSpan]="8">
        <vts-card
          [vtsCardLayout]="'basic'"
          vtsCoverPosition="top"
          [vtsCover]="coverTemplate"
        >
          <vts-card-meta
            vtsTitle="Card title"
            vtsDescription="Each design is a new, unique piece of art birthed into this world, and while you have the opportunity to be creative and make your unpleasant for the reader."
          ></vts-card-meta>
          <span>Last updated 3 mins ago</span>
        </vts-card>
        <ng-template #coverTemplate>
          <img
            alt="example"
            src="https://avatars.githubusercontent.com/u/43126830"
          />
        </ng-template>
      </div>

      <div vts-col [vtsSpan]="8">
        <vts-card
          [vtsCardLayout]="'basic'"
          vtsCoverPosition="bottom"
          [vtsCover]="coverTemplate"
        >
          <vts-card-meta
            vtsTitle="Card title"
            vtsDescription="Each design is a new, unique piece of art birthed into this world, and while you have the opportunity to be creative and make your unpleasant for the reader."
          ></vts-card-meta>
          <span>Last updated 3 mins ago</span>
        </vts-card>
        <ng-template #coverTemplate>
          <img
            alt="example"
            src="https://avatars.githubusercontent.com/u/43126830"
          />
        </ng-template>
      </div>

      <div vts-col [vtsSpan]="8">
        <vts-card
          [vtsCardLayout]="'basic'"
          [vtsCover]="coverTemplate"
          [vtsCoverPosition]="'fluid'"
          [vtsActions]="[actionFooter]"
        >
          <vts-card-meta
            vtsTitle="Card title"
            vtsDescription="Each design is a new, unique piece of art birthed into this world, and while you have the opportunity to be creative and make your unpleasant for the reader."
          ></vts-card-meta>
        </vts-card>
        <ng-template #coverTemplate>
          <img
            alt="example"
            src="https://avatars.githubusercontent.com/u/43126830"
          />
        </ng-template>
        <ng-template #actionFooter>
          <div>
            <span>Last updated 3 minutes ago</span>
          </div>
        </ng-template>
      </div>
    </div>
    <div vts-row [vtsGutter]="[8, 16]">
      <div vts-col [vtsSpan]="12">
        <vts-card
          [vtsCardLayout]="'basic'"
          [vtsCover]="coverTemplate"
          [vtsCoverPosition]="'left'"
          [vtsActions]="[actionFooter]"
        >
          <vts-card-meta
            vtsTitle="Card title"
            vtsDescription="Each design is a new, unique piece of art birthed into this world, and while you have the opportunity to be creative and make your unpleasant for the reader."
          ></vts-card-meta>
        </vts-card>
        <ng-template #coverTemplate>
          <img
            alt="example"
            src="https://avatars.githubusercontent.com/u/43126830"
          />
        </ng-template>
        <ng-template #actionFooter>
          <div>
            <span>Last updated 3 minutes ago</span>
          </div>
        </ng-template>
      </div>
      <div vts-col [vtsSpan]="12">
        <vts-card
          [vtsCardLayout]="'basic'"
          [vtsCover]="coverTemplate"
          [vtsCoverPosition]="'right'"
          [vtsActions]="[actionFooter]"
        >
          <vts-card-meta
            vtsTitle="Card title"
            vtsDescription="Each design is a new, unique piece of art birthed into this world, and while you have the opportunity to be creative and make your unpleasant for the reader."
          ></vts-card-meta>
        </vts-card>
        <ng-template #coverTemplate>
          <img
            alt="example"
            src="https://avatars.githubusercontent.com/u/43126830"
          />
        </ng-template>
        <ng-template #actionFooter>
          <div>
            <span>Last updated 3 minutes ago</span>
          </div>
        </ng-template>
      </div>
    </div>
  `
})
export class VtsDemoCardImageComponent {}

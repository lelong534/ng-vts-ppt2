/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { VtsDropdownMenuComponent } from '@ui-vts/ng-vts/dropdown';

@Component({
  selector: 'vts-filter-trigger',
  exportAs: `vtsFilterTrigger`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span
      vts-dropdown
      class="vts-table-filter-trigger"
      vtsTrigger="click"
      vtsPlacement="bottomRight"
      [vtsHasBackdrop]="vtsHasBackdrop"
      [vtsClickHide]="false"
      [vtsDropdownMenu]="vtsDropdownMenu"
      [class.active]="vtsActive"
      [class.vts-table-filter-open]="vtsVisible"
      [vtsVisible]="vtsVisible"
      (vtsVisibleChange)="onVisibleChange($event)"
      (click)="onFilterClick($event)"
    >
      <ng-content></ng-content>
    </span>
  `,
  host: {
    '[class.vts-table-filter-trigger-container-open]': 'vtsVisible'
  }
})
export class VtsFilterTriggerComponent {
  @Input() vtsActive = false;
  @Input() vtsDropdownMenu!: VtsDropdownMenuComponent;
  @Input() vtsVisible = false;
  @Input() vtsHasBackdrop = false;

  @Output() readonly vtsVisibleChange = new EventEmitter<boolean>();

  onVisibleChange(visible: boolean): void {
    this.vtsVisible = visible;
    this.vtsVisibleChange.next(visible);
  }

  onFilterClick($event: MouseEvent): void {
    $event.stopPropagation();
  }

  hide(): void {
    this.vtsVisible = false;
    this.cdr.markForCheck();
  }

  show(): void {
    this.vtsVisible = true;
    this.cdr.markForCheck();
  }

  constructor(private cdr: ChangeDetectorRef, private elementRef: ElementRef) {
    // TODO: move to host after View Engine deprecation
    this.elementRef.nativeElement.classList.add('vts-table-filter-trigger-container');
  }
}

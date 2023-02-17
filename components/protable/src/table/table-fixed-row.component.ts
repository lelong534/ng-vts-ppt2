/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VtsTableStyleService } from '../table-style.service';

@Component({
  selector: 'tr[vts-table-fixed-row], tr[vtsExpand]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <td class="vts-disable-td vts-table-cell" #tdElement>
      <div
        class="vts-table-expanded-row-fixed"
        *ngIf="enableAutoMeasure$ | async; else contentTemplate"
        style="position: sticky; left: 0px; overflow: hidden;"
        [style.width.px]="hostWidth$ | async"
      >
        <ng-template [ngTemplateOutlet]="contentTemplate"></ng-template>
      </div>
    </td>
    <ng-template #contentTemplate><ng-content></ng-content></ng-template>
  `
})
export class VtsTableFixedRowComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tdElement') tdElement!: ElementRef;
  hostWidth$ = new BehaviorSubject<number | null>(null);
  enableAutoMeasure$ = new BehaviorSubject<boolean>(false);
  private destroy$ = new Subject();
  constructor(private vtsTableStyleService: VtsTableStyleService, private renderer: Renderer2) {}
  ngOnInit(): void {
    if (this.vtsTableStyleService) {
      const { enableAutoMeasure$, hostWidth$ } = this.vtsTableStyleService;
      enableAutoMeasure$.pipe(takeUntil(this.destroy$)).subscribe(this.enableAutoMeasure$);
      hostWidth$.subscribe(this.hostWidth$);
    }
  }
  ngAfterViewInit(): void {
    this.vtsTableStyleService.columnCount$.pipe(takeUntil(this.destroy$)).subscribe(count => {
      this.renderer.setAttribute(this.tdElement.nativeElement, 'colspan', `${count}`);
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

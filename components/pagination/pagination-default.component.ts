/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { VtsSafeAny } from '@ui-vts/ng-vts/core/types';
import { VtsPaginationI18nInterface } from '@ui-vts/ng-vts/i18n';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VtsPaginationItemComponent } from './pagination-item.component';
import { PaginationItemRenderContext } from './pagination.types';

@Component({
  selector: 'vts-pagination-default',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #containerTemplate>
      <li class="vts-pagination-total-text" *ngIf="showTotal">
        <ng-template
          [ngTemplateOutlet]="showTotal"
          [ngTemplateOutletContext]="{
            $implicit: total,
            range: ranges
          }"
        ></ng-template>
      </li>
      <li
        *ngFor="let page of listOfPageItem; trackBy: trackByPageItem"
        vts-pagination-item
        [locale]="locale"
        [type]="page.type"
        [index]="page.index"
        [disabled]="!!page.disabled"
        [itemRender]="itemRender"
        [active]="page.type ==='page' && pageIndex === page.index"
        (gotoIndex)="jumpPage($event)"
        (diffIndex)="jumpDiff($event)"
        [direction]="dir"
      ></li>
      <div
        vts-pagination-options
        *ngIf="showQuickJumper || showSizeChanger"
        [total]="total"
        [locale]="locale"
        [disabled]="disabled"
        [showSizeChanger]="showSizeChanger"
        [showQuickJumper]="showQuickJumper"
        [pageIndex]="pageIndex"
        [pageSize]="pageSize"
        [pageSizeOptions]="pageSizeOptions"
        (pageIndexChange)="onPageIndexChange($event)"
        (pageSizeChange)="onPageSizeChange($event)"
      ></div>
    </ng-template>
  `
})
export class VtsPaginationDefaultComponent implements OnChanges, OnDestroy, OnInit {
  @ViewChild('containerTemplate', { static: true })
  template!: TemplateRef<VtsSafeAny>;
  @Input() itemRender: TemplateRef<PaginationItemRenderContext> | null = null;
  @Input() showTotal: TemplateRef<{
    $implicit: number;
    range: [number, number];
  }> | null = null;
  @Input() disabled = false;
  @Input() locale!: VtsPaginationI18nInterface;
  @Input() showSizeChanger = false;
  @Input() showQuickJumper = false;
  @Input() showShortJump = false
  @Input() total = 0;
  @Input() pageIndex = 1;
  @Input() pageSize = 10;
  @Input() pageSizeOptions: number[] = [10, 20, 30, 40];
  @Output() readonly pageIndexChange = new EventEmitter<number>();
  @Output() readonly pageSizeChange = new EventEmitter<number>();
  ranges = [0, 0];
  listOfPageItem: Array<Partial<VtsPaginationItemComponent>> = [];

  dir: Direction = 'ltr';
  private destroy$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    @Optional() private directionality: Directionality
  ) {
    renderer.removeChild(renderer.parentNode(elementRef.nativeElement), elementRef.nativeElement);
  }
  ngOnInit(): void {
    this.directionality.change?.pipe(takeUntil(this.destroy$)).subscribe((direction: Direction) => {
      this.dir = direction;
      this.updateRtlStyle();
      this.cdr.detectChanges();
    });
    this.dir = this.directionality.value;
    this.updateRtlStyle();
  }

  private updateRtlStyle(): void {
    if (this.dir === 'rtl') {
      this.renderer.addClass(this.elementRef.nativeElement, 'vts-pagination-rtl');
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, 'vts-pagination-rtl');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  jumpPage(index: number): void {
    this.onPageIndexChange(index);
  }

  jumpDiff(diff: number): void {
    this.jumpPage(this.pageIndex + diff);
  }

  trackByPageItem(_: number, value: Partial<VtsPaginationItemComponent>): string {
    return `${value.type}-${value.index}`;
  }

  onPageIndexChange(index: number): void {
    this.pageIndexChange.next(index);
  }

  onPageSizeChange(size: number): void {
    this.pageSizeChange.next(size);
  }

  getLastIndex(total: number, pageSize: number): number {
    return Math.ceil(total / pageSize);
  }

  buildIndexes(): void {
    const lastIndex = this.getLastIndex(this.total, this.pageSize);
    this.listOfPageItem = this.getListOfPageItem(this.pageIndex, lastIndex);
    if (!this.showShortJump)
      this.listOfPageItem = this.listOfPageItem.filter(i => !(i.type === 'prev_5' || i.type === 'next_5'))
  }

  getListOfPageItem(
    pageIndex: number,
    lastIndex: number
  ): Array<Partial<VtsPaginationItemComponent>> {
    const concatWithPrevNext = (listOfPage: Array<Partial<VtsPaginationItemComponent>>) => {
      const beginItem = {
        type: 'begin',
        disabled: pageIndex === 1,
        index: 1,
      };
      const prevItem = {
        type: 'prev',
        disabled: pageIndex === 1
      };
      const nextItem = {
        type: 'next',
        disabled: pageIndex === lastIndex
      };
      const lastItem = {
        type: 'last',
        disabled: pageIndex === lastIndex,
        index: this.getLastIndex(this.total, this.pageSize)
      };
      return [beginItem, prevItem, ...listOfPage, nextItem, lastItem];
    };
    const generatePage = (
      start: number,
      end: number
    ): Array<Partial<VtsPaginationItemComponent>> => {
      const list = [];
      for (let i = start; i <= end; i++) {
        list.push({
          index: i,
          type: 'page'
        });
      }
      return list;
    };
    if (lastIndex <= 9) {
      return concatWithPrevNext(generatePage(1, lastIndex));
    } else {
      const generateRangeItem = (selected: number, last: number) => {
        let listOfRange = [];
        const prevFiveItem = {
          type: 'prev_5'
        };
        const nextFiveItem = {
          type: 'next_5'
        };
        const firstPageItem = generatePage(1, 1);
        const lastPageItem = generatePage(lastIndex, lastIndex);
        if (selected < 4) {
          listOfRange = [...generatePage(2, 5), nextFiveItem];
        } else if (selected < last - 3) {
          listOfRange = [prevFiveItem, ...generatePage(selected - 2, selected + 2), nextFiveItem];
        } else {
          listOfRange = [prevFiveItem, ...generatePage(last - 4, last - 1)];
        }
        return [...firstPageItem, ...listOfRange, ...lastPageItem];
        // return [...firstPageItem, ...listOfRange, ...lastPageItem];
      };
      return concatWithPrevNext(generateRangeItem(pageIndex, lastIndex));
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { pageIndex, pageSize, total } = changes;
    if (pageIndex || pageSize || total) {
      this.ranges = [
        (this.pageIndex - 1) * this.pageSize + 1,
        Math.min(this.pageIndex * this.pageSize, this.total)
      ];
      this.buildIndexes();
    }
  }
}

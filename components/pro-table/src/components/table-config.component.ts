import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  // ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  // QueryList,
  ViewEncapsulation
} from '@angular/core';
import { VtsDrawerPlacement } from '@ui-vts/ng-vts/drawer';
import { VtsUploadChangeParam } from '@ui-vts/ng-vts/upload';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import _ from 'lodash';
import { PropertyType, Request, VtsProTablePaginationPosition } from '../pro-table.type';
import { VtsSafeAny } from '@ui-vts/ng-vts/core/types';
import { ProtableService } from '../pro-table.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'vts-table-config',
  exportAs: 'vtsProTable',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  templateUrl: './table-config.component.html',
  styles: [
    `
      .vts-protable-configuration {
        padding: 16px;
        background: #ffffff;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        margin-bottom: 16px;
      }

      .select-label {
        background: #fce5ea;
        border: 0.5px solid #cb002b;
        border-radius: 10px;
        height: 34px;
        display: flex;
        align-items: center;
      }

      .btn-area {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
      }

      .btn-table-config {
        margin-left: 8px;
      }

      .btn-control-area {
        display: flex !important;
        text-align: left;
      }

      .config-area > button {
        border: none;
      }

      td,
      th {
        border: 1px solid #d1d1d1;
      }

      .btn-properties-config {
        margin-left: 8px;
      }

      .protable-paging {
        display: flex;
        justify-content: right;
        padding-top: 16px;
      }

      .text-custom {
        font-family: 'Sarabun';
        font-style: normal;
        font-weight: 700;
        font-size: 14px;
        line-height: 18px;
        color: #CB002B;
      }
	`],
  host: {
    '[class.vts-table-config-rtl]': `dir === 'rtl'`
  }
})
export class VtsProTableConfigComponent implements OnDestroy, OnInit {
  dir: Direction = 'ltr';
  private destroy$ = new Subject<void>();

  @Input() checkedItemsAmount: number = 0;
  @Input() isVisibleModal = false;
  @Input() isOkLoadingModal = false;
  @Input() modalData = {
    title: 'Delete Popup',
    content: 'Do you want to delete all selected items?'
  };

  @Input() isVisibleDelete = false;
  @Input() isOkLoadingDelete = false;
  private itemIdToDelete: string = '';
  @Input() modalDeleteData = {
    title: 'Delete Popup',
    content: 'Do you want to delete this items?'
  };

  @Input() isVisibleUpload = false;
  @Input() uploadData = {
    url: 'http://mock.com/castlemock/mock/rest/project/lxGcaI/application/iWIW1z/',
    okText: 'Upload'
  };

  @Input() visibleDrawer = false;
  @Input() placementDrawer: VtsDrawerPlacement = 'right';
  @Input() drawerData: { [key: string]: any } = {};

  @Input() properties: PropertyType[] = [];
  @Input() listData: { [key: string]: VtsSafeAny }[] = [];
  @Input() vtsPaginationPosition: VtsProTablePaginationPosition = 'bottom';
  @Input() vtsPageSize: number = 10;
  @Input() vtsPageIndex: number = 1;
  @Input() vtsTotal: number = 0;
  @Input() editRequest: Request | undefined;
  @Input() saveRequest: Request | undefined;

  vtsRowHeight: string | number = 54;
  @Output() readonly rowHeightChanger = new EventEmitter<string>();
  @Output() readonly clearAllCheckedItems = new EventEmitter<boolean>();

  pageSize = 10;
  pageIndex = 1;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  searchTerms: any = {};
  vtsIsCollapse: boolean = true;

  listDisplayedData = [];
  displayedData: { [key: string]: any }[] = [];
  displayedProperties: PropertyType[] = [];
  filteredList = [...this.listData];

  constructor(
    private elementRef: ElementRef,
    @Optional() private directionality: Directionality,
    private service: ProtableService,
    private changeDetector: ChangeDetectorRef
  ) {
    // TODO: move to host after View Engine deprecation
    this.elementRef.nativeElement.classList.add('vts-table-config');
  }

  ngOnInit(): void {
    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntil(this.destroy$)).subscribe((direction: Direction) => {
      this.dir = direction;
    });
    this.filteredList = [...this.listData];
    this.displayedData = this.listData.slice((this.vtsPageIndex - 1) * this.vtsPageSize, this.vtsPageIndex * this.vtsPageSize);
    // this.displayedProperties = this.properties.filter(prop => prop.checked === true);
    this.vtsTotal = this.filteredList.length;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.properties) {
      // let listData: T[] = [];
      // changes.data.currentValue.forEach((d: T) => {
      // //   // let val: T = {};
      // //   // this.headers.forEach(header => {
      // //   //   val[header.propName] = d[header.propName];
      // //   // });
      // //   // listData.push(val);
      // // });
      // this.listOfData = [...listData];
      console.log(changes.properties);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  mockFn() {
    alert('Mock function!');
    this.visibleDrawer = false;
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.properties, event.previousIndex, event.currentIndex);
  }

  showDeleteModal(): void {
    this.isVisibleModal = true;
  }

  showDeleteItemModal(itemId: string): void {
    this.isVisibleDelete = true;
    this.itemIdToDelete = itemId;
  }
  showUploadModal(): void {
    this.isVisibleUpload = true;
  }

  handleOkModal(): void {
    this.isOkLoadingModal = true;
    this.checkedItemsAmount = 0;
    // this.clearAllCheckedItems.emit(this.checkedItemsAmount === 0);
    this.onAllChecked(false);
    this.isOkLoadingModal = false;
    this.isVisibleModal = false;
  }
  handleCancelModal(): void {
    this.isVisibleModal = false;
  }

  handleOkDelete(): void {
    this.isOkLoadingDelete = true;
    if (this.itemIdToDelete) {
      // _.remove(this.listDisplayedData, item => item.id == this.itemIdToDelete);
    }
    this.isOkLoadingDelete = false;
    this.isVisibleDelete = false;
  }
  handleCancelDelete(): void {
    this.isVisibleDelete = false;
  }

  handleOkUpload(): void {
    this.isVisibleUpload = false;
  }
  handleCancelUpload(): void {
    this.isVisibleUpload = false;
  }

  openDrawer(): void {
    let emptyT: { [key: string]: any } = {};
    this.properties.forEach(prop => {
      if (prop.propertyName) {
        emptyT[prop.propertyName] = null;
      }
    });
    this.drawerData = {
      ...emptyT
    };
    this.visibleDrawer = true;
  }

  closeDrawer(): void {
    this.visibleDrawer = false;
  }

  handleChangeUpload({ file }: VtsUploadChangeParam): void {
    console.log(file);
  }

  handleChangeRowHeight(value: string) {
    if (value) {
      let rowHeight: number = 0;
      switch (value) {
        case 'normal':
          rowHeight = 54;
          break;
        case 'expand':
          rowHeight = 80;
          break;
        case 'narrow':
          rowHeight = 35;
          break;
        default:
          rowHeight = 54;
          break;
      }
      this.vtsRowHeight = rowHeight;
      this.rowHeightChanger.emit(rowHeight + 'px');
    }
  }

  onAllChecked(checked: any): void {
    this.filteredList.forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
    this.checkedItemsAmount = this.setOfCheckedId.size;
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.filteredList;
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate =
      listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
    this.checkedItemsAmount = this.setOfCheckedId.size;
  }

  sortDirections = ['ascend', 'descend', null];
  sortFn = (item1: any, item2: any) => (item1.headerTitle < item2.headerTitle ? 1 : -1);

  onEditDataItem(itemId?: number | string) {
    // get data with itemID 
    if (this.editRequest) {
      let url = this.editRequest.url;
      url += itemId;
      this.service.getDataById({ ...this.editRequest, url }).subscribe(data => {
        this.drawerData = { ...data };
        this.visibleDrawer = true;
        this.changeDetector.detectChanges();
      });
    }
    this.visibleDrawer = true;
  }

  onChangePageIndex(event: number) {
    if (event) {
      this.vtsPageIndex = event;
      this.displayedData = this.listData.slice((this.vtsPageIndex - 1) * this.vtsPageSize, this.vtsPageIndex * this.vtsPageSize);
    }
  }

  reloadTableData() {
    this.vtsPageIndex = 1;
    this.displayedData = this.listData.slice((this.vtsPageIndex - 1) * this.vtsPageSize, this.vtsPageIndex * this.vtsPageSize);
  }

  exportDataToFile() {

  }

  changeStatusItem(itemId?: string | number) {
    // send request to change status to server
    if (this.editRequest) {
      let url = this.editRequest.url;
      url += itemId;
      this.service.getDataById({ ...this.editRequest, url }).subscribe(data => {
        if (data) {
          data.disabled = !data.disabled;
        };
        this.changeDetector.detectChanges();
      });
    }

    let itemData = this.listData.find(item => item.id === itemId);
    if (itemData) itemData.disabled = !itemData.disabled;
    console.log('change status OK');
  }
}

import { ButtonConfig, TabConfig } from './../pro-table.type';
import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { VtsDrawerPlacement } from '@ui-vts/ng-vts/drawer';
import { VtsUploadChangeParam } from '@ui-vts/ng-vts/upload';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import _ from 'lodash';
import { DrawerConfig, ModalDeleteConfig, ModalUploadConfig, PropertyType, Request, StatusConfig, ViewMode, VtsProTablePaginationPosition } from '../pro-table.type';
import { VtsSafeAny } from '@ui-vts/ng-vts/core/types';
import { ProtableService } from '../pro-table.service';

@Component({
  selector: 'vts-table-config',
  exportAs: 'vtsProTable',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  templateUrl: './table-config.component.html',
  styleUrls: ['./table-config.component.css'],
  host: {
    '[class.vts-protable-config-rtl]': `dir === 'rtl'`
  }
})
export class VtsProTableConfigComponent implements OnDestroy, OnInit {
  dir: Direction = 'ltr';
  private destroy$ = new Subject<void>();

  @Input() checkedItemsAmount: number = 0;
  @Input() isVisibleModal = false;
  @Input() isOkLoadingModal = false;
  @Input() isVisibleDelete: boolean = false;
  @Input() isOkLoadingDelete = false;
  private itemIdToDelete: string | number = '';
  @Input() modalDeleteConfig: ModalDeleteConfig | undefined;
  @Input() modalUploadConfig: ModalUploadConfig | undefined;
  @Input() drawerConfig: DrawerConfig | undefined;
  @Input() isVisibleUpload = false;
  @Input() visibleDrawer = false;
  @Input() placementDrawer: VtsDrawerPlacement = 'right';
  @Input() drawerData: { [key: string]: any } = {};
  @Input() properties: PropertyType[] = [];
  @Input() listData: { [key: string]: VtsSafeAny }[] = [];
  @Input() vtsPaginationPosition: VtsProTablePaginationPosition = 'bottom';
  @Input() vtsPageSize: number = 10;
  @Input() vtsPageIndex: number = 1;
  @Input() vtsTotal: number = 0;
  @Input() requestData: Request | undefined;
  @Input() getRequest: Request | undefined;
  @Input() editRequest: Request | undefined;
  @Input() deleteRequest: Request | undefined;
  @Input() saveRequest: Request | undefined;
  @Input() exportRequest: Request | undefined;
  @Input() searchRequest: Request | undefined;
  @Input() searchData: Object | VtsSafeAny;
  @Input() configTableRequest: Request | undefined;
  @Input() filterGroupConfig: { [key: string]: any }[] | undefined;
  @Input() pageSize = 10;
  @Input() listStatus: StatusConfig[] = [];
  @Input() action: { 'key': string } = {
    key: ''
  };
  @Input() tabConfig: TabConfig | undefined;
  @Input() moreActionConfig: ButtonConfig[] | undefined;

  vtsRowHeight: string = '48px';
  loading: boolean = false;
  @Output() readonly rowHeightChanger = new EventEmitter<string>();
  @Output() readonly clearAllCheckedItems = new EventEmitter<boolean>();
  @Output() reloadTable = new EventEmitter<boolean>();
  @Output() onChangeHeaders = new EventEmitter<PropertyType[]>();
  @Output() changePageSize = new EventEmitter<number>();

  pageIndex = 1;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  searchTerms: any = {};
  vtsIsCollapse: boolean = true;
  mode: ViewMode = 'view';

  listDisplayedData = [];
  displayedData: { [key: string]: any }[] = [];
  displayedProperties: PropertyType[] = [];
  filteredList = [...this.listData];

  allChecked = false;
  indeterminateConfig = true;
  visibleExport = false;

  constructor(
    private elementRef: ElementRef,
    @Optional() private directionality: Directionality,
    private service: ProtableService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.elementRef.nativeElement.classList.add('vts-table-config');
  }

  ngOnInit(): void {
    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntil(this.destroy$)).subscribe((direction: Direction) => {
      this.dir = direction;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.properties) {
      this.properties = this.properties.filter(item => item.headerTitle || item.headerTitle != null);
      this.displayedProperties = this.properties.filter(prop => prop.headerTitle);
    }

    if (changes.listData) {
      this.loading = true;      
      this.displayedData = [...this.listData];
      this.filteredList = [...this.listData]
      this.loading = false;
    }

    if (changes.action) {
      this.onClickActionButtons(this.action.key);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  showDeleteItemModal(itemId: string | number): void {
    if (this.modalDeleteConfig) {
      this.modalDeleteConfig.content = `Do you want to delete item ${itemId}?`;
      this.modalDeleteConfig.type = 'delete';
      this.isVisibleDelete = true;
      this.itemIdToDelete = itemId;
    }
  }
  showUploadModal(): void {
    this.isVisibleUpload = true;
  }

  handleOkModal(): void {
    this.isOkLoadingModal = true;
    this.checkedItemsAmount = 0;
    this.onAllChecked(false);
    this.isOkLoadingModal = false;
    this.isVisibleModal = false;
  }
  handleCancelModal(): void {
    this.isVisibleModal = false;
  }

  handleOkDelete(event: string): void {
    this.isOkLoadingDelete = true;
    switch (event) {
      case 'clear':
        this.onAllChecked(false);
        break;
      case 'delete-multiple':
        if (this.deleteRequest) {
          let url = this.deleteRequest.url;
          this.deleteRequest.body = this.setOfCheckedId;
          url += 'multiple-delete';
          let { onSuccess, onError } = this.deleteRequest;

          this.service.deleteItem({ ...this.deleteRequest, url }).subscribe(data => {
            if (onSuccess) {
              onSuccess(data);
            }
            this.visibleDrawer = true;
            this.changeDetector.detectChanges();
          }, error => {
            if (onError) {
              onError(error);
            }
          });
        }
        break;
      default:
        if (this.itemIdToDelete) {
          if (this.deleteRequest) {
            let url = this.deleteRequest.url;
            url += this.itemIdToDelete;
            let { onSuccess, onError } = this.deleteRequest;

            this.service.deleteItem({ ...this.deleteRequest, url }).subscribe(data => {
              if (onSuccess) {
                onSuccess(data);
              }
              this.visibleDrawer = true;
              this.changeDetector.detectChanges();
            }, error => {
              if (onError) {
                onError(error);
              }
            });
          }
        }
        break;
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
        switch (prop.datatype) {
          case "datetime": {
            break;
          }
          case "number": {
            emptyT[prop.propertyName] = 0;
            break;
          }
          case "status": {
            emptyT[prop.propertyName] = "default";
            break;
          }
          default: {
            emptyT[prop.propertyName] = null;
            break;
          }
        }

      }
    });
    this.drawerData = {
      ...emptyT
    };
    this.visibleDrawer = true;
    this.mode = 'create';

    // callback when open drawer
    if (typeof this.drawerConfig != "undefined") {
      let { onOpen } = this.drawerConfig;
      if (onOpen) {
        onOpen();
      }
    }
  }

  closeDrawer(): void {
    this.visibleDrawer = false;
    // callback when close drawer
    if (typeof this.drawerConfig != "undefined") {
      let { onClose } = this.drawerConfig;
      if (onClose) {
        onClose();
      }
    }
  }

  handleChangeUpload({ file }: VtsUploadChangeParam): void {
    console.log(file);
  }

  handleChangeRowHeight(value: string) {
    if (value) {
      this.vtsRowHeight = value;
    }
  }

  onAllChecked(checked: any): void {
    const enableList = this.filteredList.filter(d => (!d.disable || d.disabled == false));
    enableList.forEach(item => this.updateCheckedSet(item.id, checked));
    this.refreshCheckedStatus();
  }

  onItemChecked(id: VtsSafeAny, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: VtsSafeAny, checked: boolean, disabled?: boolean): void {
    if (checked && !disabled) {
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

  sortDirections = ['ascend', 'descend'];
  sortFn(item1: { [key: string]: VtsSafeAny }, item2: { [key: string]: VtsSafeAny }) {
    console.log(item1, item2);
    return 1;
  }


  onEditDataItem(itemId?: number | string) {
    this.mode = 'edit';
    if (this.getRequest) {
      let url = this.getRequest.url;
      url += itemId;
      let { onSuccess, onError } = this.getRequest;

      this.service.getDataById({ ...this.getRequest, url }).subscribe(data => {
        if (onSuccess) onSuccess(data);
        this.drawerData = { ...data };
        this.visibleDrawer = true;
        this.changeDetector.detectChanges();
      }, error => {
        if (onError) onError(error);
      });
    }
    // callback when open drawer
    if (typeof this.drawerConfig != "undefined") {
      let { onOpen } = this.drawerConfig;
      if (onOpen) {
        onOpen();
      }
    }
  }

  onViewDataItem(itemId?: number | string) {
    this.mode = 'view';
    if (this.getRequest) {
      let url = this.getRequest.url + itemId;
      let { onSuccess, onError } = this.getRequest;

      this.service.getDataById({ ...this.getRequest, url }).subscribe(data => {
        if (onSuccess) onSuccess(data);
        this.drawerData = { ...data };
        this.visibleDrawer = true;
        this.changeDetector.detectChanges();
      }, error => {
        if (onError) onError(error);
      });
    }
    // callback when open drawer
    if (typeof this.drawerConfig != 'undefined') {
      let { onOpen } = this.drawerConfig;
      if (onOpen) {
        onOpen();
      }
    }
  }

  onChangePageIndex(event: number) {
    if (event && this.requestData) {
      this.vtsPageIndex = event;
      this.requestData.body = {
        'pageSize': this.vtsPageSize,
        'pageIndex': this.vtsPageIndex
      };

      // only for json-server
      let url = this.requestData.url.split('?')[0] + `?_page=${event}&_limit=${this.vtsPageSize}`;
      let { onSuccess, onError } = this.requestData;

      this.service.getRenderData({ ...this.requestData, url }).subscribe(res => {
        if (onSuccess) onSuccess(res);
        this.displayedData = [...res.body];
        this.vtsTotal = +res.headers.get('X-Total-Count');
        this.changeDetector.detectChanges();
      }, error => {
        if (onError) onError(error)
      })
    }
  }

  reloadTableData() {
    this.vtsPageIndex = 1;
    this.reloadTable.emit(true);
  }

  exportDataToFile(mode?: string) {
    this.visibleExport = true;
    if (this.exportRequest) {
      let { onSuccess, onError } = this.exportRequest;
      this.exportRequest.body = mode == 'all' ? this.listData : this.setOfCheckedId;
      let url = this.exportRequest.url;
      this.service.exportSelectedDataToFile({ ...this.exportRequest, url }).subscribe(res => {
        if (onSuccess) onSuccess(res);
        this.visibleExport = false;
      }, error => {
        if (onError) onError(error);
      });
    }
  }

  formatNumber(value: number): string {
    if (value) {
      const stringValue = `${value}`;
      const list = stringValue.split('.');
      const prefix = list[0].charAt(0) === '-' ? '-' : '';
      let num = prefix ? list[0].slice(1) : list[0];
      let result = '';
      while (num.length > 3) {
        result = `,${num.slice(-3)}${result}`;
        num = num.slice(0, num.length - 3);
      }
      if (num) {
        result = num + result;
      }
      return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
    } else return '';
  }

  changeStatusItem(itemId?: string | number) {
    if (this.editRequest) {
      let url = this.editRequest.url;
      url += itemId;
      let { onSuccess, onError } = this.editRequest;

      this.service.getDataById({ ...this.editRequest, url }).subscribe(data => {
        if (onSuccess) onSuccess(data);
        if (data) {
          data.disabled = !data.disabled;
        };
        this.changeDetector.detectChanges();
      }, error => {
        if (onError) onError(error);
      });
    }

    let itemData = this.listData.find(item => item.id === itemId);
    if (itemData) itemData.disabled = !itemData.disabled;
  }

  sorted = false;
  sortValue(prop: PropertyType) {
    if (prop.datatype === 'number') {
      const sortData = this.sorted ? this.displayedData.sort((itemX, itemY) => itemY[prop.propertyName] - itemX[prop.propertyName])
        : this.displayedData.sort((itemX, itemY) => itemX[prop.propertyName] - itemY[prop.propertyName]);
      this.sorted = !this.sorted;
      this.displayedData = sortData;
    }

    if (prop.datatype === 'string') {
      const sortData = this.sorted ?
        this.displayedData.sort((itemX, itemY) => {
          const xValue = itemX[prop.propertyName].toUpperCase();
          const yValue = itemY[prop.propertyName].toUpperCase();
          if (xValue < yValue) {
            return -1;
          }
          if (xValue > yValue) {
            return 1;
          }
          return 0;
        })
        : this.displayedData.sort((itemY, itemX) => {
          const xValue = itemX[prop.propertyName].toUpperCase();
          const yValue = itemY[prop.propertyName].toUpperCase();
          if (xValue < yValue) {
            return -1;
          }
          if (xValue > yValue) {
            return 1;
          }
          return 0;
        });
      this.sorted = !this.sorted;
      this.displayedData = sortData;
    }

    this.changeDetector.detectChanges();
  }

  closeExported() {
    this.visibleExport = false;
  }

  getSelectedStatus(value: string) {
    let selectedObjStatus: StatusConfig = this.listStatus.filter(s => s.value == value)[0];
    if (selectedObjStatus) {
      return selectedObjStatus;
    }
    else return null;
  }

  onClickActionButtons(actionType: string) {
    switch (actionType) {
      case 'new':
        this.openDrawer();
        break;
      case 'import':
        this.showUploadModal();
        break;
      case 'export':
        this.exportDataToFile('all');
        break;
    }
  }

  onReloadTable(event: boolean) {
    this.reloadTable.emit(event);
  }

  clearAllSelectedItems(event: boolean) {
    if (event && this.modalDeleteConfig) {
      this.modalDeleteConfig.content = "Do you want to clear all selected items?";
      this.modalDeleteConfig.type = 'clear';
      this.isVisibleDelete = true;
    }
  }

  deleteSelectedItems(event: boolean) {
    if (event && this.modalDeleteConfig) {
      this.modalDeleteConfig.content = "Do you want to delete all selected items?";
      this.modalDeleteConfig.type = 'delete-multiple';
      this.isVisibleDelete = true;
    }
  }

  exportSelectedItems(event: boolean) {
    if (event) {
      this.exportDataToFile();
    }
  }

  onChangeTableHeaders(event: VtsSafeAny) {
    if (event) {
      this.properties = [...event];
      if (this.properties.filter(prop => prop.checked == false).length == event.length) {
        this.displayedData = [];
      } else {
        this.displayedData = this.listData;
      }
    }
  }

  onSearchingByKey(event: string | any) {
    if (this.getRequest) {
      if (typeof event =='string') {
        this.getRequest.body = {
          ...this.getRequest.body,
          'keyword': event
        };

        let url = this.getRequest.url;
        if (event) {
          url = this.getRequest.url + '?keyword=' + event;
        }
        let { onSuccess, onError } = this.getRequest;
  
        this.service.searchByKeyword({ ...this.getRequest, url }).subscribe(res => {
          if (onSuccess) onSuccess(res);
          this.displayedData = [...res.body];
          this.vtsTotal = +res.headers.get('X-Total-Count');
          this.changeDetector.detectChanges();
        }, error => {
          if (onError) onError(error);
        });
      } else {
        console.log(2, [event]);
      }
    }
  }

  onModeChanger(event: ViewMode) {
    if (event) {
      this.mode = event;
    }
  }

  onCreateAnotherData(event: boolean) {
    if (event) {
      this.openDrawer();
    }
  }

  onChangeItemStatus(event: string | number) {
    if (event) {
      this.changeStatusItem(event);
    }
  }

  onDeleteItem(event: string | number) {
    if (event && this.modalDeleteConfig) {
      this.modalDeleteConfig.content = `Do you want to delete item ${event}?`;
      this.modalDeleteConfig.type = 'delete';
      this.isVisibleDelete = true;
    }
  }
}

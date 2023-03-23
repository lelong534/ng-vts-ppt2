import { VtsButtonConfig, VtsDrawerConfig, VtsModalDeleteConfig, VtsModalUploadConfig, VtsPropertyType, VtsStatusConfig, VtsTabGroupConfig, VtsActionType, VtsProTableFixedButtons } from './pro-table.type';
import { VtsSafeAny } from '@ui-vts/ng-vts/core/types';
import {
  Component,
  SimpleChanges,
  ElementRef,
  OnInit,
  Input,
  OnChanges,
  ViewEncapsulation,
  EventEmitter,
  Output
} from '@angular/core';
import _ from 'lodash';
import { VtsButtonSize } from '@ui-vts/ng-vts/button';
import { VtsProTableRenderService } from './pro-table-render.service';

@Component({
  selector: 'vts-protable-container',
  exportAs: 'vtsProTableContainer',
  providers: [VtsProTableRenderService],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  templateUrl: './pro-table.component.html',
})
export class VtsProTableContainerComponent implements OnInit, OnChanges {
  constructor(
    public elementRef: ElementRef,
    private render: VtsProTableRenderService
  ) {
    this.elementRef.nativeElement.classList.add('vts-protable-container');
    this.render.labelRender$.next(
      {
        new: 'New',
        export: 'Export',
        import: 'Import',
        edit: 'Edit',
        delete: 'Delete',
        enabled: 'Enable / Disable',
        deleteSelected: 'Delete selected',
        clearSelected: 'Clear selected',
        clearSubtext: ' items is selected',
        exportSelected: 'Export selected',
        order: '#',
        actions: 'Action',
        moreActions: 'More actions',
        searchAll: 'Search all ...',
        close: 'Close',
        save: 'Save',
        reset: 'Reset',
        search: 'Search',
        submit: 'Submit',
        rowHeight: {
          normal: 'Normal',
          expand: 'Expand',
          narrow: 'Narrow'
        },
        displayAll: "Display all columns",
        create: 'Create',
        createAnother: 'Create and create another',
        cancel: 'Cancel',
        chooseFile: 'Choose file',
        uploadText: {
          prefix: 'Drag and drop image/video or ',
          subfix: ' for upload',
          permiss: 'Only for datatype: ',
          maxSize: ' and maximum of file volumn is not over '
        }
      }
    );
  }

  @Input() vtsTableTitle: string | undefined;
  @Input() vtsMoreActionConfig: VtsButtonConfig[] | undefined;
  @Input() vtsTabGroupConfig: VtsTabGroupConfig | undefined;
  @Input() vtsFilterGroupConfig: { [key: string]: any }[] | undefined;
  @Input() vtsLoading: boolean = false;
  @Input() vtsProperties: VtsPropertyType[] = [];
  @Input() vtsListData: { [key: string]: VtsSafeAny }[] = [];
  @Input() vtsPageIndex: number = 1;
  @Input() vtsPageSize: number = 10;
  @Input() vtsTotal: number = 0;
  @Input() vtsOnSuccess: VtsSafeAny = () => { };
  @Input() vtsOnError: VtsSafeAny = () => { };
  @Input() vtsDrawerConfig: VtsDrawerConfig | undefined;
  @Input() vtsListStatus: VtsStatusConfig[] = [];
  @Input() vtsModalDeleteConfig: VtsModalDeleteConfig | undefined;
  @Input() vtsModalUploadConfig: VtsModalUploadConfig | undefined;
  @Input() vtsFixedButtonsConfig: VtsProTableFixedButtons = {
    new: 'New',
    export: 'Export',
    import: 'Import',
    edit: 'Edit',
    delete: 'Delete',
    enabled: 'Enable / Disable',
    deleteSelected: 'Delete selected',
    clearSelected: 'Clear selected',
    clearSubtext: ' items is selected',
    exportSelected: 'Export selected',
    order: '#',
    actions: 'Action',
    moreActions: 'More actions',
    searchAll: 'Search all ...',
    close: 'Close',
    save: 'Save',
    search: 'Search',
    submit: 'Submit',
    rowHeight: {
      normal: 'Normal',
      expand: 'Expand',
      narrow: 'Narrow'
    },
    displayAll: "Display all columns",
    create: 'Create',
    createAnother: 'Create and create another',
    cancel: 'Cancel',
    chooseFile: 'Choose file',
    uploadText: {
      prefix: 'Drag and drop image/video or ',
      subfix: ' for upload',
      permiss: 'Only for datatype: ',
      maxSize: ' and maximum of file volumn is not over '
    }
  };

  @Output() vtsOnPageSizeChanger = new EventEmitter<number>();
  @Output() vtsOnPageIndexChanger = new EventEmitter<number>();
  @Output() vtsOnSuccessEvent = new EventEmitter<VtsSafeAny>();
  @Output() vtsOnErrorEvent = new EventEmitter<VtsSafeAny>();
  @Output() vtsOnActionChanger = new EventEmitter<VtsActionType>();
  @Output() vtsOnTabFilterChanger = new EventEmitter<number>();
  @Output() vtsOnSearchingByKey = new EventEmitter<string>();
  @Output() vtsOnDeleteData = new EventEmitter<Set<string | number>>();
  @Output() vtsOnSaveData = new EventEmitter<VtsSafeAny>();

  searchData: Object = {};
  buttonSize: VtsButtonSize = 'sm';
  publicProperties: VtsPropertyType[] = [];
  actionType: { 'key': string } = { key: '' };
  selectedTabIndex = 0;
  totalDataWithFilter: VtsSafeAny[] = [];
  tabConfig: VtsSafeAny;

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.vtsRequestData) {
    }

    if (changes.vtsTabGroupConfig) {
    }

    if (changes.vtsProperties) {
      this.publicProperties = changes.vtsProperties.currentValue.filter((prop: VtsPropertyType) => prop.headerTitle);
    }
  }

  onSearchingByKey(event: string) {
    if (event) {
      this.vtsOnSearchingByKey.emit(event);
    }
  }

  reloadTable(event: boolean) {
    if (event) {
      this.onClickAction('reload');
    }
  }

  onClickAction(key: VtsActionType) {
    let actionType = { 'key': key };
    this.actionType = {
      ...actionType
    }
    this.vtsOnActionChanger.emit(key);
  }

  onChangeTabFilter(event: number) {
    if (typeof this.vtsTabGroupConfig != 'undefined' && typeof this.vtsTabGroupConfig.tabValueConfig != 'undefined') {
      this.vtsPageIndex = 1;
      this.selectedTabIndex = event;
      this.tabConfig = this.vtsTabGroupConfig.tabValueConfig[event];
      this.vtsOnTabFilterChanger.emit(event);
    }
  }

  changePageIndex(event: number) {
    if (event) {
      this.vtsOnPageIndexChanger.emit(event);
    }
  }

  onDeleteData(event: Set<string | number>) {
    if (event) {
      this.vtsOnDeleteData.emit(event);
    }
  }

  onEditData(event: VtsSafeAny) {
    if (event) {
      this.vtsOnSaveData.emit(event);
    }
  }
}
import { Component, Input, OnInit } from '@angular/core';
import { VtsPropertyType, VtsProTableFixedButtons } from '../pro-table.type';

@Component({
    selector: 'table-data',
    templateUrl: 'table-data.component.html'
})

export class TableDataComponent implements OnInit {

    @Input() displayedData: { [key: string]: any }[] = [];
    @Input() properties: VtsPropertyType[] = [];
    @Input() vtsPageIndex: number = 1;
    @Input() vtsTotal: number = 0;
    @Input() vtsPageSize: number = 10;
    @Input() checked: boolean = false;
    @Input() indeterminate: boolean = false;
    @Input() labels: VtsProTableFixedButtons = {};

    sortDirections = ['ascend', 'descend'];
    setOfCheckedId = new Set<string | number>();

    constructor() { }

    ngOnInit() { }

    sortFn(item1: { [key: string]: VtsSafeAny }, item2: { [key: string]: VtsSafeAny }) {
        console.log(item1, item2);
        return 1;
    }

    onAllChecked(checked: any): void {
        const enableList = this.filteredList.filter(d => (!d.disable || d.disabled == false));
        enableList.forEach(item => this.updateCheckedSet(item.id, checked));
        this.refreshCheckedStatus();
    }

    sortValue(prop: VtsPropertyType) {
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

    onItemChecked(id: VtsSafeAny, checked: boolean): void {
        this.updateCheckedSet(id, checked);
        this.refreshCheckedStatus();
    }
}
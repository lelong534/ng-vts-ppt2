import { Component } from '@angular/core';

interface Item {
  id: string;
  content1: string;
  content2: string;
  content3: string;
  content4: string;
}

@Component({
  selector: 'vts-demo-inplace-display',
  template: `
    <h4>Image</h4>
    <div class="container">
      <h5>Normal</h5>
      <vts-inplace vtsIcon="Image">
        <div vtsInplaceDisplay >
          Show Image
        </div>
        <div vtsInplaceContent>
          <img src="http://t0.gstatic.com/licensed-image?q=tbn:ANd9GcTQKSKVyESbPlXtw51d39QIZGu3ZpL69V5zSaJLFW8jcr3_eVrEbgfD9ycB0T9h8eVT-AIkOT5HbUzaJCONvnE">
        </div>
      </vts-inplace>
      <h5>Disabled</h5>
      <vts-inplace disabled vtsIcon="Image">
        <div vtsInplaceDisplay >
          Show Image
        </div>
        <div vtsInplaceContent>
          <img src="http://t0.gstatic.com/licensed-image?q=tbn:ANd9GcTQKSKVyESbPlXtw51d39QIZGu3ZpL69V5zSaJLFW8jcr3_eVrEbgfD9ycB0T9h8eVT-AIkOT5HbUzaJCONvnE">
        </div>
      </vts-inplace>
      <h5>Actived</h5>
      <vts-inplace active vtsIcon="Image">
        <div vtsInplaceDisplay >
          Show Image
        </div>
        <div vtsInplaceContent>
          <img src="http://t0.gstatic.com/licensed-image?q=tbn:ANd9GcTQKSKVyESbPlXtw51d39QIZGu3ZpL69V5zSaJLFW8jcr3_eVrEbgfD9ycB0T9h8eVT-AIkOT5HbUzaJCONvnE">
        </div>
      </vts-inplace>
    </div>
    <h4>Table</h4>
    <div class="container">
      <h5>Normal</h5>
      <vts-inplace vtsIcon="Table">
        <div vtsInplaceDisplay>
          Show Table
        </div>
        <div vtsInplaceContent>
            <vts-table
          #basicTable
          [vtsData]="filteredList"
          [vtsPageSize]="pageSize"
          [vtsPageIndex]="pageIndex"
          vtsShowPagination
          vtsShowSizeChanger
        >
          <thead>
            <tr>
              <th
                [vtsChecked]="checked"
                [vtsIndeterminate]="indeterminate"
                (vtsCheckedChange)="onAllChecked($event)"
              ></th>
              <th vtsWidth="1%" vtsAlign="center">#</th>
              <th>Table header</th>
              <th>Table header</th>
              <th vtsAlign="center">Table header</th>
              <th [vtsSortDirections]="sortDirections" [vtsSortFn]="sortFn">Table header</th>
              <th>Table header</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>
              <td>
                <input name="filter1" ngModel (ngModelChange)="filter($event, 'content1')" vts-input />
              </td>
              <td>
                <input name="filter2" ngModel (ngModelChange)="filter($event, 'content2')" vts-input />
              </td>
              <td>
                <input name="filter3" ngModel (ngModelChange)="filter($event, 'content3')" vts-input />
              </td>
              <td>
                <input name="filter4" ngModel (ngModelChange)="filter($event, 'content4')" vts-input />
              </td>
              <td></td>
            </tr>
            <tr *ngFor="let data of basicTable.data; index as i">
              <td
                [vtsChecked]="setOfCheckedId.has(data.id)"
                (vtsCheckedChange)="onItemChecked(data.id, $event)"
              ></td>
              <td vtsAlign="center">{{ data.id }}</td>
              <td>{{ data.content1 }}</td>
              <td>{{ data.content2 }}</td>
              <td vtsAlign="center">{{ data.content3 }}</td>
              <td vtsAlign="right">{{ data.content4 }}</td>
              <td>
                <a>Delete</a>
              </td>
            </tr>
          </tbody>
        </vts-table>
        </div>
      </vts-inplace>
      <h5>Disable</h5>
      <vts-inplace disabled vtsIcon="Table">
        <div vtsInplaceDisplay>
          Show Table
        </div>
        <div vtsInplaceContent>
          <table>
            <tr>
              <th>Company</th>
              <th>Contact</th>
              <th>Country</th>
            </tr>
            <tr>
              <td>Alfreds Futterkiste</td>
              <td>Maria Anders</td>
              <td>Germany</td>
            </tr>
            <tr>
              <td>Centro comercial Moctezuma</td>
              <td>Francisco Chang</td>
              <td>Mexico</td>
            </tr>
          </table>
        </div>
      </vts-inplace>
    </div>
  `,
})
export class VtsDemoInplaceDisplayComponent {
  listOfData: Item[] = [
    ...Array.from({ length: 100 }).map((_, i) => {
      return {
        id: `${i + 1}`,
        content1: `Table row ${i + 1}`,
        content2: `Table row ${i + 1}`,
        content3: `Table row ${i + 1} (center)`,
        content4: '0.' + '5'.padStart(Math.round(Math.random() * 7), '0')
      };
    })
  ];

  filteredList = [...this.listOfData];

  pageSize = 10;
  pageIndex = 1;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();

  searchTerms: any = {};

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
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.filteredList;
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate =
      listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  filter(searchKey: string, column: string) {
    this.searchTerms[column] = searchKey;
    this.refreshFilter();
  }

  refreshFilter() {
    this.filteredList = this.listOfData.filter((item: any) => {
      return Object.keys(this.searchTerms).every(k =>
        item[k]
          .toUpperCase()
          .trim()
          .includes(this.searchTerms[k]?.toUpperCase()?.trim() || '')
      );
    });
  }

  sortDirections = ['ascend', 'descend', null];
  sortFn = (item1: any, item2: any) => (item1.content4 < item2.content4 ? 1 : -1);
}

import { VtsPopoverModule } from '@ui-vts/ng-vts/popover';
import { VtsSwitchModule } from '@ui-vts/ng-vts/switch';
import { VtsBadgeModule } from '@ui-vts/ng-vts/badge';
import { VtsInputModule } from '@ui-vts/ng-vts/input'
import { VtsDividerModule } from '@ui-vts/ng-vts/divider';
import { VtsUploadModule } from '@ui-vts/ng-vts/upload';
import { VtsSelectModule } from '@ui-vts/ng-vts/select';
import { VtsDrawerModule } from '@ui-vts/ng-vts/drawer';
import { VtsModalModule } from '@ui-vts/ng-vts/modal';
import { BidiModule } from '@angular/cdk/bidi';
import { PlatformModule } from '@angular/cdk/platform';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VtsButtonModule } from '@ui-vts/ng-vts/button';
import { VtsCheckboxModule } from '@ui-vts/ng-vts/checkbox';
import { VtsOutletModule } from '@ui-vts/ng-vts/core/outlet';
import { VtsResizeObserverModule } from '@ui-vts/ng-vts/cdk/resize-observer';
import { VtsDropDownModule } from '@ui-vts/ng-vts/dropdown';
import { VtsEmptyModule } from '@ui-vts/ng-vts/empty';
import { VtsI18nModule } from '@ui-vts/ng-vts/i18n';
import { VtsIconModule } from '@ui-vts/ng-vts/icon';
import { VtsMenuModule } from '@ui-vts/ng-vts/menu';
import { VtsPaginationModule } from '@ui-vts/ng-vts/pagination';
import { VtsRadioModule } from '@ui-vts/ng-vts/radio';
import { VtsSpinModule } from '@ui-vts/ng-vts/spin';
import { VtsFormModule } from '@ui-vts/ng-vts/form';
import { VtsProTableContainerComponent } from './pro-table.component';
import { VtsProTableConfigComponent } from './components/table-config.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ProtableDrawerComponent } from './components/table-drawer.component';
import { VtsInputNumberModule } from '@ui-vts/ng-vts/input-number';
import { VtsTagModule } from '@ui-vts/ng-vts/tag';
import { VtsDatePickerModule } from '@ui-vts/ng-vts/date-picker';
import { VtsTableDeleteComponent } from './components/table-delete.component';
import { VtsTableUploadComponent } from './components/table-upload.component';
import { VtsTabsModule } from '@ui-vts/ng-vts/tabs';
import { VtsProTableGroupFilterComponent } from './components/group-filter.component';
import { VtsProTableSelectedLabelConfigComponent } from './components/selected-label-config.component';
import { VtsProtableFilterPopupComponent } from './components/filter-popup.component';
import { VtsThSelectionComponent } from './components/th-selection.component';
import { VtsProTableSelectionComponent } from './components/selection.component';
import { VtsTdAddOnComponent } from './components/td-addon.component';
import { VtsRowIndentDirective } from './components/row-indent.directive';
import { VtsThAddOnComponent } from './components/th-addon.component';
import { VtsProTableSortersComponent } from './components/sorters.component';
import { VtsRowExpandButtonComponent } from './components/row-expand-button.directive';
import { VtsProTableFilterComponent } from './components/filter.component';
import { VtsFilterTriggerComponent } from './components/filter-trigger.component';

@NgModule({
  declarations: [
    VtsProTableContainerComponent,
    VtsProTableGroupFilterComponent,
    VtsProTableConfigComponent,
    ProtableDrawerComponent,
    VtsTableDeleteComponent,
    VtsTableUploadComponent,
    VtsProTableSelectedLabelConfigComponent,
    VtsProtableFilterPopupComponent,
    VtsThSelectionComponent,
    VtsProTableSelectionComponent,
    VtsTdAddOnComponent,
    VtsRowIndentDirective,
    VtsThAddOnComponent,
    VtsProTableSortersComponent,
    VtsRowExpandButtonComponent,
    VtsProTableFilterComponent,
    VtsFilterTriggerComponent
  ],
  exports: [
    VtsProTableContainerComponent,
    VtsProTableGroupFilterComponent,
    VtsProTableSelectedLabelConfigComponent,
    VtsProTableSelectionComponent
  ],
  imports: [
    BidiModule,
    VtsMenuModule,
    FormsModule,
    VtsOutletModule,
    VtsRadioModule,
    VtsCheckboxModule,
    VtsDropDownModule,
    VtsButtonModule,
    CommonModule,
    PlatformModule,
    VtsPaginationModule,
    VtsResizeObserverModule,
    VtsSpinModule,
    VtsI18nModule,
    VtsIconModule,
    VtsEmptyModule,
    ScrollingModule,
    VtsResizeObserverModule,
    VtsFormModule,
    ReactiveFormsModule,
    VtsModalModule,
    VtsDrawerModule,
    VtsFormModule,
    VtsSelectModule,
    VtsUploadModule,
    VtsDividerModule,
    DragDropModule,
    VtsInputNumberModule,
    VtsTagModule,
    VtsInputModule,
    VtsTabsModule,
    VtsBadgeModule,
    VtsDatePickerModule,
    VtsSwitchModule,
    VtsPopoverModule
  ]
})
export class VtsProTableModule { }

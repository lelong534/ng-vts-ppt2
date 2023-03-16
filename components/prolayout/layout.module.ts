/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule } from '@angular/cdk/bidi';
import { LayoutModule } from '@angular/cdk/layout';
import { PlatformModule } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VtsIconModule } from '@ui-vts/ng-vts/icon';
import { VtsAvatarModule } from '@ui-vts/ng-vts/avatar';
import { VtsBreadCrumbModule } from '@ui-vts/ng-vts/breadcrumb';
import { VtsButtonModule } from '@ui-vts/ng-vts/button';
import { VtsDividerModule } from '@ui-vts/ng-vts/divider';
import { VtsDrawerModule } from '@ui-vts/ng-vts/drawer';
import { VtsGridModule } from '@ui-vts/ng-vts/grid';
import { VtsMenuModule } from '@ui-vts/ng-vts/menu';
import { VtsSelectModule } from '@ui-vts/ng-vts/select';
import { VtsSwitchModule } from '@ui-vts/ng-vts/switch';
import { VtsTagModule } from '@ui-vts/ng-vts/tag';
import { VtsContentComponent } from './content.component';
import { VtsFooterComponent } from './footer.component';
import { VtsHeaderComponent } from './header.component';
import { VtsProLayoutComponent } from './layout.component';
import { VtsProlayoutMenuItemHorizontalComponent } from './menu-item-horizontal.component';
import { VtsProlayoutMenuItemComponent } from './menu-item.component';
import { VtsProLayoutContainerComponent } from './pro-layout.component';
import { VtsSettingDrawerComponent } from './setting-drawer.component';
import { VtsSiderTriggerComponent } from './sider-trigger.component';
import { VtsSiderComponent } from './sider.component';

@NgModule({
  declarations: [
    VtsHeaderComponent,
    VtsContentComponent,
    VtsFooterComponent,
    VtsSiderComponent,
    VtsSiderTriggerComponent,
    VtsProLayoutComponent,
    VtsProLayoutContainerComponent,
    VtsProlayoutMenuItemComponent,
    VtsProlayoutMenuItemHorizontalComponent,
    VtsSettingDrawerComponent
  ],
  exports: [
    VtsProLayoutContainerComponent
  ],
  imports: [
    BidiModule,
    CommonModule,
    VtsIconModule,
    LayoutModule,
    PlatformModule,
    VtsDrawerModule,
    VtsButtonModule,
    VtsSwitchModule,
    FormsModule,
    VtsMenuModule,
    VtsBreadCrumbModule,
    VtsAvatarModule,
    VtsDividerModule,
    VtsTagModule,
    VtsGridModule,
    VtsSelectModule
  ]
})
export class VtsProLayoutModule {}

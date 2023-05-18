import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { VtsDrawerRef } from '@ui-vts/ng-vts/drawer';
import { DEFAULT_LAYOUT_STATE, LAYOUT_STATE_STORE_KEY, VtsLayoutState, VtsMenuItemProLayout, VtsNotiPaneType } from './pro-layout.types';

@Injectable({
  providedIn: 'root'
})
export class VtsProlayoutService {
  fixedSiderChange$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  fixedHeaderChange$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  visibilitySiderChange$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  visibilityHeaderChange$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  visibilityFooterChange$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  useSplitMenuChange$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  menuHeaderChange$: ReplaySubject<VtsMenuItemProLayout[]> = new ReplaySubject<
    VtsMenuItemProLayout[]
  >(1);
  menuSiderChange$: ReplaySubject<VtsMenuItemProLayout[]> = new ReplaySubject<
    VtsMenuItemProLayout[]
  >(1);
  collapSiderChange$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  notificationChange$: ReplaySubject<number> = new ReplaySubject<number>(1);
  // notification pane visibility
  visiblePaneChange$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  settingDrawerStateChange$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  drawerNotifyRef: VtsDrawerRef | null = null;

  // layout state
  layoutState: VtsLayoutState = {
    ...DEFAULT_LAYOUT_STATE
  };

  onChangeFixedSider(isFixed: boolean): void {
    let state = {...this.layoutState};
    state.fixedSider = isFixed;
    this.layoutState = {...state};
    this.saveLayoutState();
    this.fixedSiderChange$.next(isFixed);
  }

  onChangeFixedHeader(isFixed: boolean): void {
    let state = {...this.layoutState};
    state.fixedHeader = isFixed;
    this.layoutState = {...state};
    this.saveLayoutState();
    this.fixedHeaderChange$.next(isFixed);
  }

  onChangeVisibilitySider(isShow: boolean): void {
    let state = {...this.layoutState};
    state.showSider = isShow;
    this.layoutState = {...state};
    this.saveLayoutState();
    this.visibilitySiderChange$.next(isShow);
  }

  onChangeVisibilityHeader(isShow: boolean): void {
    let state = {...this.layoutState};
    state.showHeader = isShow;
    this.layoutState = {...state};
    this.saveLayoutState();
    this.visibilityHeaderChange$.next(isShow);
  }

  onChangeVisibilityFooter(isShow: boolean): void {
    let state = {...this.layoutState};
    state.showFooter = isShow;
    this.layoutState = {...state};
    this.saveLayoutState();
    this.visibilityFooterChange$.next(isShow);
  }

  onChangeUseSplitMenu(isMenuSplitted: boolean): void {
    let state = {...this.layoutState};
    state.splitMenu = isMenuSplitted;
    this.layoutState = {...state};
    this.saveLayoutState();
    this.useSplitMenuChange$.next(isMenuSplitted);
  }

  onChangeMenuHeader(data: VtsMenuItemProLayout[]): void {
    this.menuHeaderChange$.next(data);
  }

  onChangeMenuSider(data: VtsMenuItemProLayout[]): void {
    this.menuSiderChange$.next(data);
  }

  onChangeCollapedSider(isCollapsed: boolean): void {
    let state = {...this.layoutState};
    state.collapsedSider = isCollapsed;
    this.layoutState = {...state};
    this.saveLayoutState();
    this.collapSiderChange$.next(isCollapsed);
  }

  onChangeNotification(count: number): void {
    this.notificationChange$.next(count);
  }

  getDrawerNotifyRef(): VtsDrawerRef | null {
    return this.drawerNotifyRef;
  }

  openNotificationPane(paneType: VtsNotiPaneType): void {
    if (paneType === 'drawer') {
      this.visiblePaneChange$.next(true);
    }
  }

  onChangeSettingDrawerState(visible: boolean) {
    this.settingDrawerStateChange$.next(visible);
  }

  getLayoutState(){
    if(this.storage.getItem(LAYOUT_STATE_STORE_KEY)){
      this.layoutState = <VtsLayoutState> JSON.parse(this.storage.getItem(LAYOUT_STATE_STORE_KEY)!)
    }
    return this.layoutState;
  }

  private storage = localStorage;
  /**
   * keep layout state for the next page reload
   */
  saveLayoutState(){
    this.storage.setItem(LAYOUT_STATE_STORE_KEY,JSON.stringify(this.layoutState));
  }
}

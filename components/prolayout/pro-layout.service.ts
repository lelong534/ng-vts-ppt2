import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { MenuItemProLayout } from './pro-layout.types';

@Injectable({
    providedIn: 'root'
})
export class ProlayoutService {
    
    fixedSiderChange$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
    fixedHeaderChange$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
    visibilitySiderChange$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
    visibilityHeaderChange$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
    visibilityFooterChange$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
    useSplitMenuChange$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
    menuHeaderChange$: ReplaySubject<MenuItemProLayout[]> = new ReplaySubject<MenuItemProLayout[]>(1);
    menuSiderChange$: ReplaySubject<MenuItemProLayout[]> = new ReplaySubject<MenuItemProLayout[]>(1);

    tooltipChange$: Subject<boolean | MenuItemProLayout | null> = new Subject<boolean | MenuItemProLayout | null>();

    onChangeFixedSider(isFixed: boolean): void {
        this.fixedSiderChange$.next(isFixed);
    }

    onChangeFixedHeader(isFixed: boolean): void {
        this.fixedHeaderChange$.next(isFixed);
    }

    onChangeVisibilitySider(isShow: boolean): void {
        this.visibilitySiderChange$.next(isShow);
    }

    onChangeVisibilityHeader(isShow: boolean): void {
        this.visibilityHeaderChange$.next(isShow);
    }

    onChangeVisibilityFooter(isShow: boolean): void {
        this.visibilityFooterChange$.next(isShow);
    }

    onChangeUseSplitMenu(isMenuSplitted: boolean): void {
        this.useSplitMenuChange$.next(isMenuSplitted);
    }

    onChangeMenuHeader(data: MenuItemProLayout[]): void {
        this.menuHeaderChange$.next(data);
    }
    
    onChangeMenuSider(data: MenuItemProLayout[]): void {
        this.menuSiderChange$.next(data);
    }

    showTooltip(): void {
        this.tooltipChange$.next(true);
    }

    mouseLeaveChildTooltip(menuItem: MenuItemProLayout | null){
        this.tooltipChange$.next(menuItem);
    }
}
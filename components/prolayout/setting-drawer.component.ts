import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ElementRef,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { VtsProlayoutService } from './pro-layout.service';
import { VtsThemeColorType } from './pro-layout.types';
import { VtsThemeService, VtsTheme, VtsThemeItem } from '@ui-vts/theme/services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'vts-setting-drawer',
  templateUrl: './setting-drawer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false
})
export class VtsSettingDrawerComponent implements OnInit, OnDestroy {
  constructor(
    private elementRef: ElementRef,
    private prolayoutService: VtsProlayoutService,
    private themeService: VtsThemeService,
    private cdr: ChangeDetectorRef
  ) {
    this.elementRef.nativeElement.classList.add('vts-setting-drawer');
    this.themeService.allTheme$.subscribe((d: VtsThemeItem[]) => {
      this.allThemes = d;
    });
    this.themeService.theme$.subscribe((d: VtsTheme | null) => {
      this.currentTheme = d;
      if(d == "dark"){
        this.isDarkMode = true;
      }
      else {
        this.isDarkMode = false;
      }
    });
  }

  allThemes: VtsThemeItem[] = [];
  currentTheme: VtsTheme | null = null;
  isDarkMode: boolean = false;
  open: boolean = false;
  listColors: VtsThemeColorType[] = [
    {
      isChecked: true,
      value: '#EE0033',
      themeValue: 'danger'
    },
    {
      isChecked: false,
      value: '#f50',
      themeValue: 'warning'
    },
    {
      isChecked: false,
      value: '#2db7f5',
      themeValue: 'info'
    },
    {
      isChecked: false,
      value: '#87d068',
      themeValue: 'success'
    },
    {
      isChecked: false,
      value: '#108ee9',
      themeValue: 'dark'
    }
  ];

  isFixedHeader: boolean = false;
  isFixedSider: boolean = false;
  isShowHeader: boolean = true;
  isShowSider: boolean = true;
  isShowFooter: boolean = true;
  useSplitMenu: boolean = true;
  onDestroy$ = new Subject();

  @Output() vtsSetThemeColor: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit() {
    // update based on saved layout state on localstorage, if exist
    const currentState = this.prolayoutService.getLayoutState();
    if(currentState){
      this.isFixedHeader = currentState.fixedHeader;
      this.isFixedSider = currentState.fixedSider;
    }
    this.prolayoutService.fixedSiderChange$.next(this.isFixedSider);
    this.prolayoutService.fixedHeaderChange$.next(this.isFixedHeader);
    this.prolayoutService.settingDrawerStateChange$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((visible: boolean) => {
        if (visible) {
          this.openDrawer();
        }
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  closeDrawer() {
    this.open = false;
    this.prolayoutService.onChangeSettingDrawerState(false);
  }

  openDrawer() {
    this.open = true;
  }

  onChangeFixedSider(value: boolean) {
    this.isFixedSider = value;
    this.prolayoutService.onChangeFixedSider(value);
    if (value && this.isFixedHeader) {
      this.isFixedHeader = false;
      this.prolayoutService.onChangeFixedHeader(false);
    }
    if (!this.isShowSider) {
      this.isShowSider = true;
      this.prolayoutService.onChangeVisibilitySider(true);
    }
  }

  onChangeFixedHeader(value: boolean) {
    this.isFixedHeader = value;
    this.prolayoutService.onChangeFixedHeader(value);
    if (value && this.isFixedSider) {
      this.isFixedSider = false;
      this.prolayoutService.onChangeFixedSider(false);
    }
    if (!this.isShowHeader) {
      this.isShowHeader = true;
      this.prolayoutService.onChangeVisibilityHeader(true);
    }
  }

  onChangeVisiblityHeader(value: boolean) {
    this.isShowHeader = value;
    this.prolayoutService.onChangeVisibilityHeader(value);
    if (!value && this.isFixedHeader) {
      this.isFixedHeader = false;
      this.prolayoutService.onChangeFixedHeader(false);
    }
  }

  onChangeVisiblitySider(value: boolean) {
    this.isShowSider = value;
    this.prolayoutService.onChangeVisibilitySider(value);
    if (!value && this.isFixedSider) {
      this.isFixedSider = false;
      this.prolayoutService.onChangeFixedSider(false);
    }
  }

  onChangeVisiblityFooter(value: boolean) {
    this.isShowFooter = value;
    this.prolayoutService.onChangeVisibilityFooter(value);
  }

  onChangeThemeColor(value: string, theme: VtsTheme) {
    let cloneColors: VtsThemeColorType[] = [...this.listColors];
    cloneColors.filter(c => c.isChecked)[0].isChecked = false;
    cloneColors.filter(c => c.value == value)[0].isChecked = true;
    this.listColors = [...cloneColors];
    this.themeService.setTheme(theme)
    this.vtsSetThemeColor.emit(value);
  }

  onChangeSplitMenu(value: boolean) {
    this.useSplitMenu = value;
    this.prolayoutService.onChangeUseSplitMenu(value);
  }

  onThemeChange() {
    this.themeService.setTheme(this.currentTheme === 'default' ? 'dark' : 'default');
  }
}

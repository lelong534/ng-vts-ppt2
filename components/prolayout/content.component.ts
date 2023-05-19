/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Renderer2,
  ViewEncapsulation
} from '@angular/core';
import { VtsTheme, VtsThemeItem, VtsThemeService } from '@ui-vts/theme/services';

@Component({
  selector: 'vts-prolayout-content',
  exportAs: 'vtsProLayoutContent',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content></ng-content>
  `
})
export class VtsContentComponent {
  constructor(private elementRef: ElementRef, 
    private renderer: Renderer2,
    private themeService: VtsThemeService) {
    this.renderer.addClass(this.elementRef.nativeElement, 'vts-prolayout-content');
    this.themeService.allTheme$.subscribe((d: VtsThemeItem[]) => {
      this.allThemes = d;
    });
    this.themeService.theme$.subscribe((d: VtsTheme | null) => {
      this.currentTheme = d;
      if(d == "dark"){
        this.renderer.addClass(this.elementRef.nativeElement, 'vts-prolayout-content-dark');
      }
      else {
        this.renderer.removeClass(this.elementRef.nativeElement, 'vts-prolayout-content-dark');
      }
    });
  }

  allThemes: VtsThemeItem[] = [];
  currentTheme: VtsTheme | null = null;
}

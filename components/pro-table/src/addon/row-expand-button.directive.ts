/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'button[vts-row-expand-button]',
  template: `
    <ng-container *ngIf="!!expandTemplate">
      <ng-template
        [ngTemplateOutlet]="expandTemplate"
        [ngTemplateOutletContext]="{ $implicit: expand }"
      ></ng-template>
    </ng-container>
  `,
  host: {
    '[type]': `'button'`,
    '[class.vts-table-row-expand-icon-template]': `!!expandTemplate`,
    '[class.vts-table-row-expand-icon-expanded]': `!expandTemplate && !spaceMode && expand === true`,
    '[class.vts-table-row-expand-icon-collapsed]': `!expandTemplate && !spaceMode && expand === false`,
    '[class.vts-table-row-expand-icon-spaced]': 'spaceMode',
    '(click)': 'onHostClick()'
  }
})
export class VtsRowExpandButtonComponent {
  @Input() expand = false;
  @Input() spaceMode = false;
  @Output() readonly expandChange = new EventEmitter();
  @Input() expandTemplate: TemplateRef<{
    $implicit: boolean;
  }> | null = null;

  constructor(private elementRef: ElementRef) {
    // TODO: move to host after View Engine deprecation
    this.elementRef.nativeElement.classList.add('vts-table-row-expand-icon');
  }

  onHostClick(): void {
    if (!this.spaceMode) {
      this.expand = !this.expand;
      this.expandChange.next(this.expand);
    }
  }
}

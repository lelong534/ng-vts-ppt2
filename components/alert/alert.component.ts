/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { slideAlertMotion } from '@ui-vts/ng-vts/core/animation';
import { VtsConfigKey, VtsConfigService, WithConfig } from '@ui-vts/ng-vts/core/config';
import { BooleanInput } from '@ui-vts/ng-vts/core/types';
import { InputBoolean } from '@ui-vts/ng-vts/core/util';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const VTS_CONFIG_MODULE_NAME: VtsConfigKey = 'alert';

@Component({
  selector: 'vts-alert',
  exportAs: 'vtsAlert',
  animations: [slideAlertMotion],
  template: `
    <div
      *ngIf="!closed"
      class="vts-alert"
      [class.vts-alert-rtl]="dir === 'rtl'"
      [class.vts-alert-success]="vtsType === 'success' && !vtsForm"
      [class.vts-alert-form-success]="vtsType === 'success' && vtsForm"
      [class.vts-alert-info]="vtsType === 'info' && !vtsForm"
      [class.vts-alert-form-info]="vtsType === 'info' && vtsForm"
      [class.vts-alert-warning]="vtsType === 'warning' && !vtsForm"
      [class.vts-alert-form-warning]="vtsType === 'warning' && vtsForm"
      [class.vts-alert-error]="vtsType === 'error' && !vtsForm"
      [class.vts-alert-form-error]="vtsType === 'error' && vtsForm"
      [class.vts-alert-no-icon]="!vtsShowIcon"
      [class.vts-alert-banner]="vtsBanner"
      [class.vts-alert-closable]="vtsCloseable"
      [class.vts-alert-with-description]="!!vtsDescription"
      [@.disabled]="vtsNoAnimation"
      [@slideAlertMotion]
      (@slideAlertMotion.done)="onFadeAnimationDone()"
    >
      <ng-container *ngIf="vtsShowIcon" [ngSwitch]="vtsType">
        <i *ngSwitchCase="'success'"
          class="vts-alert-icon" 
          [class.vts-alert-icon-size]="!vtsForm && vtsDescription" 
          [class.vts-alert-form-size]="vtsForm || !vtsDescription" vts-icon 
          [vtsType]="vtsIconType || 'CheckCircleDoutone'"></i>
        <i *ngSwitchCase="'info'"
          class="vts-alert-icon" 
          [class.vts-alert-icon-size]="!vtsForm && vtsDescription" 
          [class.vts-alert-form-size]="vtsForm || !vtsDescription" vts-icon 
          [vtsType]="vtsIconType || 'InfoDoutone'"></i>
        <i *ngSwitchCase="'warning'"
          class="vts-alert-icon" 
          [class.vts-alert-icon-size]="!vtsForm && vtsDescription" 
          [class.vts-alert-form-size]="vtsForm || !vtsDescription" vts-icon 
          [vtsType]="vtsIconType || 'ReportProblemDoutone'"></i>
        <i *ngSwitchCase="'error'" 
          class="vts-alert-icon" 
          [class.vts-alert-icon-size]="!vtsForm && vtsDescription" 
          [class.vts-alert-form-size]="vtsForm || !vtsDescription" vts-icon 
          [vtsType]="vtsIconType || 'HighlightOffDoutone'"></i>
        <i *ngSwitchDefault 
          class="vts-alert-icon" 
          [class.vts-alert-icon-size]="!vtsForm && vtsDescription" 
          [class.vts-alert-form-size]="vtsForm || !vtsDescription" vts-icon 
          [vtsType]="vtsIconType || inferredIconType"></i>
      </ng-container>
      <div [class.vts-alert-content]="!vtsForm" [class.vts-alert-form-content]="vtsForm" *ngIf="vtsMessage || vtsDescription">
        <span class="vts-alert-message" [class.vts-alert-form-message]="vtsForm" *ngIf="vtsMessage">
          <ng-container *vtsStringTemplateOutlet="vtsMessage">
            {{ vtsMessage }}
          </ng-container>
        </span>
        <span class="vts-alert-description" [class.vts-alert-form-message]="vtsForm" *ngIf="vtsDescription">
          <ng-container *vtsStringTemplateOutlet="vtsDescription">
            {{ vtsDescription }}
          </ng-container>
        </span>
      </div>
      <button
        type="button"
        tabindex="0"
        *ngIf="vtsCloseable || vtsCloseText"
        class="vts-alert-close-icon vts-alert-icon"
        (click)="closeAlert()"
      >
        <ng-template #closeDefaultTemplate>
          <i vts-icon vtsType="Close"></i>
        </ng-template>
        <ng-container *ngIf="vtsCloseText; else closeDefaultTemplate">
          <ng-container *vtsStringTemplateOutlet="vtsCloseText">
            <span class="vts-alert-close-text">{{ vtsCloseText }}</span>
          </ng-container>
        </ng-container>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false
})
export class VtsAlertComponent implements OnChanges, OnDestroy, OnInit {
  readonly _vtsModuleName: VtsConfigKey = VTS_CONFIG_MODULE_NAME;
  static ngAcceptInputType_vtsCloseable: BooleanInput;
  static ngAcceptInputType_vtsShowIcon: BooleanInput;
  static ngAcceptInputType_vtsBanner: BooleanInput;
  static ngAcceptInputType_vtsNoAnimation: BooleanInput;
  static ngAcceptInputType_vtsForm: BooleanInput;

  @Input() vtsCloseText: string | TemplateRef<void> | null = null;
  @Input() vtsIconType: string | null = '';
  @Input() vtsMessage: string | TemplateRef<void> | null = null;
  @Input() vtsDescription: string | TemplateRef<void> | null = null;
  @Input() vtsType: 'success' | 'info' | 'warning' | 'error' = 'info';
  @Input() @WithConfig() @InputBoolean() vtsCloseable: boolean = false;
  @Input() @WithConfig() @InputBoolean() vtsShowIcon: boolean = false;
  @Input() @InputBoolean() vtsBanner = false;
  @Input() @InputBoolean() vtsNoAnimation = false;
  @Input() @WithConfig() @InputBoolean() vtsForm: boolean = false;
  @Output() readonly vtsOnClose = new EventEmitter<boolean>();
  closed = false;
  iconTheme: 'outline' | 'fill' = 'fill';
  inferredIconType: string = 'info-circle';
  dir: Direction = 'ltr';
  private isTypeSet = false;
  private isShowIconSet = false;
  private destroy$ = new Subject();

  constructor(
    public vtsConfigService: VtsConfigService,
    private cdr: ChangeDetectorRef,
    @Optional() private directionality: Directionality
  ) {
    this.vtsConfigService
      .getConfigChangeEventForComponent(VTS_CONFIG_MODULE_NAME)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }

  ngOnInit(): void {
    this.directionality.change?.pipe(takeUntil(this.destroy$)).subscribe((direction: Direction) => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    this.dir = this.directionality.value;
  }

  closeAlert(): void {
    this.closed = true;
  }

  onFadeAnimationDone(): void {
    if (this.closed) {
      this.vtsOnClose.emit(true);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { vtsShowIcon, vtsDescription, vtsType, vtsBanner } = changes;
    if (vtsShowIcon) {
      this.isShowIconSet = true;
    }
    if (vtsType) {
      this.isTypeSet = true;
      switch (this.vtsType) {
        case 'error':
          this.inferredIconType = 'Close';
          break;
        case 'success':
          this.inferredIconType = 'check-circle';
          break;
        case 'info':
          this.inferredIconType = 'info-circle';
          break;
        case 'warning':
          this.inferredIconType = 'exclamation-circle';
          break;
      }
    }
    if (vtsDescription) {
      this.iconTheme = this.vtsDescription ? 'outline' : 'fill';
    }
    if (vtsBanner) {
      if (!this.isTypeSet) {
        this.vtsType = 'warning';
      }
      if (!this.isShowIconSet) {
        this.vtsShowIcon = true;
      }
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

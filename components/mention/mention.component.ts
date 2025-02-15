/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  DOWN_ARROW,
  ENTER,
  ESCAPE,
  LEFT_ARROW,
  RIGHT_ARROW,
  TAB,
  UP_ARROW
} from '@angular/cdk/keycodes';
import {
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef,
  PositionStrategy
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {
  DEFAULT_MENTION_BOTTOM_POSITIONS,
  DEFAULT_MENTION_TOP_POSITIONS
} from '@ui-vts/ng-vts/core/overlay';
import { BooleanInput, VtsSafeAny } from '@ui-vts/ng-vts/core/types';
import { getCaretCoordinates, getMentions, InputBoolean } from '@ui-vts/ng-vts/core/util';
import { fromEvent, merge, Subscription } from 'rxjs';

import { VTS_MENTION_CONFIG } from './config';
import { VtsMentionSuggestionDirective } from './mention-suggestions';
import { VtsMentionTriggerDirective } from './mention-trigger';
import { VtsMentionService } from './mention.service';

export interface MentionOnSearchTypes {
  value: string;
  prefix: string;
}

export interface Mention {
  startPos: number;
  endPos: number;
  mention: string;
}

export type MentionPlacement = 'top' | 'bottom';

@Component({
  selector: 'vts-mention',
  exportAs: 'vtsMention',
  template: `
    <ng-content></ng-content>
    <ng-template #suggestions>
      <ul class="vts-mention-dropdown">
        <li
          #items
          class="vts-mention-dropdown-item"
          *ngFor="let suggestion of filteredSuggestions; let i = index"
          [class.focus]="i === activeIndex"
          (mousedown)="$event.preventDefault()"
          (click)="selectSuggestion(suggestion)"
        >
          <ng-container *ngIf="suggestionTemplate; else defaultSuggestion">
            <ng-container
              *ngTemplateOutlet="suggestionTemplate; context: { $implicit: suggestion }"
            ></ng-container>
          </ng-container>
          <ng-template #defaultSuggestion>
            {{ vtsValueWith(suggestion) }}
          </ng-template>
        </li>
        <li
          class="vts-mention-dropdown-notfound vts-mention-dropdown-item"
          *ngIf="filteredSuggestions.length === 0"
        >
          <span *ngIf="vtsLoading"><i vts-icon vtsType="Sync"></i></span>
          <span *ngIf="!vtsLoading">{{ vtsNoResult }}</span>
        </li>
      </ul>
    </ng-template>
  `,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [VtsMentionService]
})
export class VtsMentionComponent implements OnDestroy, OnInit, OnChanges {
  static ngAcceptInputType_vtsLoading: BooleanInput;

  @Input() vtsValueWith: (value: VtsSafeAny) => string = value => value;
  @Input() vtsPrefix: string | string[] = '@';
  @Input() @InputBoolean() vtsLoading = false;
  @Input() vtsNoResult: string = '无匹配结果，轻敲空格完成输入';
  @Input() vtsPlacement: MentionPlacement = 'bottom';
  @Input() vtsSuggestions: VtsSafeAny[] = [];
  @Output() readonly vtsOnSelect: EventEmitter<VtsSafeAny> = new EventEmitter();
  @Output()
  readonly vtsOnSearchChange: EventEmitter<MentionOnSearchTypes> = new EventEmitter();

  trigger!: VtsMentionTriggerDirective;
  @ViewChild(TemplateRef, { static: false })
  suggestionsTemp?: TemplateRef<void>;
  @ViewChildren('items', { read: ElementRef })
  items!: QueryList<ElementRef>;

  @ContentChild(VtsMentionSuggestionDirective, {
    static: false,
    read: TemplateRef
  })
  set suggestionChild(value: TemplateRef<{ $implicit: VtsSafeAny }>) {
    if (value) {
      this.suggestionTemplate = value;
    }
  }

  isOpen = false;
  filteredSuggestions: string[] = [];
  suggestionTemplate: TemplateRef<{ $implicit: VtsSafeAny }> | null = null;
  activeIndex = -1;

  private previousValue: string | null = null;
  private cursorMention: string | null = null;
  private cursorMentionStart?: number;
  private cursorMentionEnd?: number;
  private overlayRef: OverlayRef | null = null;
  private portal?: TemplatePortal<void>;
  private positionStrategy!: FlexibleConnectedPositionStrategy;
  private overlayOutsideClickSubscription!: Subscription;

  private get triggerNativeElement(): HTMLTextAreaElement | HTMLInputElement {
    return this.trigger.el.nativeElement;
  }

  private get focusItemElement(): HTMLElement | null {
    const itemArr = this.items?.toArray();
    if (itemArr && itemArr[this.activeIndex]) {
      return itemArr[this.activeIndex].nativeElement;
    }
    return null;
  }

  constructor(
    @Optional() @Inject(DOCUMENT) private ngDocument: VtsSafeAny,
    private cdr: ChangeDetectorRef,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private vtsMentionService: VtsMentionService
  ) {}

  ngOnInit(): void {
    this.vtsMentionService.triggerChanged().subscribe(trigger => {
      this.trigger = trigger;
      this.bindTriggerEvents();
      this.closeDropdown();
      this.overlayRef = null;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('vtsSuggestions')) {
      if (this.isOpen) {
        this.previousValue = null;
        this.activeIndex = -1;
        this.resetDropdown(false);
      }
    }
  }

  ngOnDestroy(): void {
    this.closeDropdown();
  }

  closeDropdown(): void {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
      this.overlayOutsideClickSubscription.unsubscribe();
      this.isOpen = false;
      this.cdr.markForCheck();
    }
  }

  openDropdown(): void {
    this.attachOverlay();
    this.isOpen = true;
    this.cdr.markForCheck();
  }

  getMentions(): string[] {
    return this.trigger ? getMentions(this.trigger.value!, this.vtsPrefix) : [];
  }

  selectSuggestion(suggestion: string | {}): void {
    const value = this.vtsValueWith(suggestion);
    this.trigger.insertMention({
      mention: value,
      startPos: this.cursorMentionStart!,
      endPos: this.cursorMentionEnd!
    });
    this.vtsOnSelect.emit(suggestion);
    this.closeDropdown();
    this.activeIndex = -1;
  }

  private handleInput(event: KeyboardEvent): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.trigger.onChange(target.value);
    this.trigger.value = target.value;
    this.resetDropdown();
  }

  private handleKeydown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    if (
      this.isOpen &&
      keyCode === ENTER &&
      this.activeIndex !== -1 &&
      this.filteredSuggestions.length
    ) {
      this.selectSuggestion(this.filteredSuggestions[this.activeIndex]);
      event.preventDefault();
    } else if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
      this.resetDropdown();
      event.stopPropagation();
    } else {
      if (this.isOpen && (keyCode === TAB || keyCode === ESCAPE)) {
        this.closeDropdown();
        return;
      }

      if (this.isOpen && keyCode === UP_ARROW) {
        this.setPreviousItemActive();
        event.preventDefault();
        event.stopPropagation();
      }

      if (this.isOpen && keyCode === DOWN_ARROW) {
        this.setNextItemActive();
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  private handleClick(): void {
    this.resetDropdown();
  }

  private bindTriggerEvents(): void {
    this.trigger.onInput.subscribe((e: KeyboardEvent) => this.handleInput(e));
    this.trigger.onKeydown.subscribe((e: KeyboardEvent) => this.handleKeydown(e));
    this.trigger.onClick.subscribe(() => this.handleClick());
  }

  private suggestionsFilter(value: string, emit: boolean): void {
    const suggestions = value.substring(1);
    /**
     * Should always emit (vtsOnSearchChange) when value empty
     *
     * @[something]... @[empty]... @[empty]
     *     ^             ^           ^
     * preValue        preValue  (should emit)
     */
    if (this.previousValue === value && value !== this.cursorMention![0]) {
      return;
    }
    this.previousValue = value;
    if (emit) {
      this.vtsOnSearchChange.emit({
        value: this.cursorMention!.substring(1),
        prefix: this.cursorMention![0]
      });
    }
    const searchValue = suggestions.toLowerCase();
    this.filteredSuggestions = this.vtsSuggestions.filter(suggestion =>
      this.vtsValueWith(suggestion).toLowerCase().includes(searchValue)
    );
  }

  private resetDropdown(emit: boolean = true): void {
    this.resetCursorMention();
    if (typeof this.cursorMention !== 'string' || !this.canOpen()) {
      this.closeDropdown();
      return;
    }
    this.suggestionsFilter(this.cursorMention, emit);
    const activeIndex = this.filteredSuggestions.indexOf(this.cursorMention.substring(1));
    this.activeIndex = activeIndex >= 0 ? activeIndex : 0;
    this.openDropdown();
  }

  private setNextItemActive(): void {
    this.activeIndex =
      this.activeIndex + 1 <= this.filteredSuggestions.length - 1 ? this.activeIndex + 1 : 0;
    this.cdr.markForCheck();
    this.scrollToFocusItem();
  }

  private setPreviousItemActive(): void {
    this.activeIndex =
      this.activeIndex - 1 < 0 ? this.filteredSuggestions.length - 1 : this.activeIndex - 1;
    this.cdr.markForCheck();
    this.scrollToFocusItem();
  }

  private scrollToFocusItem(): void {
    if (this.focusItemElement) {
      this.focusItemElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  }

  private canOpen(): boolean {
    const element: HTMLInputElement | HTMLTextAreaElement = this.triggerNativeElement;
    return !element.readOnly && !element.disabled;
  }

  private resetCursorMention(): void {
    const value =
      this.triggerNativeElement.value.replace(/[\r\n]/g, VTS_MENTION_CONFIG.split) || '';
    const selectionStart = this.triggerNativeElement.selectionStart!;
    const prefix = typeof this.vtsPrefix === 'string' ? [this.vtsPrefix] : this.vtsPrefix;
    let i = prefix.length;
    while (i >= 0) {
      const startPos = value.lastIndexOf(prefix[i], selectionStart);
      const endPos =
        value.indexOf(VTS_MENTION_CONFIG.split, selectionStart) > -1
          ? value.indexOf(VTS_MENTION_CONFIG.split, selectionStart)
          : value.length;
      const mention = value.substring(startPos, endPos);
      if (
        (startPos > 0 && value[startPos - 1] !== VTS_MENTION_CONFIG.split) ||
        startPos < 0 ||
        mention.includes(prefix[i], 1) ||
        mention.includes(VTS_MENTION_CONFIG.split)
      ) {
        this.cursorMention = null;
        this.cursorMentionStart = -1;
        this.cursorMentionEnd = -1;
      } else {
        this.cursorMention = mention;
        this.cursorMentionStart = startPos;
        this.cursorMentionEnd = endPos;
        return;
      }
      i--;
    }
  }

  private updatePositions(): void {
    const coordinates = getCaretCoordinates(this.triggerNativeElement, this.cursorMentionStart!);
    const top =
      coordinates.top -
      this.triggerNativeElement.getBoundingClientRect().height -
      this.triggerNativeElement.scrollTop +
      (this.vtsPlacement === 'bottom' ? coordinates.height - 6 : -6);
    const left = coordinates.left - this.triggerNativeElement.scrollLeft;
    this.positionStrategy.withDefaultOffsetX(left).withDefaultOffsetY(top);
    if (this.vtsPlacement === 'bottom') {
      this.positionStrategy.withPositions([...DEFAULT_MENTION_BOTTOM_POSITIONS]);
    }
    if (this.vtsPlacement === 'top') {
      this.positionStrategy.withPositions([...DEFAULT_MENTION_TOP_POSITIONS]);
    }
    this.positionStrategy.apply();
  }

  private subscribeOverlayOutsideClick(): Subscription {
    return merge<MouseEvent | TouchEvent>(
      this.overlayRef!.outsidePointerEvents(),
      fromEvent<TouchEvent>(this.ngDocument, 'touchend')
    ).subscribe((event: MouseEvent | TouchEvent) => {
      const clickTarget = event.target as HTMLElement;
      if (
        this.isOpen &&
        clickTarget !== this.trigger.el.nativeElement &&
        !this.overlayRef?.overlayElement.contains(clickTarget)
      ) {
        this.closeDropdown();
      }
    });
  }

  private attachOverlay(): void {
    if (!this.overlayRef) {
      this.portal = new TemplatePortal(this.suggestionsTemp!, this.viewContainerRef);
      this.overlayRef = this.overlay.create(this.getOverlayConfig());
    }
    if (this.overlayRef && !this.overlayRef.hasAttached()) {
      this.overlayRef.attach(this.portal);
      this.overlayOutsideClickSubscription = this.subscribeOverlayOutsideClick();
    }
    this.updatePositions();
  }

  private getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      positionStrategy: this.getOverlayPosition(),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      disposeOnNavigation: true
    });
  }

  private getOverlayPosition(): PositionStrategy {
    const positions = [
      new ConnectionPositionPair(
        { originX: 'start', originY: 'bottom' },
        { overlayX: 'start', overlayY: 'top' }
      ),
      new ConnectionPositionPair(
        { originX: 'start', originY: 'top' },
        { overlayX: 'start', overlayY: 'bottom' }
      )
    ];
    this.positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.trigger.el)
      .withPositions(positions)
      .withFlexibleDimensions(false)
      .withPush(false);
    return this.positionStrategy;
  }
}

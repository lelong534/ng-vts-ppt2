import { Directionality } from '@angular/cdk/bidi';
import { DOWN_ARROW, ENTER, ESCAPE, RIGHT_ARROW, TAB, UP_ARROW } from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { Component, NgZone, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
  tick,
  waitForAsync
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';

import {
  createKeyboardEvent,
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  MockNgZone,
  typeInElement
} from '@ui-vts/ng-vts/core/testing';
import { VtsIconTestModule } from '@ui-vts/ng-vts/icon/testing';

import { VtsInputModule } from '../input';
import { VtsMentionTriggerDirective } from './mention-trigger';
import { VtsMentionComponent } from './mention.component';
import { VtsMentionModule } from './mention.module';

describe('mention', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  const scrolledSubject = new Subject();
  let zone: MockNgZone;

  beforeEach(waitForAsync(() => {
    const dir = 'ltr';
    TestBed.configureTestingModule({
      imports: [
        VtsMentionModule,
        VtsInputModule,
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        VtsIconTestModule
      ],
      declarations: [VtsTestSimpleMentionComponent, VtsTestPropertyMentionComponent],
      providers: [
        { provide: Directionality, useFactory: () => ({ value: dir }) },
        {
          provide: ScrollDispatcher,
          useFactory: () => ({ scrolled: () => scrolledSubject })
        },
        {
          provide: NgZone,
          useFactory: () => {
            zone = new MockNgZone();
            return zone;
          }
        }
      ]
    });

    TestBed.compileComponents();

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();
  }));
  afterEach(inject([OverlayContainer], (currentOverlayContainer: OverlayContainer) => {
    currentOverlayContainer.ngOnDestroy();
    overlayContainer.ngOnDestroy();
  }));

  describe('toggling', () => {
    let fixture: ComponentFixture<VtsTestSimpleMentionComponent>;
    let textarea: HTMLTextAreaElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(VtsTestSimpleMentionComponent);
      fixture.detectChanges();
      textarea = fixture.debugElement.query(By.css('textarea')).nativeElement;
      textarea.value = '@angular';
      fixture.detectChanges();
    });

    it('should open the dropdown when the input is click', () => {
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      expect(fixture.componentInstance.mention.isOpen).toBe(true);
    });

    it('should not open the dropdown when the input is click but empty content', () => {
      textarea.value = '';
      fixture.detectChanges();
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      expect(fixture.componentInstance.mention.isOpen).toBe(false);
    });

    it('should not open the dropdown on click if the input is readonly', fakeAsync(() => {
      const mention = fixture.componentInstance.mention;
      textarea.readOnly = true;
      fixture.detectChanges();

      expect(mention.isOpen).toBe(false);
      dispatchFakeEvent(textarea, 'click');
      flush();

      fixture.detectChanges();
      expect(mention.isOpen).toBe(false);
    }));

    it('should not open the dropdown on click if the input is disabled', fakeAsync(() => {
      const mention = fixture.componentInstance.mention;
      textarea.disabled = true;
      fixture.detectChanges();

      expect(mention.isOpen).toBe(false);
      dispatchFakeEvent(textarea, 'click');
      flush();

      fixture.detectChanges();
      expect(mention.isOpen).toBe(false);
    }));

    it('should close the dropdown when the user clicks away', fakeAsync(() => {
      const mention = fixture.componentInstance.mention;
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      flush();
      expect(mention.isOpen).toBe(true);
      dispatchFakeEvent(document.body, 'click');
      expect(mention.isOpen).toBe(false);
    }));

    it('should close the dropdown when the user taps away on a touch device', fakeAsync(() => {
      const mention = fixture.componentInstance.mention;
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      flush();
      dispatchFakeEvent(document, 'touchend');
      expect(mention.isOpen).toBe(false);
    }));

    it('should close the dropdown when an option is clicked', fakeAsync(() => {
      const mention = fixture.componentInstance.mention;
      textarea.value = '@a';
      fixture.detectChanges();
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      flush();

      const option = overlayContainerElement.querySelector(
        '.vts-mention-dropdown-item'
      ) as HTMLElement;
      option.click();
      fixture.detectChanges();

      tick(500);
      expect(mention.isOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
      expect(textarea.value).toEqual('@angular ');
    }));

    it('should support switch trigger', fakeAsync(() => {
      fixture.componentInstance.inputTrigger = true;
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      const mention = fixture.componentInstance.mention;

      expect(fixture.debugElement.query(By.css('textarea'))).toBeFalsy();
      expect(input).toBeTruthy();

      input.value = '@a';
      fixture.detectChanges();
      dispatchFakeEvent(input, 'click');
      fixture.detectChanges();
      flush();

      expect(mention.isOpen).toBe(true);

      const option = overlayContainerElement.querySelector(
        '.vts-mention-dropdown-item'
      ) as HTMLElement;
      option.click();
      fixture.detectChanges();

      tick(500);
      expect(mention.isOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    }));
  });

  describe('keyboard events', () => {
    let fixture: ComponentFixture<VtsTestSimpleMentionComponent>;
    let textarea: HTMLTextAreaElement;
    let DOWN_ARROW_EVENT: KeyboardEvent;
    let UP_ARROW_EVENT: KeyboardEvent;
    let ENTER_EVENT: KeyboardEvent;
    // let LEFT_EVENT: KeyboardEvent;
    let RIGHT_EVENT: KeyboardEvent;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(VtsTestSimpleMentionComponent);
      fixture.detectChanges();
      textarea = fixture.debugElement.query(By.css('textarea')).nativeElement;

      DOWN_ARROW_EVENT = createKeyboardEvent('keydown', DOWN_ARROW);
      UP_ARROW_EVENT = createKeyboardEvent('keydown', UP_ARROW);
      ENTER_EVENT = createKeyboardEvent('keydown', ENTER);
      // LEFT_EVENT = createKeyboardEvent('keydown', LEFT_ARROW);
      RIGHT_EVENT = createKeyboardEvent('keydown', RIGHT_ARROW);

      fixture.detectChanges();
      flush();
    }));

    it('should set the active item to the second option when DOWN key is pressed', () => {
      textarea.value = '@a';
      fixture.detectChanges();
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();

      const mention = fixture.componentInstance.mention;
      const optionEls = overlayContainerElement.querySelectorAll(
        '.vts-mention-dropdown-item'
      ) as NodeListOf<HTMLElement>;

      expect(mention.isOpen).toBe(true);
      fixture.componentInstance.trigger.onKeydown.emit(DOWN_ARROW_EVENT);
      fixture.detectChanges();

      expect(optionEls[0].classList).not.toContain('focus');
      expect(optionEls[1].classList).toContain('focus');
    });

    it('should set the active item to the first option when DOWN key is pressed in last item', () => {
      textarea.value = '@';
      fixture.detectChanges();
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      const mention = fixture.componentInstance.mention;
      const optionEls = overlayContainerElement.querySelectorAll(
        '.vts-mention-dropdown-item'
      ) as NodeListOf<HTMLElement>;

      expect(mention.isOpen).toBe(true);

      [1, 2, 3, 4, 5].forEach(() =>
        fixture.componentInstance.trigger.onKeydown.emit(DOWN_ARROW_EVENT)
      );
      fixture.detectChanges();

      expect(optionEls[1].classList).not.toContain('focus');
      expect(optionEls[4].classList).not.toContain('focus');
      expect(optionEls[0].classList).toContain('focus');
    });

    it('should set the active item to the last option when UP key is pressed', () => {
      textarea.value = '@';
      fixture.detectChanges();
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      const mention = fixture.componentInstance.mention;
      const optionEls = overlayContainerElement.querySelectorAll(
        '.vts-mention-dropdown-item'
      ) as NodeListOf<HTMLElement>;

      expect(mention.isOpen).toBe(true);

      fixture.componentInstance.trigger.onKeydown.emit(UP_ARROW_EVENT);
      fixture.detectChanges();

      expect(optionEls[0].classList).not.toContain('focus');
      expect(optionEls[4].classList).toContain('focus');
    });

    it('should set the active item to the previous option when UP key is pressed', () => {
      textarea.value = '@';
      fixture.detectChanges();
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      const mention = fixture.componentInstance.mention;
      const optionEls = overlayContainerElement.querySelectorAll(
        '.vts-mention-dropdown-item'
      ) as NodeListOf<HTMLElement>;

      expect(mention.isOpen).toBe(true);

      [1, 2, 3].forEach(() => fixture.componentInstance.trigger.onKeydown.emit(UP_ARROW_EVENT));
      fixture.detectChanges();

      expect(optionEls[0].classList).not.toContain('focus');
      expect(optionEls[2].classList).toContain('focus');
    });

    it('should set the active item properly after filtering', () => {
      const componentInstance = fixture.componentInstance;

      typeInElement('@a', textarea);
      fixture.detectChanges();

      componentInstance.trigger.onKeydown.emit(DOWN_ARROW_EVENT);
      fixture.detectChanges();

      const optionEls = overlayContainerElement.querySelectorAll(
        '.vts-mention-dropdown-item'
      ) as NodeListOf<HTMLElement>;

      expect(optionEls[0].classList).not.toContain('focus');
      expect(optionEls[1].classList).toContain('focus');
      expect(optionEls[1].innerText).toEqual('ant-design-git');
    });

    it('should set the active after filtering item when RIGHT/LEFT key is pressed', () => {
      textarea.value = '@a @t';
      fixture.detectChanges();
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      const componentInstance = fixture.componentInstance;
      [1, 2, 3, 4].forEach(() => componentInstance.trigger.onKeydown.emit(RIGHT_EVENT));
      fixture.detectChanges();

      const optionEls = overlayContainerElement.querySelectorAll(
        '.vts-mention-dropdown-item'
      ) as NodeListOf<HTMLElement>;

      expect(optionEls[0].classList).toContain('focus');
      expect(optionEls[1].classList).not.toContain('focus');
      expect(optionEls[0].innerText).toEqual('ant-design-git');
      expect(optionEls[1].innerText).toEqual('mention');
    });

    it('should fill the text field when an option is selected with ENTER', fakeAsync(() => {
      textarea.value = '@';
      fixture.detectChanges();
      dispatchFakeEvent(textarea, 'click');
      const componentInstance = fixture.componentInstance;
      componentInstance.trigger.onKeydown.emit(DOWN_ARROW_EVENT);
      flush();
      fixture.detectChanges();

      componentInstance.trigger.onKeydown.emit(ENTER_EVENT);
      fixture.detectChanges();

      expect(componentInstance.inputValue).toContain('@ant-design-git ');

      expect(textarea.value).toContain('@ant-design-git ');
    }));

    it('should prevent the default enter key action', fakeAsync(() => {
      textarea.value = '@';
      fixture.detectChanges();
      dispatchFakeEvent(textarea, 'click');
      fixture.componentInstance.trigger.onKeydown.emit(DOWN_ARROW_EVENT);
      flush();

      fixture.componentInstance.trigger.onKeydown.emit(ENTER_EVENT);
      // TODO: ivy fix
      expect(ENTER_EVENT.defaultPrevented).toBe(true);
      // expect(false).toBe(true);
    }));

    it('should not prevent the default enter action for a closed dropdown', () => {
      textarea.value = 'ABC';
      fixture.detectChanges();
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      fixture.componentInstance.trigger.onKeydown.emit(ENTER_EVENT);
      // TODO: ivy fix
      expect(ENTER_EVENT.defaultPrevented).toBe(false);
      // expect(true).toBe(false);
    });

    it('should close the dropdown when tabbing', fakeAsync(() => {
      textarea.value = '@';
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();

      expect(overlayContainerElement.querySelector('.vts-mention-dropdown')).toBeTruthy();

      dispatchKeyboardEvent(textarea, 'keydown', TAB);
      fixture.detectChanges();

      tick(500);
      expect(overlayContainerElement.querySelector('.vts-mention-dropdown')).toBeFalsy();
    }));

    it('should close the dropdown when pressing escape', fakeAsync(() => {
      textarea.value = '@';
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();

      expect(overlayContainerElement.querySelector('.vts-mention-dropdown')).toBeTruthy();

      dispatchKeyboardEvent(textarea, 'keydown', ESCAPE);
      fixture.detectChanges();

      tick(500);
      expect(overlayContainerElement.querySelector('.vts-mention-dropdown')).toBeFalsy();
    }));
  });

  describe('property', () => {
    let fixture: ComponentFixture<VtsTestPropertyMentionComponent>;
    let textarea: HTMLTextAreaElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(VtsTestPropertyMentionComponent);
      fixture.detectChanges();
      textarea = fixture.debugElement.query(By.css('textarea')).nativeElement;
    });

    it('should open the dropdown when the async load suggestions', fakeAsync(() => {
      fixture.detectChanges();
      dispatchFakeEvent(textarea, 'click');
      typeInElement('@', textarea);
      fixture.detectChanges();
      fixture.componentInstance.fetchSuggestions();
      fixture.detectChanges();

      tick();
      fixture.detectChanges();
      expect(
        overlayContainerElement.querySelector('.vts-mention-dropdown .vtsicon-loading')
      ).toBeTruthy();
      fixture.detectChanges();
      flush(500);
      fixture.detectChanges();
      expect(
        overlayContainerElement.querySelector('.vts-mention-dropdown .vtsicon-loading')
      ).toBeFalsy();
    }));

    it('should open the dropdown when the type in @ prefix', () => {
      fixture.componentInstance.setArrayPrefix();
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      typeInElement('@', textarea);
      fixture.detectChanges();

      const mention = fixture.componentInstance.mention;

      expect(mention.isOpen).toBe(true);
    });

    it('should emit vtsOnSearchChange when type in @ prefix', () => {
      spyOn(fixture.componentInstance, 'onSearchChange');

      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      typeInElement('@test', textarea);
      fixture.detectChanges();

      expect(fixture.componentInstance.onSearchChange).toHaveBeenCalledTimes(1);

      typeInElement('@test  @', textarea);
      fixture.detectChanges();

      expect(fixture.componentInstance.onSearchChange).toHaveBeenCalledTimes(2);

      typeInElement('@test  @ @', textarea);
      fixture.detectChanges();

      expect(fixture.componentInstance.onSearchChange).toHaveBeenCalledTimes(3);
    });

    it('should open the dropdown when the type in # prefix', () => {
      fixture.componentInstance.setArrayPrefix();
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      typeInElement('#', textarea);
      fixture.detectChanges();

      const mention = fixture.componentInstance.mention;

      expect(mention.isOpen).toBe(true);
    });

    it('should has the custom template in the dropdown', () => {
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      typeInElement('@', textarea);
      fixture.detectChanges();
      expect(overlayContainerElement.querySelector('.vts-mention-dropdown .custom')).toBeTruthy();
    });

    it('should correct parsing the trigger content', () => {
      fixture.componentInstance.setArrayPrefix();
      typeInElement(
        'ABC @Angular 123 @ant-design-git @你好 foo ant@gmail.com @@ng 123 .@.@ /@hello \\@hello #ng',
        textarea
      );
      fixture.detectChanges();
      expect(fixture.componentInstance.mention.getMentions().join(',')).toBe(
        '@Angular,@ant-design-git,@你好,@@ng,#ng'
      );
    });
  });
});

@Component({
  template: `
    <vts-mention [vtsSuggestions]="suggestions">
      <textarea
        *ngIf="!inputTrigger"
        vts-input
        [vtsAutosize]="{ minRows: 4, maxRows: 4 }"
        [(ngModel)]="inputValue"
        vtsMentionTrigger
      ></textarea>
      <input *ngIf="inputTrigger" vts-input [(ngModel)]="inputValue" vtsMentionTrigger />
    </vts-mention>
  `
})
class VtsTestSimpleMentionComponent {
  inputValue: string = '@angular';
  inputTrigger = false;
  suggestions = ['angular', 'ant-design-git', 'mention', '中文', 'にほんご'];
  @ViewChild(VtsMentionComponent, { static: false })
  mention!: VtsMentionComponent;
  @ViewChild(VtsMentionTriggerDirective, { static: false })
  trigger!: VtsMentionTriggerDirective;
}

@Component({
  template: `
    <vts-mention
      [vtsSuggestions]="webFrameworks"
      [vtsValueWith]="valueWith"
      [vtsPrefix]="prefix"
      [vtsPlacement]="'top'"
      [vtsLoading]="loading"
      (vtsOnSearchChange)="onSearchChange()"
    >
      <textarea
        vts-input
        [vtsAutosize]="{ minRows: 4, maxRows: 4 }"
        [(ngModel)]="inputValue"
        vtsMentionTrigger
      ></textarea>
      <ng-container *vtsMentionSuggestion="let framework">
        <span class="custom">{{ framework.name }} - {{ framework.type }}</span>
      </ng-container>
    </vts-mention>
  `
})
class VtsTestPropertyMentionComponent {
  inputValue: string = '@angular';
  webFrameworks = [
    { name: 'React', type: 'JavaScript' },
    { name: 'Angular', type: 'JavaScript' },
    { name: 'Laravel', type: 'PHP' },
    { name: 'Flask', type: 'Python' },
    { name: 'Django', type: 'Python' }
  ];
  loading = false;
  prefix: string | string[] = '@';
  valueWith = (data: { name: string; type: string }) => data.name;
  @ViewChild(VtsMentionComponent, { static: false })
  mention!: VtsMentionComponent;
  @ViewChild(VtsMentionTriggerDirective, { static: false })
  trigger!: VtsMentionTriggerDirective;

  setArrayPrefix(): void {
    this.prefix = ['@', '#'];
  }

  onSearchChange(): void {
    // noop
  }

  fetchSuggestions(): void {
    this.webFrameworks = [];
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.webFrameworks = [
        { name: 'React', type: 'JavaScript' },
        { name: 'Angular', type: 'JavaScript' },
        { name: 'Laravel', type: 'PHP' },
        { name: 'Flask', type: 'Python' },
        { name: 'Django', type: 'Python' }
      ];
    }, 500);
  }
}

import { Component, OnInit, OnDestroy, Input, ElementRef, Renderer2 } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { VtsBlockUIService } from './block-ui.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VtsBlockUIConfig } from './pro-layout.types';

@Component({
    selector: 'block-ui',
    templateUrl: 'block-ui.component.html',
    styles: [
        `
            .main-row {
                overflow-x: hidden;    
            }

            ::ng-deep .code-box {
                height: 800px;
            }
        `
    ]
})

export class VtsBlockUIComponent implements OnInit, OnDestroy {
    constructor(
        public elementRef: ElementRef, 
        private blockUIService: VtsBlockUIService,
        private renderer: Renderer2
    ) { 
        this.renderer.addClass(this.elementRef.nativeElement, 'vts-block-ui');
    }

    isShowInput: boolean = false;
    /**
     *  currently locked if true, otherwise not locked
     * */ 
    isLockOrUnlock: boolean = false;
    form: FormGroup = new FormGroup({
        password: new FormControl("", Validators.required)
    });
    modalTitle: string = "";
    submitText: string = "";
    inputType: "password" | "text" = "password";

    
    @Input() vtsBlockUIConfig: VtsBlockUIConfig = {
        isEnabled: true,
        modalLockTitle: "Khóa màn hình",
        modalUnlockTitle: "Mở khóa màn hình",
        cancelText: "Hủy",
        locktext: "Khóa",
        unlockText: "Mở khóa"
    }

    private lockStateSubscription = Subscription.EMPTY;
    private visibleInputPassSubscription = Subscription.EMPTY;
    private timerSubscription = Subscription.EMPTY;
    /**
     * current hour, minute shown when ui is locked
     */
    hour: string = '0';
    minute: string = '0';

    ngOnDestroy(): void {
        this.lockStateSubscription.unsubscribe();
        this.visibleInputPassSubscription.unsubscribe();
        this.timerSubscription.unsubscribe();
    }

    ngOnInit() { 
        this.lockStateSubscription = this.blockUIService.lockUIStateChange$.subscribe((isLocked: boolean) => {
            if(isLocked){
                this.isShowInput = false;
                this.isLockOrUnlock = true;
                this.setCurrentTime();
            }
            else {
                this.isShowInput = false;
                this.isLockOrUnlock = false;
            }
        })
        this.visibleInputPassSubscription = this.blockUIService.showInputChange$.subscribe((isShow: boolean) => {
            this.isShowInput = isShow;
            if(isShow){
                let modalTitle = this.isLockOrUnlock ? this.vtsBlockUIConfig.modalUnlockTitle : this.vtsBlockUIConfig.modalLockTitle;
                let submitText = this.isLockOrUnlock ? this.vtsBlockUIConfig.unlockText : this.vtsBlockUIConfig.locktext;
                this.modalTitle = modalTitle ? modalTitle : "";
                this.submitText = submitText ? submitText : "";
                this.form.reset();
            }
        });
        // update time each minute
        this.timerSubscription = timer(1000, 60000).subscribe(() => {
            if(this.isLockOrUnlock){
                let minute = parseInt(this.minute) + 1;
                if(minute >= 60){
                    this.minute = this.numberToString(minute - 60);
                    this.hour = this.numberToString(parseInt(this.hour)+1);
                }
                else this.minute = this.numberToString(minute);
            }
        });
    }

    showInput(){
        this.blockUIService.showInputPassword();
    }

    submit(){
        if(this.isLockOrUnlock){
            this.blockUIService.unlockScreen(this.form.get('password')?.value);
        }
        else this.blockUIService.lockScreen(this.form.get('password')?.value);
    }

    hideInput(){
        this.blockUIService.hideInputPassword();
    }

    onChangeInputType(){
        if(this.inputType == "password"){
            this.inputType = "text";
        }
        else {
            this.inputType = "password";
        }
    }

    /**
     * set hour and minute to current time
     */
    setCurrentTime(){
        this.hour = this.numberToString((new Date()).getHours());
        this.minute = this.numberToString((new Date()).getMinutes());
    }

    /**
     * turn number into displaying time string
     */
    private numberToString(num: number): string {
        if(num >= 0 && num < 10){
            return `0${num}`;
        }
        else {
            return num.toString();
        }
    }
}
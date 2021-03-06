/*
ionic-pullup v2 for Ionic/Angular 2
 
Copyright 2016 Ariel Faur (https://github.com/arielfaur)
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import { ChangeDetectionStrategy, Component, EventEmitter, ElementRef, Renderer, ViewChild, Output, Input } from '@angular/core';
import { Platform } from 'ionic-angular';
export var IonPullUpFooterState;
(function (IonPullUpFooterState) {
    IonPullUpFooterState[IonPullUpFooterState["Collapsed"] = 0] = "Collapsed";
    IonPullUpFooterState[IonPullUpFooterState["Expanded"] = 1] = "Expanded";
    IonPullUpFooterState[IonPullUpFooterState["Minimized"] = 2] = "Minimized";
})(IonPullUpFooterState || (IonPullUpFooterState = {}));
export var IonPullUpFooterBehavior;
(function (IonPullUpFooterBehavior) {
    IonPullUpFooterBehavior[IonPullUpFooterBehavior["Hide"] = 0] = "Hide";
    IonPullUpFooterBehavior[IonPullUpFooterBehavior["Expand"] = 1] = "Expand";
})(IonPullUpFooterBehavior || (IonPullUpFooterBehavior = {}));
var IonPullUpComponent = (function () {
    function IonPullUpComponent(platform, el, renderer) {
        this.platform = platform;
        this.el = el;
        this.renderer = renderer;
        this.stateChange = new EventEmitter();
        this.onExpand = new EventEmitter();
        this.onCollapse = new EventEmitter();
        this.onMinimize = new EventEmitter();
        this._footerMeta = {
            height: 0,
            posY: 0,
            lastPosY: 0
        };
        this._currentViewMeta = {};
        // sets initial state
        this.initialState = this.initialState || IonPullUpFooterState.Collapsed;
        this.defaultBehavior = this.defaultBehavior || IonPullUpFooterBehavior.Expand;
        this.maxHeight = this.maxHeight || 0;
    }
    IonPullUpComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.debug('ionic-pullup => Initializing footer...');
        window.addEventListener("orientationchange", function () {
            console.debug('ionic-pullup => Changed orientation => updating');
            _this.updateUI();
        });
        this.platform.resume.subscribe(function () {
            console.debug('ionic-pullup => Resumed from background => updating');
            _this.updateUI();
        });
    };
    IonPullUpComponent.prototype.ngAfterContentInit = function () {
        this.computeDefaults();
        this.state = IonPullUpFooterState.Collapsed;
        this.updateUI(true); // need to indicate whether it's first run to avoid emitting events twice due to change detection
    };
    Object.defineProperty(IonPullUpComponent.prototype, "expandedHeight", {
        get: function () {
            return window.innerHeight - this._currentViewMeta.headerHeight;
        },
        enumerable: true,
        configurable: true
    });
    IonPullUpComponent.prototype.computeDefaults = function () {
        this._footerMeta.defaultHeight = this.childFooter.nativeElement.offsetHeight;
        // TODO: still need to test with tabs template (not convinced it is a valid use case...)
        this._currentViewMeta.tabs = this.el.nativeElement.closest('ion-tabs');
        this._currentViewMeta.tabsHeight = this._currentViewMeta.tabs ? this._currentViewMeta.tabs.querySelector('.tabbar').offsetHeight : 0;
        console.debug(this._currentViewMeta.tabsHeight ? 'ionic-pullup => Tabs detected' : 'ionic.pullup => View has no tabs');
        //this._currentViewMeta.hasBottomTabs = this._currentViewMeta.tabs && this._currentViewMeta.tabs.classList.contains('tabs-bottom');
        this._currentViewMeta.header = document.querySelector('ion-navbar.toolbar');
        this._currentViewMeta.headerHeight = this._currentViewMeta.header ? this._currentViewMeta.header.offsetHeight : 0;
    };
    IonPullUpComponent.prototype.computeHeights = function (isInit) {
        if (isInit === void 0) { isInit = false; }
        this._footerMeta.height = this.maxHeight > 0 ? this.maxHeight : this.expandedHeight;
        this.renderer.setElementStyle(this.childFooter.nativeElement, 'height', this._footerMeta.height + 'px');
        // TODO: implement minimize mode
        //this.renderer.setElementStyle(this.el.nativeElement, 'min-height', this._footerMeta.height + 'px'); 
        //if (this.initialState == IonPullUpFooterState.Minimized) {
        //  this.minimize()  
        //} else {
        this.collapse(isInit);
        //} 
    };
    IonPullUpComponent.prototype.updateUI = function (isInit) {
        var _this = this;
        if (isInit === void 0) { isInit = false; }
        setTimeout(function () {
            _this.computeHeights(isInit);
        }, 300);
        this.renderer.setElementStyle(this.childFooter.nativeElement, 'transition', 'none'); // avoids flickering when changing orientation
    };
    IonPullUpComponent.prototype.expand = function () {
        this._footerMeta.lastPosY = 0;
        this.renderer.setElementStyle(this.childFooter.nativeElement, '-webkit-transform', 'translate3d(0, 0, 0)');
        this.renderer.setElementStyle(this.childFooter.nativeElement, 'transform', 'translate3d(0, 0, 0)');
        this.renderer.setElementStyle(this.childFooter.nativeElement, 'transition', '300ms ease-in-out');
        this.onExpand.emit(null);
    };
    IonPullUpComponent.prototype.collapse = function (isInit) {
        if (isInit === void 0) { isInit = false; }
        this._footerMeta.lastPosY = this._footerMeta.height - this._footerMeta.defaultHeight - this._currentViewMeta.tabsHeight;
        this.renderer.setElementStyle(this.childFooter.nativeElement, '-webkit-transform', 'translate3d(0, ' + this._footerMeta.lastPosY + 'px, 0)');
        this.renderer.setElementStyle(this.childFooter.nativeElement, 'transform', 'translate3d(0, ' + this._footerMeta.lastPosY + 'px, 0)');
        if (!isInit)
            this.onCollapse.emit(null);
    };
    IonPullUpComponent.prototype.minimize = function () {
        this._footerMeta.lastPosY = this._footerMeta.height;
        this.renderer.setElementStyle(this.childFooter.nativeElement, '-webkit-transform', 'translate3d(0, ' + this._footerMeta.lastPosY + 'px, 0)');
        this.renderer.setElementStyle(this.childFooter.nativeElement, 'transform', 'translate3d(0, ' + this._footerMeta.lastPosY + 'px, 0)');
        this.onMinimize.emit(null);
    };
    IonPullUpComponent.prototype.onTap = function (e) {
        e.preventDefault();
        if (this.state == IonPullUpFooterState.Collapsed) {
            if (this.defaultBehavior == IonPullUpFooterBehavior.Hide)
                this.state = IonPullUpFooterState.Minimized;
            else
                this.state = IonPullUpFooterState.Expanded;
        }
        else {
            if (this.state == IonPullUpFooterState.Minimized) {
                if (this.defaultBehavior == IonPullUpFooterBehavior.Hide)
                    this.state = IonPullUpFooterState.Collapsed;
                else
                    this.state = IonPullUpFooterState.Expanded;
            }
            else {
                // footer is expanded
                this.state = this.initialState == IonPullUpFooterState.Minimized ? IonPullUpFooterState.Minimized : IonPullUpFooterState.Collapsed;
            }
        }
    };
    IonPullUpComponent.prototype.onDrag = function (e) {
        e.preventDefault();
        switch (e.type) {
            case 'panstart':
                this.renderer.setElementStyle(this.childFooter.nativeElement, 'transition', 'none');
                break;
            case 'pan':
                this._footerMeta.posY = Math.round(e.deltaY) + this._footerMeta.lastPosY;
                if (this._footerMeta.posY < 0 || this._footerMeta.posY > this._footerMeta.height)
                    return;
                this.renderer.setElementStyle(this.childFooter.nativeElement, '-webkit-transform', 'translate3d(0, ' + this._footerMeta.posY + 'px, 0)');
                this.renderer.setElementStyle(this.childFooter.nativeElement, 'transform', 'translate3d(0, ' + this._footerMeta.posY + 'px, 0)');
                break;
            case 'panend':
                this.renderer.setElementStyle(this.childFooter.nativeElement, 'transition', '300ms ease-in-out');
                if (this._footerMeta.lastPosY > this._footerMeta.posY) {
                    this.state = IonPullUpFooterState.Expanded;
                }
                else if (this._footerMeta.lastPosY < this._footerMeta.posY) {
                    this.state = (this.initialState == IonPullUpFooterState.Minimized) ? IonPullUpFooterState.Minimized : IonPullUpFooterState.Collapsed;
                }
                break;
        }
    };
    IonPullUpComponent.prototype.ngDoCheck = function () {
        var _this = this;
        if (!Object.is(this.state, this._oldState)) {
            switch (this.state) {
                case IonPullUpFooterState.Collapsed:
                    this.collapse();
                    break;
                case IonPullUpFooterState.Expanded:
                    this.expand();
                    break;
                case IonPullUpFooterState.Minimized:
                    this.minimize();
                    break;
            }
            this._oldState = this.state;
            // TODO: fix hack due to BUG (https://github.com/angular/angular/issues/6005)
            window.setTimeout(function () {
                _this.stateChange.emit(_this.state);
            });
        }
    };
    return IonPullUpComponent;
}());
export { IonPullUpComponent };
IonPullUpComponent.decorators = [
    { type: Component, args: [{
                selector: 'ion-pullup',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: "\n    <ion-footer #footer>\n      <ng-content></ng-content>\n    </ion-footer>\n    "
            },] },
];
/** @nocollapse */
IonPullUpComponent.ctorParameters = function () { return [
    { type: Platform, },
    { type: ElementRef, },
    { type: Renderer, },
]; };
IonPullUpComponent.propDecorators = {
    'state': [{ type: Input },],
    'stateChange': [{ type: Output },],
    'initialState': [{ type: Input },],
    'defaultBehavior': [{ type: Input },],
    'maxHeight': [{ type: Input },],
    'onExpand': [{ type: Output },],
    'onCollapse': [{ type: Output },],
    'onMinimize': [{ type: Output },],
    'childFooter': [{ type: ViewChild, args: ['footer',] },],
};
//# sourceMappingURL=ion-pullup.js.map
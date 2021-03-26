import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';
import { IonPullUpComponent } from './ion-pullup';
import { IonPullUpTabComponent } from './ion-pullup-tab';
var IonPullupModule = (function () {
    function IonPullupModule() {
    }
    return IonPullupModule;
}());
export { IonPullupModule };
IonPullupModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, IonicModule],
                declarations: [
                    IonPullUpComponent,
                    IonPullUpTabComponent
                ],
                exports: [
                    IonPullUpComponent,
                    IonPullUpTabComponent
                ],
                providers: [],
                schemas: [CUSTOM_ELEMENTS_SCHEMA]
            },] },
];
/** @nocollapse */
IonPullupModule.ctorParameters = function () { return []; };
//# sourceMappingURL=ion-pullup.module.js.map
/* eslint-disable @typescript-eslint/no-explicit-any */
import {Observable} from '@apollo/client/core';
import { Injectable, ViewContainerRef, ComponentRef, Injector, ComponentFactoryResolver, TemplateRef, ViewRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { TranslateService } from '@ngx-translate/core';
import { IDialogRef, TDialogTempRef, TDialogCompRef, ILanguage } from '../models';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let $: any;

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  vcRefRoot: ViewContainerRef;

  constructor(
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
    private iziToast: ToastrService,
    private translateService: TranslateService
  ) { }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get JQuery(): any {
    return $;
  }

  /**
   * register vc for appcomponets on load
   *
   * @param vc - view containerref
   */
  set rootVcRef(vc: ViewContainerRef) {
    this.vcRefRoot = vc;
  }

  // error toaster
  toastrError(message: string): void {
    this.iziToast.error(message);
  }

  // error toaster
  toastrWarning(message: string): void {
    this.iziToast.warning(message);
  }

  // success Toastr
  toastrSuccess(message: string): void {
    this.iziToast.success(message);
  }

  // destroy toaster
  toastrDismiss(): void {
    // this.iziToast.destroy();
  }

  // parse GraphQl Errors
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  parseGraphQlError(graphQLErrors): Error {
    try {
      return graphQLErrors[0];
    } catch {
      return {
        message: 'Something wrong happened',
        name: 'CLIENT_PARSE_ERROR'
      };
    }
  }

  /**
   * Create a component instance from params [ComponentRef]
   *
   * @param ref - ComponentRef
   */
  createComponentOutlet(ref: TDialogCompRef): any {
    const factory = this.componentFactoryResolver.resolveComponentFactory(ref.value);
    const componentRef: ComponentRef<any> = factory.create(this.injector);
    if (ref?.data) {
      (Object.keys(ref?.data)).forEach(element => {
        if (element in ref?.data) {
          componentRef.instance[element] = ref?.data[element];
        }
      });
    }
    const view = componentRef.hostView;
    this.insertInAppViewContainer(view);
    return componentRef.instance;
  }

  /**
   * Create a template reference from param [TemplateRef]
   *
   * @param ref - TemplateRef
   */
  createTemplateRef(ref: TDialogTempRef): void {
    const temRef: TemplateRef<any> = ref.value;
    const view = temRef.createEmbeddedView(null);
    this.insertInAppViewContainer(view);
  }

  /**
   * Insert ComponentRef & TemplateRef in the APP ViewContanerRef
   *
   * @param view - TemplateRef | ComponentRef
   */
  insertInAppViewContainer(view: ViewRef): void {
    this.vcRefRoot.insert(view);
  }

  /**
   * Passing ComponentRef | TemplateRef to open as a dialog
   *
   * @param ref - TemplateRef | ComponentRef
   */
  openMdcDialog(ref: IDialogRef): Observable<{dialog: any; instance: any}> {
    let instance: any;
    if (ref.type === 'template') {
      instance = this.createTemplateRef(ref);
    } else {
      instance = this.createComponentOutlet(ref);
    }
    return this.triggerMdcDialog(instance, ref.data.modelId);
  }

  /**
   * Open ComponentRef | TemplateRef as a dialog
   */
  triggerMdcDialog(instance: any, modelId: string): Observable<{dialog: any; instance: any}> {
    return new Observable((observer) => {
      setTimeout(()=>{
        const dialog = $(`#${modelId}`);
        dialog.modal('toggle'); // Open & close Popup
        // instance.dialog = dialog;
        dialog.on('hidden.bs.modal', () => { // listen modal close event
          this.vcRefRoot.clear();
        });
        observer.next({ dialog, instance });
      },0);
    });
  }

  /**
   * Close MDC Dialog
   *
   * @param dialog - MDCDialog
   */
  closeMdcDialog(dialog: any): void {
    dialog.close();
    this.vcRefRoot.clear();
  }

  getCurrentLanguage(): string {
    const currentStoredLang = localStorage.getItem('lang');
    if(currentStoredLang) {
      const lang: ILanguage = JSON.parse(currentStoredLang);
      return lang.value;
    }
    return this.translateService.getDefaultLang();
  }

}

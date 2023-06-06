import { EmbeddedViewRef, Injectable, ViewContainerRef } from '@angular/core';

import type { AngularComponentOutput } from '../models/angularComponentOutput.interface';

@Injectable()
export class AngularUtilService {

  constructor(private vcr: ViewContainerRef) { }

  createAngularComponent(component: any): AngularComponentOutput {
    // Create a component reference from the component
    const componentRef = this.vcr.createComponent(component);

    // Get DOM element from component
    let domElem;
    const viewRef = (componentRef.hostView as EmbeddedViewRef<any>);
    if (viewRef && Array.isArray(viewRef.rootNodes) && viewRef.rootNodes[0]) {
      domElem = viewRef.rootNodes[0] as HTMLElement;
    }

    return { componentRef, domElement: domElem as HTMLElement };
  }

  createAngularComponentAppendToDom(component: any, targetElement?: HTMLElement | Element, clearTargetContent = false): AngularComponentOutput {
    const componentOutput = this.createAngularComponent(component);

    // Append DOM element to the HTML element specified
    if (targetElement?.appendChild) {
      if (clearTargetContent && targetElement.innerHTML) {
        targetElement.innerHTML = '';
      }
      targetElement.appendChild(componentOutput.domElement);
    } else {
      document.body.appendChild(componentOutput.domElement); // when no target provided, we'll simply add it to the HTML Body
    }

    return componentOutput;
  }
}

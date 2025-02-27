import {
  Injectable,
  ComponentRef,
  createComponent,
  ApplicationRef,
  EnvironmentInjector,
  inject,
} from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private appRef = inject(ApplicationRef);
  private environmentInjector = inject(EnvironmentInjector);

  private containerElement: HTMLElement | null = null;

  private ensureContainer() {
    if (!this.containerElement) {
      this.containerElement = document.createElement('div');
      document.body.appendChild(this.containerElement);
    }
  }

  open<T, R = void>(component: any, data?: T): Observable<R | undefined> {
    this.ensureContainer();
    if (!this.containerElement) return new Observable();

    // Dynamically create the dialog component.
    const componentRef = createComponent(component, {
      environmentInjector: this.environmentInjector,
    });
    const dialogInstance = componentRef.instance as any;

    // Pass data to the dialog component.
    if (data && dialogInstance.dialogData)
      try {
        dialogInstance.dialogData.set(data);
      } catch (error) {
        console.error('Failed to set dialog data: ', error);
      }

    // Create a Subject to return the result
    const closeSubject = new Subject<R | undefined>();

    // Close dialog signal listener.
    let subscriptionDialogClose: Subscription | null = null;
    if (dialogInstance.dialogClose)
      subscriptionDialogClose = dialogInstance.dialogClose.subscribe(
        (result: R | undefined) => {
          closeSubject.next(result);
          closeSubject.complete();
          this.close(componentRef);
          subscriptionDialogClose?.unsubscribe();
        },
      );

    // Attach the component to the application view.
    this.appRef.attachView(componentRef.hostView);

    // Add the dialog to the container element.
    const dialogElement = componentRef.location.nativeElement;
    this.containerElement.appendChild(dialogElement);

    return closeSubject.asObservable();
  }

  private close(componentRef: ComponentRef<any>) {
    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();

    // Remove container if no dialogs are left.
    if (this.containerElement?.childElementCount === 0) {
      this.containerElement.remove();
      this.containerElement = null;
    }
  }
}

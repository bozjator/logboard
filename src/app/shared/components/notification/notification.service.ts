import {
  Injectable,
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  inject,
} from '@angular/core';
import { NotificationComponent } from './notification.component';
import { AlertType } from '../alert.component';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private appRef = inject(ApplicationRef);
  private environmentInjector = inject(EnvironmentInjector);

  private notificationStack: ComponentRef<NotificationComponent>[] = [];
  private containerElement: HTMLElement | null = null;

  private ensureContainer() {
    if (!this.containerElement) {
      this.containerElement = document.createElement('div');
      this.containerElement.className = 'notification-container';
      document.body.appendChild(this.containerElement);
    }
  }

  show(
    message: string,
    data?: { title?: string; type?: AlertType; duration?: number },
  ) {
    this.ensureContainer();
    if (!this.containerElement) return;

    const duration = data?.duration ?? 9000;

    const componentRef = createComponent(NotificationComponent, {
      environmentInjector: this.environmentInjector,
    });

    componentRef.instance.title = data?.title ?? '';
    componentRef.instance.message = message;
    componentRef.instance.type = data?.type ?? AlertType.gray;
    componentRef.instance.close.subscribe(() =>
      this.removeNotification(componentRef),
    );

    // Attach the component to the appRef for rendering.
    this.appRef.attachView(componentRef.hostView);

    // Append the notification to the container.
    this.containerElement.appendChild(componentRef.location.nativeElement);

    this.notificationStack.push(componentRef);

    // Automatically remove after duration.
    setTimeout(() => this.removeNotification(componentRef), duration);
    setTimeout(() => componentRef.instance.removeAnimation(), duration / 2);
  }

  private removeNotification(
    componentRef: ComponentRef<NotificationComponent>,
  ) {
    const index = this.notificationStack.indexOf(componentRef);
    if (index !== -1) {
      this.notificationStack.splice(index, 1);
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    }

    // Remove the container if it's empty.
    if (this.notificationStack.length === 0 && this.containerElement) {
      this.containerElement.remove();
      this.containerElement = null;
    }
  }
}

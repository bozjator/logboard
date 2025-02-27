import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MainToolbarComponent } from './main-toolbar.component';
import { MonitoringLogsComponent } from './monitoring-logs/monitoring-logs.component';
import { MonitoringGeneralComponent } from './monitoring-general/monitoring-general.component';

@Component({
  selector: 'app-board',
  imports: [
    CommonModule,
    MainToolbarComponent,
    MonitoringLogsComponent,
    MonitoringGeneralComponent,
  ],
  template: `
    <div class="flex flex-wrap items-center justify-between">
      <h1
        class="p-1 text-3xl font-bold text-zinc-700 underline dark:text-zinc-400"
      >
        Logboard
      </h1>
      <app-main-toolbar />
    </div>

    <div
      class="mx-1 mt-4 flex justify-center space-x-4 border-b border-b-zinc-400 text-center text-gray-500 sm:inline-flex sm:justify-start dark:border-b-zinc-600 dark:text-gray-100"
    >
      <ng-template #tab let-text="text" let-tabViewIndex="tabViewIndex">
        <a
          (click)="viewIndex.set(tabViewIndex)"
          class="cursor-pointer border-b-2 p-2 text-sm font-medium whitespace-nowrap"
          [ngClass]="{
            'border-blue-500 text-blue-600 dark:text-blue-500':
              viewIndex() === tabViewIndex,
            'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:hover:border-gray-400 dark:hover:text-gray-400':
              viewIndex() !== tabViewIndex,
          }"
          >{{ text }}</a
        >
      </ng-template>
      <ng-template
        [ngTemplateOutlet]="tab"
        [ngTemplateOutletContext]="{
          text: 'Logger logs',
          tabViewIndex: view.logger,
        }"
      />
      <ng-template
        [ngTemplateOutlet]="tab"
        [ngTemplateOutletContext]="{
          text: 'General logs',
          tabViewIndex: view.general,
        }"
      />
    </div>

    @if (viewIndex() === view.logger) {
      <app-monitoring-logs />
    } @else {
      <app-monitoring-general />
    }
  `,
})
export class BoardComponent {
  view = {
    logger: 0,
    general: 1,
  };
  viewIndex = signal(this.view.logger);
}

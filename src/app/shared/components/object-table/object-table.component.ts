import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CamelCaseToTitlePipe } from '../../pipes/camel-case-to-title.pipe';

@Component({
  selector: 'app-object-table',
  imports: [CommonModule, CamelCaseToTitlePipe],
  templateUrl: './object-table.component.html',
})
export class ObjectLogsTableComponent {
  objects = input<object[]>([]);
  objectsItems = computed(() =>
    this.objects().map((item) =>
      Object.entries(item).map((item) => {
        const itemValue = item[1];
        if (typeof itemValue === 'object')
          return [item[0], JSON.stringify(itemValue)];
        else return item;
      }),
    ),
  );
}

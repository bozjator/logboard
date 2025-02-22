import { CommonModule } from '@angular/common';
import {
  Component,
  OnChanges,
  SimpleChanges,
  signal,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  imports: [CommonModule],
})
export class PaginationComponent implements OnChanges {
  readonly onPageNumberChange = output<number>();
  readonly onPageItemsChange = output<number>();

  readonly pageNumber = input<number>(1);
  readonly pageItems = input<number>(9);
  readonly totalCount = input<number>(0);
  readonly itemsPerPageList = input<number[]>([5, 10, 15, 50, 100]);

  itemsFrom = signal(1);
  itemsTo = signal(10);
  totalPages = signal(1);
  pageNumbers: (number | string)[] = [];

  showDropdownItemsPerPage = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    this.totalPages.set(Math.ceil(this.totalCount() / this.pageItems()));
    this.calculateFromTo();
    this.calculatePageNumbers();
    if (this.itemsFrom() > this.itemsTo())
      setTimeout(() => this.emitPageNumber(1), 1);
  }

  private calculateFromTo() {
    const itemsTo = this.pageItems() * this.pageNumber();
    const totalCount = this.totalCount();
    this.itemsTo.set(itemsTo < totalCount ? itemsTo : totalCount);
    const itemsFrom = (this.pageNumber() - 1) * this.pageItems() + 1;
    this.itemsFrom.set(totalCount === 0 ? 0 : itemsFrom);
  }

  private calculatePageNumbers() {
    const totalPages = this.totalPages();
    const currentPage = this.pageNumber();
    const delta = 2;
    const range = [];

    if (totalPages === 0) {
      this.pageNumbers = [1];
      return;
    }

    // Create the range of pages around the current page
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Add leading ellipsis if necessary
    if (currentPage - delta > 2) {
      range.unshift('...');
      range.unshift(Math.max(1, currentPage - delta - 3)); // Jump back 3 pages
    }

    // Add trailing ellipsis if necessary
    if (currentPage + delta < totalPages - 1) {
      range.push('...');
      range.push(Math.min(totalPages, currentPage + delta + 3)); // Jump forward 3 pages
    }

    // Always include the first and last pages
    if (range[0] !== 1) {
      range.unshift(1);
    }
    if (range[range.length - 1] !== totalPages) {
      range.push(totalPages);
    }

    this.pageNumbers = range;
  }

  onNextPage(): void {
    const nextPageNumber = this.pageNumber() + 1;
    if (nextPageNumber > this.totalPages()) return;
    this.emitPageNumber(nextPageNumber);
  }

  onPreviousPage(): void {
    const previousPageNumber = this.pageNumber() - 1;
    if (previousPageNumber < 1) return;
    this.emitPageNumber(previousPageNumber);
  }

  emitPageNumber(pageNumber: number | any) {
    this.onPageNumberChange.emit(pageNumber);
  }

  onChangeItemsPerPage(pageItems: number) {
    this.onPageItemsChange.emit(pageItems);
    this.showDropdownItemsPerPage.set(false);
  }
}

import { SortOrder } from './sort-order.enum';

export interface PaginationQuery {
  pageNumber: number;
  pageItems: number;
  sortOrder: SortOrder;
}

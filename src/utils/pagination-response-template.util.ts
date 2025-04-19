export class PaginationResponseTemplate<T> {
  list: T[];
  page: number;
  limit: number;
  total: number;

  constructor(
      list: T[],
      page: number,
      limit: number,
      total: number
  ) {
      this.list = list;
      this.page = page ?? 1;
      this.limit = limit ?? -1;
      this.total = total;
  }
}
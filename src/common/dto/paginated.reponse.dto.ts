export class PaginationParams {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export class PaginatedResponseDto<T> {
  docs: T[];
  meta: PaginationParams;

  constructor(docs: T[], meta: PaginationParams) {
    this.docs = docs;
    this.meta = meta;
  }
}

export const createPaginationMeta = (
  totalItems: number,
  page: number,
  limit: number,
): PaginationParams => {
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    page,
    limit,
    totalDocs: totalItems,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
};

export type ApiStatus = "success" | "error";

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
};
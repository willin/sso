export type Paginated<T> = {
  data: T[];
  total: number;
  page: number;
  size: number;
};

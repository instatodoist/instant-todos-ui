
export interface IGql<T> {
  data: T;
  loading: boolean;
  networkStatus: number;
}

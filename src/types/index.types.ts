export type NotNullKeys<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

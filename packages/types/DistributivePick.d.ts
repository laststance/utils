declare type DistributivePick<T, K extends keyof T> = T extends any
  ? Pick<T, K>
  : never

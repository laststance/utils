declare type allKeys<T> = T extends any ? keyof T : never

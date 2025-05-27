// skip unnecessary generics position
declare type _ = any

declare type TODO = any

declare type AnyFunction = (...args: any[]) => any

declare type CastAny<T, CastTo> = IsAny<T, CastTo, T>

declare type Falsy = false | 0 | 0n | '' | null | undefined | typeof NaN

// https://www.youtube.com/shorts/2lCCKiWGlC0
declare type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

// from https://github.com/denoland/deno_std/issues/1126#issuecomment-900947143
declare type Typify<T> = { [K in keyof T]: T[K] }

// https://stackoverflow.com/a/69288824/8440230
declare type Expand<T> = T extends (...args: infer A) => infer R
  ? (...args: Expand<A>) => Expand<R>
  : T extends infer O
    ? { [K in keyof O]: O[K] }
    : never

declare type ExpandRecursively<T> = T extends (...args: infer A) => infer R
  ? (...args: ExpandRecursively<A>) => ExpandRecursively<R>
  : T extends object
    ? T extends infer O
      ? { [K in keyof O]: ExpandRecursively<O[K]> }
      : never
    : T

declare type IndexSignature<O extends object> = {
  [P in keyof O]: O[P]
}

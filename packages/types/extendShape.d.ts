/**
 * Combines two object types, `A` and `B`, into a new object type.
 * The resulting object type contains all properties from `A` that are not present in `B`,
 * as well as all properties from `B`.
 *
 * @example
 * ```typescript
 * type Person = {
 *   name: string;
 *   age: number;
 * };
 *
 * type Address = {
 *   street: string;
 *   city: string;
 * };
 *
 * type ExtendedShape = extendShape<Person, Address>;
 *
 * // ExtendedShape will be:
 * // {
 * //   name: string;
 * //   age: number;
 * //   street: string;
 * //   city: string;
 * // }
 * ```
 *
 * @template A - The first object type.
 * @template B - The second object type.
 * @typedef extendShape
 * @type {object}
 */
declare type extendShape<A extends object, B extends object> = {
  [K in keyof A as K extends keyof B ? never : K]: A[K]
} & {
  [K in keyof B]: B[K]
}

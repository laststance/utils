export function isNullish2(arg: any): boolean {
  const sym = Symbol('true')
  const result = arg ?? sym
  return result === sym
}

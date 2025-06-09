export function positiveIntegerSum(n) {
  if (0 >= n) return false

  for (var total = 0; n > 0; n--) {
    total += n
  }

  return total
}

export default function transformer(file, api) {
  const j = api.jscodeshift
  const { expression } = j.template

  return j(file.source)
    .find(j.BinaryExpression, { operator: '==' })
    .replaceWith((p) => {
      const { left, right } = p.value

      return expression`${left} === ${right}`
    })
    .toSource()
}

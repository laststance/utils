const map = new Map()

map.set('item', { corn: 'green' })

const item = map.get('item')
console.log(map.delete('item'))
console.log(map.has('item'))
console.log(map.size)

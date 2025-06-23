import { removeSpecialCharacters } from '../removeSpecialCharacters'

describe('removeSpecialCharacters', () => {
  test('全て許可された文字で構成された文字列を与えた場合は変化なし', () => {
    const str = 'あア漢字abc123ＡＢＣ１２３_'
    const result = removeSpecialCharacters(str)
    expect(result).toBe('あア漢字abc123ＡＢＣ１２３_')
  })

  test('ひらがな', () => {
    const str = 'あいうえお'
    const result = removeSpecialCharacters(str)
    expect(result).toBe('あいうえお')
  })

  test('カタカナ', () => {
    const str = 'アイウエオ'
    const result = removeSpecialCharacters(str)
    expect(result).toBe('アイウエオ')
  })

  test('漢字', () => {
    const str = '漢字'
    const result = removeSpecialCharacters(str)
    expect(result).toBe('漢字')
  })

  test('半角 & 全角英数字', () => {
    const str = 'abc123ＡＢＣ１２３'
    const result = removeSpecialCharacters(str)
    expect(result).toBe('abc123ＡＢＣ１２３')
  })

  test('アンダースコア', () => {
    const str = '_'
    const result = removeSpecialCharacters(str)
    expect(result).toBe('_')
  })

  test('全て特殊文字の場合は空文字が返却される', () => {
    const str = '!@#$%^&*()'
    const result = removeSpecialCharacters(str)
    expect(result).toBe('')
  })

  test('半角スペース', () => {
    const str = '   '
    const result = removeSpecialCharacters(str)
    expect(result).toBe('')
  })

  test('.,;:!?', () => {
    const str = '.,;:!?'
    const result = removeSpecialCharacters(str)
    expect(result).toBe('')
  })

  test('空文字', () => {
    const str = ''
    const result = removeSpecialCharacters(str)
    expect(result).toBe('')
  })

  test('許可された文字、特殊文字が混成した文字列から特殊文字のみが取り除かれる', () => {
    const str = 'あア漢字abc123ＡＢＣ１２３_!@#$%^&*()'
    const result = removeSpecialCharacters(str)
    expect(result).toBe('あア漢字abc123ＡＢＣ１２３_')
  })
})

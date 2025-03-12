const splice = (text : string, start : number, delCount :number, newSubStr : string) => (
  text.slice(0, start) + newSubStr + text.slice(start + Math.abs(delCount))
)

const limitTextBySentence = (text: string, sentencesToShow: number, ellipsis = true) => {
  if (!text) return null
  if (ellipsis) sentencesToShow -= 1

  const sentences = text.split('.')

  if (sentences.length > sentencesToShow) {
    const truncatedSentences = sentences.slice(0, sentencesToShow)
    const truncatedText = truncatedSentences.join('.') + (ellipsis ? '...' : '')

    return truncatedText
  } else {
    return text
  }
}

const limitTextByCharacter = (text: string, charactersToShow: number, ellipsis = true) => {
  if (!text) return null
  if (ellipsis) charactersToShow -= 1

  if (text.length > charactersToShow) {
    const truncatedText = text.slice(0, charactersToShow) + (ellipsis ? '...' : '')

    return truncatedText
  } else {
    return text
  }
}

const padStart = (number: number | string, fill = '0', length = 2) => {
  let text = '' + number
  while (text.length < length) text = fill + text
  return text
}

const spanify = (text: string, spanLetter = true, spanInnerLetter = false) => {
  const spnf = (t: string, cN: string) => `<span class="${cN}">${t}</span>`
  const letter = (l: string) => (spanInnerLetter ? spnf(spnf(l, 'letter'), 'inner-letter') : spnf(l, 'letter'))
  const letters = (w: string) => (spanLetter ? w.split('').map(letter).join('') : spnf(w, 'inner-word'))
  const words = (w: string) => (spnf(letters(w), 'word'))
  return text.split(' ').map(words).join(' ')
}

const _capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

const capitalize = (text: string, first = false) => {
  if (first) return _capitalize(text)
  return text.split(/(.*?(?:[ '-]|$))/g).map(_capitalize).join('')
}

const slugify = (text : string) => {
  if (!text) return ''
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

let _div : HTMLDivElement
const div = () => (_div || (_div = document.createElement('div')))

const escape = (text : string) => {
  div().textContent = text
  div().innerText = text
  return div().innerHTML
}

const encodeURLParams = (object : object) => Object.entries(object)
  .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
  .join('&')

const decodeURLParams = (text : string) => text && text.split('&')
  .reduce((memo, key) => {
    const split = key.split('=')
    memo[decodeURIComponent(split[0])] = decodeURIComponent(split[1])
    return memo
  }, {} as Record<string, string>)

export default {
  slugify,
  splice,
  limitTextBySentence,
  limitTextByCharacter,
  spanify,
  capitalize,
  escape,
  padStart,
  encodeURLParams,
  decodeURLParams
}

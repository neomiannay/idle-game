import memoize from 'lodash/memoize'

const mouseEvent = (event:any) => {
  if (event.originalEvent) event = event.originalEvent

  if (event && event.touches && event.touches.length > 0)
    return event.touches[0]
  else if (event && event.changedTouches && event.changedTouches.length)
    return event.changedTouches[0]

  return event
}

const webp = memoize(() => {
  const elem = document.createElement('canvas')

  if (elem.getContext && elem.getContext('2d')) {
    // was able or not to get WebP representation
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0
  }

  // very old browser like IE 8, canvas not supported
  return false
})

const findParent = (elem:HTMLElement | Document, selector: string) => {
  for (;elem && elem !== document; elem = elem.parentNode as HTMLElement)
    if ((elem as any).matches(selector)) return elem
}

const isParent = (elem:HTMLElement | Document, parent:HTMLElement | Document) => {
  for (;elem && elem !== document; elem = elem.parentNode as HTMLElement)
    if (elem === parent) return true
  return false
}

const resetElement = (element: HTMLElement) => {
  const clone = element.cloneNode(true)
  element.parentNode?.insertBefore(clone, element)
  element.parentNode?.removeChild(element)
  return clone
}

const offsetTop = function (el: HTMLElement) {
  let offset = el.offsetTop
  if (el.offsetParent) offset += offsetTop(el.offsetParent as HTMLElement)
  return offset
}

const local = () => window && (parseInt(window.location.port) >= 8000)

export {
  offsetTop,
  resetElement,
  mouseEvent,
  findParent,
  isParent,
  webp,
  local
}

import Bowser from 'bowser'

const defaultUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36'

type DetectProps = {
  desktop: boolean
  mobile: boolean
  tablet: boolean
  opera: boolean
  safari: boolean
  edge: boolean
  ie: boolean
  chrome: boolean
  firefox: boolean
  uc_browser: boolean
  brave: boolean
  android: boolean
  ios: boolean
  windows: boolean
  linux: boolean
  macos: boolean
  iphone: boolean
  ipad: boolean
}

const detect : DetectProps = { desktop: true } as DetectProps

const test = (ua?: string) : DetectProps => {
  if (!ua) {
    if (process.browser) ua = window.navigator.userAgent
    else ua = defaultUA
  }

  const _bowser = Bowser.getParser(ua)

  const platform = _bowser.getPlatformType()
  const browser = _bowser.getBrowserName()
  const os = _bowser.getOSName()
  const model = (_bowser.getPlatform().model || '').toLowerCase()

  const hiddenIpad = process.browser && os === 'macOS' && navigator.maxTouchPoints > 1
  const brave = process.browser && !!(navigator as any).brave

  return {
    desktop: platform === 'desktop' && !hiddenIpad,
    mobile: platform === 'mobile',
    tablet: platform === 'tablet' || platform === 'tv' || hiddenIpad,

    opera: browser === 'Opera' || browser === 'Opera Coast',
    safari: browser === 'Safari',
    edge: browser === 'Microsoft Edge',
    ie: browser === 'Internet Explorer',
    chrome: (browser === 'Chrome' || browser === 'Chromium') && !brave,
    firefox: browser === 'Firefox',
    uc_browser: browser === 'UC Browser',
    brave,

    android: os === 'Android',
    ios: os === 'iOS',
    windows: os === 'Windows',
    linux: os === 'Linux',
    macos: os === 'macOS',

    iphone: model === 'iphone',
    ipad: model === 'ipad'
  }
}

const startDetection = (ua?: string) => {
  Object.assign(detect, test(ua))

  if (process.browser) {
    const addClass = (valid: boolean, key: string) => document.documentElement.classList.add((valid ? '' : 'no-') + key)

    addClass(detect.safari, 'safari')
    addClass(detect.firefox, 'firefox')
    addClass(detect.mobile, 'mobile')
    addClass(detect.tablet, 'tablet')
    addClass(detect.desktop, 'desktop')
  }
}

export { startDetection }
startDetection()
export default detect

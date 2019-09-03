let linkElement: HTMLAnchorElement | undefined
export function download(
  filename: string,
  type: string,
  content: string,
  asDataURL: boolean = false,
) {
  if (!linkElement) {
    linkElement = document.createElement('a')
  }

  const dataURL = asDataURL
    ? content
    : `data:${type};charset=UTF-8,${encodeURIComponent(content)}`
  linkElement.setAttribute('href', dataURL)
  linkElement.setAttribute('download', filename)
  linkElement.click()
}

let scrollBarSize
export function getScrollbarSize(shouldRecalculate?: boolean) {
  if (!scrollBarSize || shouldRecalculate) {
    const scrollDiv = document.createElement('div')

    scrollDiv.style.position = 'absolute'
    scrollDiv.style.top = '-9999px'
    scrollDiv.style.width = '50px'
    scrollDiv.style.height = '50px'
    scrollDiv.style.overflow = 'scroll'

    document.body.appendChild(scrollDiv)

    scrollBarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth
    document.body.removeChild(scrollDiv)
  }

  return scrollBarSize
}

export function PopupCenter(url: string, title: string, w: number, h: number) {
  // Fixes dual-screen position                         Most browsers      Firefox
  const dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screenX
  const dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : window.screenY

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width
  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : screen.height

  const systemZoom = width / window.screen.availWidth
  const left = (width - w) / 2 / systemZoom + dualScreenLeft
  const top = (height - h) / 2 / systemZoom + dualScreenTop
  const newWindow = window.open(
    url,
    title,
    'scrollbars=yes, width=' +
      w / systemZoom +
      ', height=' +
      h / systemZoom +
      ', top=' +
      top +
      ', left=' +
      left,
  )

  return newWindow
}

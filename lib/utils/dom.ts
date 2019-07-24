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

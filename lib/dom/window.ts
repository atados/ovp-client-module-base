export const openWindow = (
  url: string,
  windowOptions: { [optionName: string]: any } = {},
): Window | null => {
  const { height = 400, width = 550 } = windowOptions
  const config = {
    width,
    height,
    top:
      window.outerHeight / 2 +
      ((window.screenY || window.screenTop || 0) - height / 2),
    left:
      window.outerWidth / 2 +
      ((window.screenX || window.screenLeft || 0) - width / 2),
    location: 'no',
    toolbar: 'no',
    status: 'no',
    directories: 'no',
    menubar: 'no',
    scrollbars: 'yes',
    resizable: 'no',
    centerscreen: 'yes',
    chrome: 'yes',
    ...windowOptions,
  }

  const stringifiedOptions = Object.keys(config)
    .map(key => `${key}=${config[key]}`)
    .join(', ')

  return window.open(url, '', stringifiedOptions)
}

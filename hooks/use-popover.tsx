interface UsePopoverOptions {
  title: string
  action?: {
    type: 'link'
    text: string
    href: string
    query?: { [key: string]: any }
  }
}

const usePopover = (_: UsePopoverOptions) => {
  throw new Error('usePopover is not implemented yet')
  // useEffect(() => {
  //   if (localStorage.getItem(`@popover/${title}`)) {
  //     return
  //   }

  //   localStorage.setItem(`@popover/${title}`, String(Date.now()))

  // }, [title, timeout])
}

export default usePopover

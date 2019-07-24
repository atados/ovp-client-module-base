import * as React from 'react'
import * as ReactDOM from 'react-dom'
import styled, { keyframes } from 'styled-components'
import MarkdownEditorMenu, {
  EditorMenuMode,
  MarkdownEditorMenuProps,
} from './MarkdownEditorMenu'

const fadeIn = keyframes`
  0% {
    opacity: 0;
    margin-top: -10px;
  }

  100%{
    margin-top: 0;
    opacity: 1;
  }
`

const Wrapper = styled.div`
  position: absolute;
  animation: ${fadeIn} 150ms ease-in-out 0s 1 normal;
  display: none;
  z-index: 1000;
`

class MarkdownEditorHoverMenu extends React.Component<MarkdownEditorMenuProps> {
  public mode: EditorMenuMode = EditorMenuMode.DEFAULT
  public adjustedForPromptSize?: number
  public menu: HTMLDivElement | null
  public lastMenuOffsetWidth?: number
  public updateTimeout?: number

  public componentDidMount() {
    this.updateStyle()
  }

  public componentDidUpdate() {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout)
    }

    this.updateTimeout = window.setTimeout(this.updateStyle, 10)
  }

  public updateStyle = () => {
    const { editor } = this.props
    const { menu } = this
    if (!menu || !editor) {
      return
    }

    const {
      value: { selection, fragment },
    } = editor

    if (this.mode === EditorMenuMode.PROMPT) {
      if (!this.adjustedForPromptSize && menu.style.left) {
        this.adjustedForPromptSize =
          (menu.offsetWidth -
            (this.lastMenuOffsetWidth === undefined
              ? menu.offsetWidth
              : this.lastMenuOffsetWidth)) /
          2
        menu.style.transition = ''
        menu.style.left = `${parseInt(menu.style.left || '0', 10) -
          this.adjustedForPromptSize}px`
      }
      return
    }

    if (this.adjustedForPromptSize) {
      menu.style.left = `${parseInt(menu.style.left || '0', 10) +
        this.adjustedForPromptSize}px`

      this.adjustedForPromptSize = undefined
      return
    }

    if (selection.isBlurred || selection.isCollapsed || fragment.text === '') {
      menu.removeAttribute('style')
      return
    }

    const native = window.getSelection()

    if (!native) {
      return
    }

    const range = native.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    if (menu.style.display === 'block') {
      menu.style.transition = 'top 0.1s ease-in-out, left 0.1s ease-in-out'
    }

    menu.style.display = 'block'
    menu.style.top = `${rect.top +
      window.pageYOffset -
      menu.offsetHeight -
      5}px`

    menu.style.left = `${rect.left +
      window.pageXOffset -
      menu.offsetWidth / 2 +
      rect.width / 2}px`

    this.lastMenuOffsetWidth = menu.offsetWidth
  }

  public ref = (ref: HTMLDivElement | null) => {
    this.menu = ref
  }

  public handleModeChange = (mode: EditorMenuMode) => {
    this.mode = mode
    setTimeout(this.updateStyle, 10)
  }

  public render() {
    const root = window.document.getElementById('__next')

    if (!root) {
      return null
    }

    return ReactDOM.createPortal(
      <Wrapper ref={this.ref as any}>
        <MarkdownEditorMenu
          {...this.props}
          onModeChange={this.handleModeChange}
        />
      </Wrapper>,
      root,
    )
  }
}

export default MarkdownEditorHoverMenu

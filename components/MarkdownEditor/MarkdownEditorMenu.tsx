import * as React from 'react'
import * as Slate from 'slate'
import styled, { StyledProps } from 'styled-components'
import Icon from '../Icon'
import { EditorControlType } from './MarkdownEditor'

const Container = styled.div`
  border-radius: 6px;
  background: #111;
  height: 40px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  padding: 0;
  z-index: 200;

  &::after {
    content: '';
    border-style: solid;
    border-width: 7px 7px 0;
    border-color: #192634 rgba(255, 255, 255, 0);
    position: absolute;
    width: 0;
    left: 0;
    right: 0;
    margin: auto;
    bottom: -7px;
  }
`

const Controls = styled.div`
  padding: 0 5px;
  height: 100%;
`

interface ControlProps {
  active: boolean
}
const Control = styled.button`
  background: none;
  padding: 5px;
  font-size: 20px;
  height: 100%;
  border-radius: 0;
  border: 0;
  color: ${(props: StyledProps<ControlProps>) =>
    props.active ? '#5faaff !important' : '#c0c7ce'};

  &:hover,
  &:focus {
    color: #fff;
  }
`

const Prompt = styled.div`
  display: flex;
  height: 100%;
`

const PromptInput = styled.input`
  background: none !important;
  color: #fff;
  border: none;
  height: 100%;
  width: 200px;
  font-size: 14px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`

const ClosePrompt = styled.button`
  padding: 5px 8px;
  font-size: 18px;
  height: 100%;
  color: #666;
`

export enum EditorMenuMode {
  PROMPT,
  DEFAULT,
}

type PromptSubmitCallback = (input: string) => any

export interface MarkdownEditorMenuProps {
  readonly className?: string
  readonly marks: EditorControlType[]
  readonly inlines: EditorControlType[]
  readonly hasMark: (type: string) => boolean
  readonly hasInline: (type: string) => boolean
  readonly editor?: Slate.Editor | null | undefined
  readonly onModeChange?: (mode: EditorMenuMode) => any
}

interface MarkdownEditorMenuState {
  style: React.CSSProperties
  mode: EditorMenuMode
  promptInputValue: string
  promptProps?: {
    placeholder: string
    onSubmit: PromptSubmitCallback
  }
}

class MarkdownEditorMenu extends React.Component<
  MarkdownEditorMenuProps,
  MarkdownEditorMenuState
> {
  public static getDerivedStateFromProps(
    _,
    state?: MarkdownEditorMenuState,
  ): MarkdownEditorMenuState {
    if (state) {
      return state
    }

    return {
      promptInputValue: '',
      mode: EditorMenuMode.DEFAULT,
      style: {},
    }
  }

  constructor(props) {
    super(props)

    this.state = MarkdownEditorMenu.getDerivedStateFromProps(props)
  }

  public handleToggleMark = (event: React.MouseEvent, type: string) => {
    event.preventDefault()
    const { editor } = this.props

    if (editor) {
      editor.toggleMark(type).focus()
    }
  }

  public prompt = (
    onSubmit: PromptSubmitCallback,
    placeholder: string = '',
  ) => {
    const { onModeChange } = this.props
    if (onModeChange) {
      onModeChange(EditorMenuMode.PROMPT)
    }

    this.setState({
      mode: EditorMenuMode.PROMPT,
      promptProps: {
        placeholder,
        onSubmit,
      },
    })
  }

  public handlePromptInputChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ promptInputValue: value })
  }

  public handlePromptInputKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.keyCode === 13) {
      const { promptProps, promptInputValue } = this.state
      if (promptProps && promptProps.onSubmit) {
        await promptProps.onSubmit(promptInputValue)
      }

      this.closePrompt()
    }
  }

  public closePrompt = () => {
    const { onModeChange } = this.props
    if (onModeChange) {
      onModeChange(EditorMenuMode.DEFAULT)
    }

    this.setState({
      promptInputValue: '',
      mode: EditorMenuMode.DEFAULT,
      promptProps: undefined,
    })
  }

  public toggleInline = (inline: EditorControlType) => {
    const { editor, hasInline } = this.props

    if (hasInline(inline.type)) {
      if (editor) {
        editor.unwrapInline(inline.type)
      }

      return
    }

    if (inline.prompt) {
      this.prompt(inline.prompt.onSubmit, inline.prompt.placeholder)
    }
  }

  public render() {
    const { hasMark, hasInline, marks, inlines, className } = this.props
    const { mode, promptInputValue, promptProps, style } = this.state

    let children

    if (mode === EditorMenuMode.PROMPT) {
      children = (
        <Prompt>
          <PromptInput
            value={promptInputValue}
            className="input"
            placeholder={promptProps && promptProps.placeholder}
            onKeyDown={this.handlePromptInputKeyDown}
            onChange={this.handlePromptInputChange}
          />
          <ClosePrompt
            type="button"
            className="btn btn-text-white"
            onMouseDown={this.closePrompt}
          >
            <Icon name="close" />
          </ClosePrompt>
        </Prompt>
      )
    } else {
      children = (
        <Controls>
          {marks.map(mark => (
            <Control
              key={mark.type}
              type="button"
              className="btn btn-text"
              title={mark.label}
              onMouseDown={event => this.handleToggleMark(event, mark.type)}
              active={hasMark(mark.type)}
            >
              <Icon name={mark.icon} />
            </Control>
          ))}
          {inlines.map(inline => (
            <Control
              key={inline.type}
              type="button"
              className="btn btn-text"
              title={inline.label}
              onMouseDown={() => this.toggleInline(inline)}
              active={hasInline(inline.type)}
            >
              <Icon name={inline.icon} />
            </Control>
          ))}
        </Controls>
      )
    }

    return (
      <Container className={className} style={style}>
        {children}
      </Container>
    )
  }
}

export default MarkdownEditorMenu

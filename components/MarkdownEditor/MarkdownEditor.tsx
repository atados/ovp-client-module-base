import React from 'react'
import * as Slate from 'slate'
import PasteLinkify from 'slate-paste-linkify'
import {
  Editor as SlateEditor,
  RenderMarkProps,
  RenderNodeProps,
} from 'slate-react'
import styled, { StyledProps } from 'styled-components'
import { markdownToHtml, turndownService } from '~/components/Markdown/Markdown'
import Icon from '../Icon'
import { unwrapLink, wrapLink } from './commands'
import MarkdownEditorHoverMenu from './MarkdownEditorHoverMenu'
import serializer from './serializer'
import { channel } from '~/base/common/constants'

const plugins = [PasteLinkify()]

const Container = styled.div`
  padding-top: 36px;

  > .input {
    height: auto !important;
    font-size: 16px;
    background: #fff;
    padding: 12px;
  }
`

const Controls = styled.div`
  position: absolute;
  top: -36px;
  height: 36px;
  left: 0;
`

interface ControlProps {
  readonly active: boolean
}
const Control = styled.button`
  font-size: 22px;
  padding: 4px 0;
  margin-right: 8px;
  background: none !important;
  color: ${(props: StyledProps<ControlProps>) =>
    props.active ? `${channel.theme.color.primary[500]} !important` : '#999'};
`

export interface EditorControlType {
  label: string
  type: string
  icon: string
  prompt?: {
    placeholder?: string
    onSubmit: (input: string) => any
  }
}

interface MarkdownEditorProps {
  readonly className?: string
  readonly controls?: boolean
  readonly placeholder?: string
  readonly defaultValue: string
  readonly onChange?: (newValue: string) => any
  readonly onBlur?: () => any
}

interface MarkdownEditorState {
  value: Slate.Value
}

class MarkdownEditor extends React.PureComponent<
  MarkdownEditorProps,
  MarkdownEditorState
> {
  public static defaultProps = {
    controls: true,
  }
  public static getDerivedStateFromProps(
    props: MarkdownEditorProps,
    state?: MarkdownEditorState,
  ): MarkdownEditorState {
    if (state) {
      return state
    }

    return {
      value: serializer.deserialize(
        markdownToHtml(props.defaultValue).replace(
          /<\/p>/g,
          '</p><br /><br />',
        ),
      ),
    }
  }

  public editor: Slate.Editor | null
  public commands = {
    wrapLink,
    unwrapLink,
  }

  public marks: EditorControlType[]

  public inlines: EditorControlType[]

  constructor(props) {
    super(props)

    this.state = MarkdownEditor.getDerivedStateFromProps(props)
    this.marks = [
      {
        type: 'bold',
        label: 'Negrito',
        icon: 'format_bold',
      },
      {
        type: 'italic',
        label: 'Italico',
        icon: 'format_italic',
      },
      {
        type: 'strikethrough',
        label: 'Strike',
        icon: 'format_strikethrough',
      },
    ]
    this.inlines = [
      {
        type: 'link',
        label: 'Link',
        icon: 'link',
        prompt: {
          placeholder: 'https://...',
          onSubmit: this.wrapLink,
        },
      },
    ]
  }

  public handleChange = ({ value }: { value: Slate.Value }) => {
    this.setState({ value })

    const { onChange } = this.props

    if (onChange) {
      onChange(turndownService.turndown(serializer.serialize(value)))
    }
  }

  public handleBlur = (_, editor: Slate.Editor, next) => {
    editor.blur()
    next()

    const { onBlur } = this.props
    if (onBlur) {
      onBlur()
    }
  }

  public renderMark = (props: RenderMarkProps, _, next) => {
    const { attributes, children, mark } = props

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>
      case 'code':
        return <code {...attributes}>{children}</code>
      case 'italic':
        return <em {...attributes}>{children}</em>
      case 'strikethrough':
        return <s {...attributes}>{children}</s>
      case 'underlined':
        return <u {...attributes}>{children}</u>
      default: {
        return next()
      }
    }
  }

  public renderNode = (props: RenderNodeProps, _, next) => {
    const { attributes, children, node } = props

    switch (node.type) {
      case 'link': {
        const { data } = node
        const href = data.get('href')
        return (
          <a {...attributes} href={href}>
            {children}
          </a>
        )
      }

      default: {
        return next()
      }
    }
  }

  public handleToggleMark = (event: React.MouseEvent, type: string) => {
    event.preventDefault()
    if (this.editor) {
      this.editor.toggleMark(type).focus()
    }
  }

  public wrapLink = (href: string) => {
    if (this.editor) {
      wrapLink(this.editor, href)
    }
  }

  public hasMark = type => {
    const { value } = this.state
    return value.activeMarks.some(mark => Boolean(mark && mark.type === type))
  }

  public hasInline = type => {
    const { value } = this.state
    return value.inlines.some(inline => Boolean(inline && inline.type === type))
  }

  public refEditor = (editor: Slate.Editor | null) => {
    this.editor = editor
  }

  public renderEditor = (_, editor, next) => {
    const children = next()
    return (
      <React.Fragment>
        {children}
        <MarkdownEditorHoverMenu
          editor={editor}
          hasMark={this.hasMark}
          hasInline={this.hasInline}
          marks={this.marks}
          inlines={this.inlines}
        />
      </React.Fragment>
    )
  }

  public render() {
    const { className, placeholder, controls } = this.props
    const { value } = this.state

    return (
      <Container className={`${className ? ` ${className}` : ''}`}>
        <div className="input relative">
          {controls && (
            <Controls>
              {this.marks.map(mark => (
                <Control
                  key={mark.type}
                  type="button"
                  className="btn btn-text"
                  title={mark.label}
                  onClick={event => this.handleToggleMark(event, mark.type)}
                  active={this.hasMark(mark.type)}
                >
                  <Icon name={mark.icon} />
                </Control>
              ))}
            </Controls>
          )}
          {
            // @ts-ignore
            <SlateEditor
              ref={this.refEditor as any}
              placeholder={placeholder}
              // @ts-ignore
              value={value}
              plugins={plugins}
              // @ts-ignore
              onChange={this.handleChange}
              renderNode={this.renderNode}
              renderMark={this.renderMark}
              spellCheck={false}
              renderEditor={this.renderEditor}
              // @ts-ignore
              commands={this.commands}
              style={{ minHeight: '200px' }}
            />
          }
        </div>
      </Container>
    )
  }
}

export default React.memo(MarkdownEditor)

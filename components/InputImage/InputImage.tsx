import React from 'react'
import { connect } from 'react-redux'
import styled, { StyledProps } from 'styled-components'
import { fetchAPI } from '~/lib/fetch/fetch.server'
import { RootState } from '~/redux/root-reducer'
import Icon from '../Icon'
import { UploadError } from './errors'

const RE_VALID_TYPE = /image\/(jpe?g|png)/gi

interface InputWrapperProps {
  value: InputImageValueType
}
const InputWrapper = styled.div`
  display: block;
  cursor: pointer;
  border-radius: 3px;

  ${(props: StyledProps<InputWrapperProps>) => {
    if (props.value) {
      return `
        background-image: url(${props.value.previewURI});
        background-position: center;
        background-size: cover;
        box-shadow: inset 0 0 0 1px rgba(0,0,0,.1);
      `
    }

    return `
      border: 2px dashed #ccc;
      background: #f6f6f6;

      &:hover {
        background: #f0f0f0;
      }
    `
  }};
`

const InputWrapperInner = styled.div`
  position: absolute;
  left: 15px;
  right: 15px;
  top: 0;
  bottom: 0;
  margin: auto;
  height: 80px;
`

const InputWrapperRemove = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  background: rgba(0, 0, 0, 0.5);
  padding: 15px;
  color: #fff;
  text-align: center;
`

export enum ErrorTypes {
  INVALID_TYPE,
}

interface UploadPayload {
  id?: number
  image_url: string
}

export interface Value {
  error?: Error
  fetching?: boolean
  payload?: UploadPayload
  previewURI?: string
}

export type InputImageValueType = Value | null

interface InputImageProps {
  readonly id?: string
  readonly sessionToken?: string
  readonly value?: InputImageValueType
  readonly className?: string
  readonly hint?: React.ReactNode
  readonly ratio: number
  readonly onChange?: (value: InputImageValueType) => void
  readonly onBlur?: (event?: React.FocusEvent) => void
}

interface InputImageState {
  readonly value: InputImageValueType
}

class InputImage extends React.Component<InputImageProps, InputImageState> {
  public static getDerivedStateFromProps(
    props: InputImageProps,
    state?: InputImageState,
  ): InputImageState {
    return {
      value:
        props.value !== undefined ? props.value : state ? state.value : null,
    }
  }

  constructor(props) {
    super(props)

    this.state = InputImage.getDerivedStateFromProps(props)
  }

  public handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { onChange, value: fixedValue, sessionToken } = this.props
    const file = event.target.files ? event.target.files[0] : null
    const hasFixedValue = fixedValue !== undefined

    let value: Value = { fetching: true }
    try {
      if (!file || !RE_VALID_TYPE.test(file.type)) {
        throw new UploadError(ErrorTypes.INVALID_TYPE, 'Invalid image type')
      }

      if (onChange) {
        onChange(value)
      }

      if (!hasFixedValue) {
        this.setState({ value })
      }

      const fileReader = new FileReader()
      let dispatchedUpload: boolean = false
      fileReader.onload = () => {
        if (dispatchedUpload) {
          return
        }

        value = { ...value, previewURI: fileReader.result as string }
        if (onChange) {
          onChange(value)
        }

        if (!hasFixedValue) {
          this.setState({ value })
        }
      }
      fileReader.readAsDataURL(file)

      // Create form data to send image file
      const formData = new FormData()
      formData.append('image', file)

      // Upload file to api
      const uploadedFile = await fetchAPI<UploadPayload>('/uploads/images/', {
        method: 'POST',
        body: formData,
        sessionToken,
      })

      // Indicate that the file was already uploaded to prevent the state updates with a preview
      // after updating with the uploaded image url
      dispatchedUpload = true
      value = { payload: uploadedFile, previewURI: uploadedFile.image_url }
      if (onChange) {
        onChange(value)
      }

      if (!hasFixedValue) {
        this.setState({ value })
      }
    } catch (error) {
      value = { error, previewURI: value.previewURI }

      if (onChange) {
        onChange(value)
      }

      if (!hasFixedValue) {
        this.setState({ value })
      }

      this.setState({ value })
    }
  }

  public reset = () => {
    const { value: fixedValue, onChange, onBlur } = this.props
    const hasFixedValue = fixedValue !== undefined

    if (onChange) {
      onChange(null)
    }

    if (!hasFixedValue) {
      this.setState({ value: null })
    }

    if (onBlur) {
      onBlur()
    }
  }

  public render() {
    const { id, hint, ratio, onBlur } = this.props
    const { value } = this.state

    const input = (
      <InputWrapper value={value} className="ratio inputFileWrapper">
        <span className="ratio-fill" style={{ paddingTop: `${ratio}%` }} />
        <div className="ratio-body">
          {!value ? (
            <InputWrapperInner>
              <span className="btn btn-primary btn--block">
                <Icon name="cloud_upload" className="mr-2" />
                Carregue a foto
              </span>
              <span className="block ta-center mt-2 tc-muted-dark">
                ou arraste pra cá
              </span>
            </InputWrapperInner>
          ) : (
            <InputWrapperRemove>
              <button className="btn btn-error btn--block" onClick={this.reset}>
                {value.fetching ? (
                  'Carregando...'
                ) : value.error ? (
                  'Falha ao tentar carregar'
                ) : (
                  <>
                    <Icon name="close" className="mr-1" />
                    Remover
                  </>
                )}
              </button>
            </InputWrapperRemove>
          )}
        </div>
        {!value && (
          <input
            id={id}
            name="image"
            type="file"
            onChange={this.handleInputChange}
            onBlur={onBlur}
          />
        )}
      </InputWrapper>
    )

    if (!hint) {
      return input
    }

    return (
      <div className="row">
        <div className="col-sm-6 mb-3 mb-sm-0">{input}</div>
        <div className="col-sm-6">
          <Icon
            name="lightbulb_outline"
            className="block tc-secondary-500 ts-medium"
          />
          <span className="tc-muted ts-small">{hint}</span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ user }: RootState): { sessionToken?: string } => ({
  sessionToken: user ? user.token : undefined,
})

export default connect(mapStateToProps)(InputImage)

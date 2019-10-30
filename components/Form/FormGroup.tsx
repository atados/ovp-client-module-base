import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { YupError } from '~/base/lib/form/yup'
import FormErrorMessage from '~/components/FormErrorMessage'

const Hint = styled.span`
  font-size: 14px;
  margin-top: 8px;
  display: block;
  color: #666;
`

const Length = styled.span`
  color: #999;
`

interface FormGroupProps {
  readonly labelFor?: string
  readonly label?: string
  readonly className?: string
  readonly hint?: React.ReactNode
  readonly error?: YupError | string
  readonly length?: number
  readonly required?: boolean
  readonly maxLength?: number
  readonly children?: React.ReactNode
}

const FormGroup: React.FC<FormGroupProps> = ({
  label,
  maxLength,
  length,
  hint,
  error,
  children,
  className,
  labelFor,
  required,
}) => {
  return (
    <div
      className={`form-group${error ? ` form-group-error` : ''}${
        className ? ` ${className}` : ''
      }`}
    >
      {(label || maxLength) && (
        <div className="flex mb-2">
          {label && (
            <label htmlFor={labelFor} className="tw-medium mb-0">
              {label}
              {!required ? (
                <span className="tc-muted tw-normal">
                  {' '}
                  -{' '}
                  <FormattedMessage
                    id="formGroup.optional"
                    defaultMessage="Opcional"
                  />
                </span>
              ) : null}
            </label>
          )}
          <div className="mr-auto" />
          {maxLength && length !== undefined && (
            <Length
              className={length > maxLength ? 'tc-error tw-medium' : undefined}
            >
              {length}/{maxLength}
            </Length>
          )}
        </div>
      )}
      {children}
      {(error || hint) && (
        <Hint
          className={`form-group-hint${error ? ' tc-error tw-medium' : ''}`}
        >
          {error ? <FormErrorMessage error={error} /> : hint}
        </Hint>
      )}
    </div>
  )
}

FormGroup.displayName = 'FormGroup'
FormGroup.defaultProps = {
  className: undefined,
  required: true,
}

export default React.memo(FormGroup)

import React from 'react'
import cx from 'classnames'
import { API } from '../types/api'
import { FormattedMessage } from 'react-intl'

interface RemoveApplicationFormProps {
  readonly className?: string
  readonly application: API.ProjectApplication
  readonly projectSlug: string
  readonly onConfirm?: (resp: any) => void
  readonly onCancel?: () => void
}

const RemoveApplicationForm: React.FC<RemoveApplicationFormProps> = ({
  className,
  application,
  onConfirm,
  onCancel,
}) => {
  const userName = application.user?.name || application.name
  return (
    <div className={cx(className, '')}>
      <h1 className="text-lg leading-normal mb-1">
        <FormattedMessage
          id="removeApplicationForm.title"
          defaultMessage={`Tem certeza que deseja cancelar a inscrição do {userName}?`}
          values={{ userName }}
        />
      </h1>
      <span className="block text-gray-700 mb-4">
        <FormattedMessage
          id="removeApplicationForm.description"
          defaultMessage="Ao remover essa inscrição você declara que esse usuário não deve mais participar dessa ação."
        />
      </span>
      <button
        type="button"
        className="btn bg-red-600 hover:bg-red-700 text-white mr-2"
        onClick={onConfirm}
      >
        Remover
      </button>
      <button
        type="button"
        className="btn bg-gray-200 hover:bg-gray-300 text-gray-800"
        onClick={onCancel}
      >
        Cancelar
      </button>
    </div>
  )
}

RemoveApplicationForm.displayName = 'RemoveApplicationForm'

export default RemoveApplicationForm

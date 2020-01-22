import { InjectedFormikProps, withFormik } from 'formik'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Yup from '~/lib/form/yup'
import { throwActionError } from '~/lib/utils/redux'
import {
  NewsletterSubscriptionPayload,
  subscribeToNewsletter,
} from '~/redux/ducks/newsletter'
import ActivityIndicator from '../ActivityIndicator'
import FormGroup from '../Form/FormGroup'
import Icon from '../Icon'
import { useIntl, defineMessages } from 'react-intl'

enum Status {
  Success,
}

const NewsletterFormSchema = Yup.object().shape({
  name: Yup.string()
    .min(4)
    .required(),
  email: Yup.string()
    .email()
    .required(),
  city: Yup.string()
    .min(2)
    .required(),
})

const Card = styled.div`
  input {
    border: 0;
    border-radius: 0;
  }

  .form-group-hint {
    background: #ffe7ea;
    padding: 0 8px 8px;
    margin-top: -3px;
  }
`

interface Values {
  name: string
  email: string
  city: string
}

const m = defineMessages({
  name: {
    id: 'newsletterForm.name',
    defaultMessage: 'Nome',
  },
  email: {
    id: 'newsletterForm.email',
    defaultMessage: 'Email',
  },
  city: {
    id: 'newsletterForm.city',
    defaultMessage: 'Cidade',
  },
  success: {
    id: 'newsletterForm.success',
    defaultMessage: 'Inscrição feit com sucesso',
  },
  submit: {
    id: 'newsletterForm.submit',
    defaultMessage: 'Inscrever-se',
  },
  title: {
    id: 'newsletterForm.title',
    defaultMessage: 'Newsletter',
  },
  description: {
    id: 'newsletterForm.description',
    defaultMessage: 'Quer receber as melhores vagas da semana no seu email?',
  },
})

interface NewsletterFormProps {
  readonly className?: string
  readonly onSubmit: (values: NewsletterSubscriptionPayload) => any
}

const NewsletterForm: React.FC<InjectedFormikProps<
  NewsletterFormProps,
  Values
>> = ({
  className,
  values,
  touched,
  errors,
  handleBlur,
  handleChange,
  handleSubmit,
  handleReset,
  isSubmitting,
  status,
}) => {
  const intl = useIntl()
  return (
    <form action="" method="post" className={className} onSubmit={handleSubmit}>
      <h4 className="text-base">{intl.formatMessage(m.title)}</h4>
      <p className="text-sm">{intl.formatMessage(m.description)}</p>
      <Card className="card mb-4">
        <FormGroup
          className="card-item text-sm"
          error={touched.name ? errors.name : ''}
        >
          <input
            name="name"
            type="text"
            placeholder={intl.formatMessage(m.name)}
            className="input"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </FormGroup>
        <FormGroup
          className="card-item text-sm"
          error={touched.email ? errors.email : ''}
        >
          <input
            name="email"
            type="text"
            placeholder={intl.formatMessage(m.email)}
            className="input"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </FormGroup>
        <FormGroup
          className="card-item text-sm"
          error={touched.city ? errors.city : ''}
        >
          <input
            name="city"
            type="text"
            placeholder={intl.formatMessage(m.city)}
            className="input"
            value={values.city}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </FormGroup>
      </Card>
      {status === Status.Success ? (
        <button
          type="button"
          className="btn text-white bg-green-500 hover:bg-green-600 btn--block"
          onClick={handleReset}
        >
          <Icon name="check" className="mr-1" />
          {intl.formatMessage(m.success)}
        </button>
      ) : (
        <button
          type="submit"
          className="btn btn--block text-white bg-primary-500 hover:bg-primary-600"
          disabled={isSubmitting}
        >
          {intl.formatMessage(m.submit)}
          {isSubmitting && (
            <ActivityIndicator fill="#fff" size={24} className="ml-2" />
          )}
        </button>
      )}
    </form>
  )
}

NewsletterForm.displayName = 'NewsletterForm'

const mapDispatchToProps = dispatch => ({
  onSubmit: (values: NewsletterSubscriptionPayload) =>
    dispatch(subscribeToNewsletter(values)),
})
export default connect(
  undefined,
  mapDispatchToProps,
)(
  withFormik<NewsletterFormProps, Values>({
    mapPropsToValues: () => ({
      name: '',
      email: '',
      city: '',
    }),
    handleSubmit: async (
      values,
      { props: { onSubmit }, setStatus, setSubmitting },
    ) => {
      try {
        await onSubmit(values).then(throwActionError)
        setStatus(Status.Success)
      } catch (error) {
        // ...
      }

      setSubmitting(false)
    },
    validationSchema: NewsletterFormSchema,
  })(NewsletterForm),
)

import { InjectedFormikProps, withFormik } from 'formik'
import * as React from 'react'
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

interface NewsletterFormProps {
  readonly className?: string
  readonly onSubmit: (values: NewsletterSubscriptionPayload) => any
}

const NewsletterForm: React.SFC<
  InjectedFormikProps<NewsletterFormProps, Values>
> = ({
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
}) => (
  <form action="" method="post" className={className} onSubmit={handleSubmit}>
    <h4 className="ts-normal">Newsletter</h4>
    <p className="ts-small">
      Quer receber as melhores vagas da semana no seu email?
    </p>
    <Card className="card mb-3">
      <FormGroup
        className="card-item ts-small"
        error={touched.name ? errors.name : ''}
      >
        <input
          name="name"
          type="text"
          placeholder="Nome"
          className="input"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </FormGroup>
      <FormGroup
        className="card-item ts-small"
        error={touched.email ? errors.email : ''}
      >
        <input
          name="email"
          type="text"
          placeholder="Email"
          className="input"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </FormGroup>
      <FormGroup
        className="card-item ts-small"
        error={touched.city ? errors.city : ''}
      >
        <input
          name="city"
          type="text"
          placeholder="Cidade"
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
        className="btn btn-success btn--block"
        onClick={handleReset}
      >
        <Icon name="check" className="mr-1" />
        Inscrito com sucesso
      </button>
    ) : (
      <button
        type="submit"
        className="btn btn--block btn-primary"
        disabled={isSubmitting}
      >
        Inscrever-se
        {isSubmitting && (
          <ActivityIndicator fill="#fff" size={24} className="ml-2" />
        )}
      </button>
    )}
  </form>
)

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

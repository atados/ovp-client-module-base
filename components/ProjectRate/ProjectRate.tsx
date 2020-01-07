import { InjectedFormikProps, withFormik } from 'formik'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { channel } from '~/common/constants'
import Yup from '~/lib/form/yup'
import { pushToDataLayer } from '~/lib/tag-manager'
import { range } from '~/lib/utils/array'
import { reportError } from '~/lib/utils/error'
import {
  cancelRating,
  Rating,
  RatingProject,
  sendRating,
} from '~/redux/ducks/ratings'
import ActivityIndicator from '../ActivityIndicator'
import Icon from '../Icon'

const Form = styled.form``
const Card = styled.div`
  background: #f5f6f7;
  border-radius: 10px;
  padding-left: 160px;
  position: relative;
`

const Thumbnail = styled.div`
  background-color: #333;
  border-radius: 10px 0 0 10px;
  width: 160px;
  height: 100%;
  float: left;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background-position: center;
  background-size: cover;
`

const Stars = styled.div`
  .btn {
    color: #aaa;
    font-size: 32px;

    &:hover,
    &:focus {
      background: none;
    }

    &.active {
      color: #ffa13a;
    }
  }
`

interface Values {
  rate?: number
  comment: string
}

export interface ProjectRateProps {
  readonly className?: string
  readonly rating: RatingProject
  readonly onCancelRating: (rating: Rating) => any
  readonly onFinish: () => any
  readonly onSubmit: (
    rating: Rating,
    values: { rate: number; comment: string },
  ) => any
}
interface ProjectRateState {
  value: number
}

const messages = ['Muito ruim', 'Ruim', 'Neutro', 'Bom', 'Ótimo']
class ProjectRate extends React.Component<
  InjectedFormikProps<ProjectRateProps, Values>,
  ProjectRateState
> {
  public static getDerivedStateFromProps(
    _: ProjectRateProps,
    state?: ProjectRateState,
  ): ProjectRateState {
    return {
      value: state ? state.value : 0,
    }
  }

  constructor(props) {
    super(props)

    this.state = ProjectRate.getDerivedStateFromProps(props)
  }

  public setValue = (newValue: number) => {
    this.setState({ value: newValue })
  }

  public cancelRating = () => {
    this.props.onCancelRating(this.props.rating)
  }

  public render() {
    const {
      className,
      handleSubmit,
      handleChange,
      handleBlur,
      setFieldValue,
      values,
      isSubmitting,
      rating,
    } = this.props
    const { value } = this.state
    const { rated_object: project } = rating

    return (
      <Form action="" onSubmit={handleSubmit} className={className}>
        <h4>Como foi sua experiencia nessa vaga?</h4>
        <hr />
        <Card>
          <Thumbnail
            style={
              project.image
                ? { backgroundImage: `url('${project.image.image_url}')` }
                : undefined
            }
          />
          <div className="p-4">
            <h4 className="text-base">{project.name}</h4>
            <p className="m-0 text-sm">{project.description}</p>
          </div>
        </Card>
        <div className="p-3">
          <hr />
          <Stars className="text-center">
            {range(5, i => (
              <button
                key={i}
                type="button"
                className={`btn btn-text${
                  (value === 0
                  ? values.rate && values.rate > i
                  : value > i)
                    ? ' active'
                    : ''
                }`}
                onMouseEnter={() => this.setValue(i + 1)}
                onMouseLeave={() => this.setValue(0)}
                onClick={() => setFieldValue('rate', i + 1)}
              >
                <Icon name={channel.theme.iconRating} />
              </button>
            ))}
          </Stars>
          {(values.rate || value > 0) && (
            <span className="block text-center h4 font-normal mt-2 mb-4">
              {messages[value > 0 ? value - 1 : values.rate! - 1]}
            </span>
          )}

          {values.rate && values.rate > 0 && (
            <>
              <textarea
                name="comment"
                rows={2}
                className="input mb-2"
                placeholder="Adicionar comentário - Opcional"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.comment}
              />

              <button
                type="submit"
                className="btn btn-primary btn--size-3 btn--block"
              >
                Enviar avaliação
                {isSubmitting && (
                  <ActivityIndicator fill="#fff" size={38} className="ml-2" />
                )}
              </button>
            </>
          )}
          <hr />
          <button
            type="button"
            className="btn btn--size-3 btn-text btn--block"
            disabled={isSubmitting}
            onClick={this.cancelRating}
          >
            Não consegui ir
          </button>
        </div>
      </Form>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  onCancelRating: (rating: Rating) => {
    dispatch(cancelRating({ uuid: rating.uuid, type: 'project' }))
    pushToDataLayer({
      event: 'project.rating',
      slug: rating.rated_object.slug,
      attended: false,
    })
  },
  onSubmit: (rating: Rating, values) => {
    dispatch(sendRating({ uuid: rating.uuid, values, type: 'project' }))
    pushToDataLayer({
      event: 'project.rating',
      slug: rating.rated_object.slug,
      attended: true,
      value: values.rate,
      text: values.comment,
    })
  },
})

const ProjectRateValidationSchema = Yup.object().shape({
  comment: Yup.string()
    .min(4)
    .max(200),
  rate: Yup.number().required(),
})

export default connect(
  undefined,
  mapDispatchToProps,
)(
  withFormik<ProjectRateProps, Values>({
    displayName: 'ProjectRateForm',
    mapPropsToValues: () => ({
      rate: undefined,
      comment: '',
    }),
    handleSubmit: async (
      values,
      { setSubmitting, props: { onSubmit, rating, onFinish } },
    ) => {
      try {
        await onSubmit(rating, { rate: values.rate!, comment: values.comment })
        onFinish()
      } catch (error) {
        reportError(error)
      }

      setSubmitting(false)
    },
    validationSchema: ProjectRateValidationSchema,
  })(ProjectRate),
)

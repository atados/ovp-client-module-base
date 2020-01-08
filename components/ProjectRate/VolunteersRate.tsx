import { InjectedFormikProps, withFormik } from 'formik'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Yup from '~/lib/form/yup'
import { pushToDataLayer } from '~/lib/tag-manager'
import { range } from '~/lib/utils/array'
import { reportError } from '~/lib/utils/error'
import { Project } from '~/redux/ducks/project'
import {
  cancelRating,
  fetchRatings,
  RatingUser,
  sendRating,
} from '~/redux/ducks/ratings'
import { RootState } from '~/redux/root-reducer'
import ActivityIndicator from '../ActivityIndicator'
import Icon from '../Icon'
import { Theme } from '~/base/common'

const Form = styled.form``
const Card = styled.div`
  background: #f5f6f7;
  border-radius: 10px;
  padding-left: 160px;
  position: relative;
  min-height: 120px;
`

const Thumbnail = styled.div`
  background: #333;
  border-radius: 10px 0 0 10px;
  width: 160px;
  height: 100%;
  float: left;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
`

const Stars = styled.div`
  position: relative;
  display: inline-block;

  &.disabled {
    opacity: 0.7;

    &::after {
      content: '';
      width: 100%;
      bottom: 0;
      top: 0;
      height: 2px;
      left: 0;
      right: 0;
      display: block;
      margin: auto;
      background: #999;
      position: absolute;
    }
  }

  .btn {
    color: #aaa;
    font-size: 20px;
    padding: 0 5px;

    &:hover,
    &:focus {
      background: none;
    }

    &.active {
      color: #ffa13a;
    }
  }
`

const Table = styled.table`
  td,
  th {
    background: #f6f7f9;
  }

  tr td,
  tr th {
    &:first-child {
      padding-left: 2rem;
    }

    &:last-child {
      padding-right: 2rem;
    }
  }

  th {
    font-size: 14px;
  }

  td {
    font-size: 14px;
  }
`

interface Values {
  rateByUuid: { [uuid: string]: number }
}

export interface VolunteersRateProps {
  readonly className?: string
  readonly fetchingRatings?: boolean
  readonly project: Project
  readonly onCancelRating: (uuid: string, first?: boolean) => any
  readonly onFetchRatings: () => any
  readonly onFinish: () => any
  readonly ratings: RatingUser[]
  readonly onSubmit: (payload: {
    uuid: string
    values: { rate: number; comment?: string }
    first?: boolean
  }) => any
}
interface VolunteersRateState {
  readonly valueBySlug: { [slug: string]: number }
}

const messages = ['Muito ruim', 'Ruim', 'Neutro', 'Bom', 'Ótimo']
class VolunteersRate extends React.Component<
  InjectedFormikProps<VolunteersRateProps, Values>,
  VolunteersRateState
> {
  public static getDerivedStateFromProps(
    _: VolunteersRateProps,
    state?: VolunteersRateState,
  ): VolunteersRateState {
    return {
      valueBySlug: state ? state.valueBySlug : {},
    }
  }

  constructor(props) {
    super(props)

    this.state = VolunteersRate.getDerivedStateFromProps(props)
  }

  public componentDidMount() {
    this.props.onFetchRatings()
  }

  public setValue = (slug: string, newValue: number) => {
    this.setState({
      valueBySlug: { ...this.state.valueBySlug, [slug]: newValue },
    })
  }

  public render() {
    const {
      className,
      handleSubmit,
      setFieldValue,
      values,
      isSubmitting,
      isValid,
      project,
      ratings,
      fetchingRatings,
    } = this.props
    const { valueBySlug } = this.state

    return (
      <Form action="" onSubmit={handleSubmit} className={className}>
        <div className="p-5">
          <h4>Como foram os voluntários dessa ação?</h4>
          <p>
            Ao dar nota aos voluntários você nos ajuda a saber quem está
            mandando bem e quem não está.
          </p>
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
        </div>
        {fetchingRatings ? (
          <div className="bg-muted card-item p-5 text-center">
            <ActivityIndicator size={48} />
          </div>
        ) : (
          <Table className="table  card-item borderless bg-muted">
            <thead>
              <tr>
                <th>Nome</th>
                <th style={{ width: '200px' }}>Nota</th>
                <th style={{ width: '50px' }}>Compareceu</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map(rating => {
                const { rated_object: user } = rating
                const value = valueBySlug[user.slug]
                const markedValue = values.rateByUuid[rating.uuid]
                const disabled = markedValue === -1

                return (
                  <tr key={user.slug}>
                    <td>{user.name}</td>
                    <td>
                      <Stars className={disabled ? 'disabled' : ''}>
                        {range(5, i => (
                          <button
                            key={i}
                            type="button"
                            className={`btn btn-text${
                              (value === 0
                              ? markedValue && markedValue > i
                              : value > i)
                                ? ' active'
                                : ''
                            }`}
                            onMouseEnter={
                              !disabled
                                ? () => this.setValue(user.slug, i + 1)
                                : undefined
                            }
                            onMouseLeave={
                              !disabled
                                ? () => this.setValue(user.slug, 0)
                                : undefined
                            }
                            onClick={
                              !disabled
                                ? () =>
                                    setFieldValue('rateByUuid', {
                                      ...values.rateByUuid,
                                      [rating.uuid]: i + 1,
                                    })
                                : undefined
                            }
                            disabled={disabled}
                          >
                            <Icon name={Theme.iconRating} />
                          </button>
                        ))}
                      </Stars>
                      {(markedValue || value > 0) && (
                        <span className="block text-xs text-gray-600">
                          {messages[value > 0 ? value - 1 : markedValue - 1]}
                        </span>
                      )}
                    </td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        className="input"
                        onChange={e =>
                          setFieldValue('rateByUuid', {
                            ...values.rateByUuid,
                            [rating.uuid]: e.target.checked ? 0 : -1,
                          })
                        }
                        checked={!disabled}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        )}
        <div className="p-5 card-item">
          <button
            type="submit"
            className={`btn btn--size-3 btn--block ${
              isValid ? 'btn-primary' : 'btn-disabled'
            }`}
            disabled={!isValid}
          >
            Enviar avaliação dos voluntários
            {isSubmitting && <ActivityIndicator size={38} className="ml-2" />}
          </button>
        </div>
      </Form>
    )
  }
}

const mapStateToProps = ({ ratings }: RootState) => ({
  fetchingRatings: ratings.fetching,
  ratings: ratings.nodes,
})

const mapDispatchToProps = dispatch => ({
  onFetchRatings: projectSlug =>
    dispatch(
      fetchRatings({
        initiator_project_slug: projectSlug,
        object_type: 'user',
      }),
    ),
  onCancelRating: (uuid, first) =>
    dispatch(cancelRating({ uuid, type: 'user', first })),
  onSubmit: ({ uuid, values, first }) =>
    dispatch(sendRating({ uuid, values, type: 'user', first })),
})

const VolunteersRateValidationSchema = Yup.object().shape({
  rateByUuid: Yup.object().test(
    'validate-ratings',
    'Avalie todos os voluntários',
    value => {
      const keys = value ? Object.keys(value) : []

      return keys.length > 0 && keys.some(key => value[key] !== 0)
    },
  ),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  withFormik<VolunteersRateProps, Values>({
    displayName: 'VolunteersRateForm',
    mapPropsToValues: () => ({
      rateByUuid: {},
    }),
    handleSubmit: async (
      values,
      { setSubmitting, props: { onSubmit, onCancelRating, ratings, onFinish } },
    ) => {
      try {
        await Promise.all(
          ratings.map((rating, i) => {
            const rate = values.rateByUuid[rating.uuid]

            if (rate === -1) {
              pushToDataLayer({
                event: 'volunteer.rating',
                attended: false,
                slug: rating.rated_object.slug,
              })

              return onCancelRating(rating.uuid, i === 0)
            }

            pushToDataLayer({
              event: 'volunteer.rating',
              value: rate,
              attended: true,
              slug: rating.rated_object.slug,
            })

            return onSubmit({
              uuid: rating.uuid,
              values: { rate },
              first: i === 0,
            })
          }),
        )
        onFinish()
      } catch (error) {
        reportError(error)
      }

      setSubmitting(false)
    },
    validationSchema: VolunteersRateValidationSchema,
  })(VolunteersRate),
)

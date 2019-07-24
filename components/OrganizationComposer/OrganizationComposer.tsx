import * as React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import OrganizationComposerAbout, {
  Values as AboutValues,
} from '~/components/OrganizationComposer/steps/OrganizationComposerAbout'
import OrganizationComposerAuth from '~/components/OrganizationComposer/steps/OrganizationComposerAuth'
import OrganizationComposerBasics, {
  Values as BasicsValues,
} from '~/components/OrganizationComposer/steps/OrganizationComposerBasics'
import OrganizationComposerConclusion from '~/components/OrganizationComposer/steps/OrganizationComposerConclusion'
import OrganizationComposerContact, {
  Values as ContactValues,
} from '~/components/OrganizationComposer/steps/OrganizationComposerContact'
import OrganizationComposerIntro from '~/components/OrganizationComposer/steps/OrganizationComposerIntro'
import { throwActionError } from '~/lib/utils/redux'
import { Organization } from '~/redux/ducks/organization'
import {
  addOrganization,
  editOrganization,
} from '~/redux/ducks/organization-composer'
import { RootState } from '~/redux/root-reducer'
import FormComposer, {
  FormComposerMode,
  StepIds,
  StepIdType,
} from '../FormComposer/FormComposer'

const Container = styled.div`
  .step-intro {
    background-color: #fff;
    background-repeat: no-repeat;
    background-image: url('/base/images/organization-composer-bg-effect-1.svg');
    background-position: 0 -60px;

    @media (min-width: 700px) {
      background-position: top left;
    }
  }
`

export interface Values {
  basics: BasicsValues
  contact: ContactValues
  about: AboutValues
}

interface OrganizationComposerProps {
  readonly stepId: StepIdType
  readonly className?: string
  readonly onStepChange: (stepId: StepIdType) => void
}

interface OrganizationComposerProps {
  readonly className?: string
  readonly offsetTop?: number
  readonly slug?: string
  readonly skipingDisabled?: boolean
  readonly isSubmitting?: boolean
  readonly isAuthenticated?: boolean
  readonly organization?: Organization
  readonly defaultValues?: Values
  readonly mode?: FormComposerMode
  readonly onSubmit: (values: Values) => any
  readonly intro?: React.ComponentType<any> | false
}

const OrganizationComposer: React.SFC<OrganizationComposerProps> = ({
  stepId,
  onStepChange,
  onSubmit,
  isSubmitting,
  organization,
  intro,
  mode,
  isAuthenticated,
  defaultValues,
  skipingDisabled,
  children,
}) => {
  let steps = [
    {
      id: 'basics',
      defaultValue: {},
      description: 'Preencha com as informações básicas da ONG',
      title: 'Começar pelo basico',
      name: 'Informações gerais',
      component: OrganizationComposerBasics,
    },
    {
      id: 'contact',
      defaultValue: {},
      description: 'Informações de contato da ONG',
      title: 'Contato',
      name: 'Contato',
      component: OrganizationComposerContact,
    },
    {
      id: 'about',
      defaultValue: {},
      description: 'Escreva sobre sua ONG',
      title: 'Sobre a ONG',
      name: 'Sobre a ONG',
      component: OrganizationComposerAbout,
    },
  ]

  if (!isAuthenticated) {
    steps = [
      {
        id: 'auth',
        defaultValue: {},
        description: 'Preencha com as informações básicas da ONG',
        title: 'Começar pelo basico',
        name: 'Acesso',
        component: OrganizationComposerAuth,
      },
      ...steps,
    ]
  }

  return (
    <Container>
      <FormComposer
        className={stepId === StepIds.Introduction ? 'step-intro' : ''}
        introduction={
          intro === false ? undefined : intro || OrganizationComposerIntro
        }
        conclusion={OrganizationComposerConclusion}
        context={{ organization }}
        stepId={stepId}
        onStepChange={onStepChange}
        mode={mode || FormComposerMode.CREATE}
        draftKey={
          mode === FormComposerMode.EDIT ? undefined : 'organization-composer'
        }
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        steps={steps}
        defaultValues={defaultValues}
        skipingDisabled={
          (!isAuthenticated || skipingDisabled) &&
          mode !== FormComposerMode.EDIT
        }
        header={stepId === StepIds.Introduction ? false : undefined}
      >
        {children}
      </FormComposer>
    </Container>
  )
}

OrganizationComposer.displayName = 'OrganizationComposer'

const mapStateToProps = ({ user, organizationComposer }: RootState) => ({
  isAuthenticated: Boolean(user),
  isSubmitting: organizationComposer.fetching,
  organization: organizationComposer.node,
})

const mapDispatchToProps = (
  dispatch,
  { slug, mode }: OrganizationComposerProps,
) => ({
  onSubmit: async (values: Values) => {
    if (
      !values.basics.address ||
      !values.basics.image ||
      !values.basics.image.payload
    ) {
      return
    }

    const payload = {
      name: values.basics.name,
      description: values.basics.description,
      details: values.about.content,
      address: {
        typed_address: values.basics.address.node.description,
        typed_address2: values.basics.addressComplement,
      },
      benefited_people: parseInt(values.basics.benefitedPeople, 10) || 0,
      hidden_address: !values.basics.show_address,
      image_id: values.basics.image.payload.id!,
      causes: values.basics.causes.map(item => ({ id: item.value })),
      website: values.contact.website,
      contact_phone: values.contact.phone,
      contact_email: values.contact.contact_email,
      facebook_page: values.contact.facebook_page,
      document: values.basics.cnpj,
    }

    if (mode === FormComposerMode.EDIT) {
      if (slug) {
        await dispatch(
          editOrganization({
            ...payload,
            slug,
          }),
        ).then(throwActionError)
      }
    } else {
      await dispatch(addOrganization(payload)).then(throwActionError)
    }
  },
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrganizationComposer)

import React, { useMemo } from 'react'
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
import { throwActionError } from '~/lib/utils/redux'
import { Organization } from '~/redux/ducks/organization'
import {
  addOrganization,
  editOrganization,
} from '~/redux/ducks/organization-composer'
import { RootState } from '~/redux/root-reducer'
import FormComposer, {
  FormComposerMode,
  StepIdType,
} from '../FormComposer/FormComposer'
import { useIntl, defineMessages } from 'react-intl'

const Container = styled.div`
  .step-intro {
    background-color: #fff;
    background-repeat: no-repeat;
    background-image: url('/static/base/images/organization-composer-bg-effect-1.svg');
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

const m = defineMessages({
  authDescription: {
    id: 'organizationComposer.auth.description',
    defaultMessage: 'Preencha com as informações básicas da ONG',
  },
  authTitle: {
    id: 'organizationComposer.auth.title',
    defaultMessage: 'Começar pelo basico',
  },
  authName: {
    id: 'organizationComposer.auth.name',
    defaultMessage: 'Acesso',
  },
  basicsDescription: {
    id: 'organizationComposer.basics.description',
    defaultMessage: 'Preencha com as informações básicas da ONG',
  },
  basicsTitle: {
    id: 'organizationComposer.basics.title',
    defaultMessage: 'Começar pelo basico',
  },
  basicsName: {
    id: 'organizationComposer.basics.name',
    defaultMessage: 'Informações gerais',
  },
  contactDescription: {
    id: 'organizationComposer.contact.description',
    defaultMessage: 'Informações de contato da ONG',
  },
  contactTitle: {
    id: 'organizationComposer.contact.title',
    defaultMessage: 'Contato',
  },
  contactName: {
    id: 'organizationComposer.contact.name',
    defaultMessage: 'Contato',
  },
  aboutDescription: {
    id: 'organizationComposer.about.description',
    defaultMessage: 'Escreva sobre sua ONG',
  },
  aboutTitle: {
    id: 'organizationComposer.about.title',
    defaultMessage: 'Sobre a ONG',
  },
  aboutName: {
    id: 'organizationComposer.about.name',
    defaultMessage: 'a ONG',
  },
})

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
  readonly auth?: false
}

const OrganizationComposer: React.FC<OrganizationComposerProps> = ({
  stepId,
  auth,
  onStepChange,
  onSubmit,
  isSubmitting,
  organization,
  mode,
  isAuthenticated,
  defaultValues,
  skipingDisabled,
  children,
}) => {
  const intl = useIntl()
  const steps = useMemo(() => {
    const allSteps = [
      {
        id: 'auth',
        defaultValue: {},
        description: intl.formatMessage(m.authDescription),
        title: intl.formatMessage(m.authTitle),
        name: intl.formatMessage(m.authName),
        // @ts-ignore
        component: OrganizationComposerAuth,
      },
      {
        id: 'basics',
        defaultValue: {},
        description: intl.formatMessage(m.basicsDescription),
        title: intl.formatMessage(m.basicsTitle),
        name: intl.formatMessage(m.basicsName),
        component: OrganizationComposerBasics,
      },
      {
        id: 'contact',
        defaultValue: {},
        description: intl.formatMessage(m.contactDescription),
        title: intl.formatMessage(m.contactTitle),
        name: intl.formatMessage(m.contactName),
        component: OrganizationComposerContact,
      },
      {
        id: 'about',
        defaultValue: {},
        description: intl.formatMessage(m.aboutDescription),
        title: intl.formatMessage(m.aboutTitle),
        name: intl.formatMessage(m.aboutName),
        component: OrganizationComposerAbout,
      },
    ]

    if (auth === false) {
      return allSteps.slice(1)
    }

    return allSteps
  }, [auth])

  return (
    <Container>
      <FormComposer
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
        // @ts-ignore
        steps={steps}
        defaultValues={defaultValues}
        skipingDisabled={
          (!isAuthenticated || skipingDisabled) &&
          mode !== FormComposerMode.EDIT
        }
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

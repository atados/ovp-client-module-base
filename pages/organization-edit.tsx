import { NextContext } from 'next'
import Link from 'next/link'
import Router from 'next/router'
import React from 'react'
import { connect } from 'react-redux'
import { channel } from '~/common/constants'
import { resolvePage } from '~/common/page'
import {
  FormComposerMode,
  StepIdType,
} from '~/components/FormComposer/FormComposer'
import Icon from '~/components/Icon'
import { AddressKind } from '~/components/InputAddress/InputAddress'
import OrganizationComposer, {
  Values,
} from '~/components/OrganizationComposer/OrganizationComposer'
import OrganizationLayout from '~/components/OrganizationLayout/OrganizationLayout'
import { NotFoundPageError } from '~/lib/next/errors'
import { causeToSelectItem } from '~/lib/utils/form'
import { fetchOrganization, Organization } from '~/redux/ducks/organization'
import { RootState } from '~/redux/root-reducer'

interface OrganizationComposerPageProps {
  readonly stepId: string
  readonly slug: string
  readonly className?: string
  readonly defaultValues?: Values
  readonly organization: Organization
}

class OrganizationComposerPage extends React.Component<
  OrganizationComposerPageProps
> {
  public static async getInitialProps({
    store,
    query: { slug, stepId },
  }: NextContext) {
    const { user } = store.getState()
    if (
      typeof slug !== 'string' ||
      !user ||
      // Check if user has permission to edit this organization
      !user.organizations.some(organization => organization.slug === slug)
    ) {
      throw new NotFoundPageError()
    }

    try {
      await store.dispatch(fetchOrganization(slug)).then(action => {
        if (action.error) {
          throw action.error
        }

        return action.payload as Organization
      })

      return {
        slug,
        stepId: stepId || 'basics',
      }
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundPageError()
      }

      throw error
    }
  }

  public handleStepChange = (stepId: StepIdType) => {
    Router.push(
      `${resolvePage('/organization-edit')}?stepId=${stepId}&slug=${
        this.props.slug
      }`,
      `/ong/${this.props.slug}/editar/${stepId}`,
    )
  }

  public render() {
    const { organization, stepId, defaultValues } = this.props

    return (
      <OrganizationLayout
        layoutProps={{ disableFooter: true }}
        isCurrentUserMember
        organization={organization}
      >
        {
          // @ts-ignore
          <OrganizationComposer
            slug={this.props.slug}
            stepId={stepId}
            onStepChange={this.handleStepChange}
            intro={false}
            mode={FormComposerMode.EDIT}
            defaultValues={defaultValues}
            offsetTop={channel.theme.toolbarHeight + 50}
          >
            <div className="mb-4">
              <Link
                href={{
                  pathname: resolvePage('/organization'),
                  query: { slug: organization.slug },
                }}
                as={`/ong/${organization.slug}`}
              >
                <a className="float-right">
                  Ir à página da ONG <Icon name="arrow_forward" />
                </a>
              </Link>
              <h4 className="ts-normal tw-normal">
                <b>Editando:</b> {organization.name}
              </h4>
            </div>
          </OrganizationComposer>
        }
      </OrganizationLayout>
    )
  }
}

const mapStateToProps = ({
  organization,
}: RootState): {
  organization: Organization
  defaultValues?: Values
} => {
  const { node } = organization

  if (!node) {
    throw Error('Organization not fetched')
  }

  return {
    organization: node,
    defaultValues: {
      basics: {
        name: node.name,
        description: node.description,
        cnpj: node.document || '',
        defaultCnpj: node.document || '',
        show_address: !node.hidden_address,
        benefitedPeople: node.benefited_people
          ? String(node.benefited_people)
          : '',
        image: node.image
          ? {
              payload: node.image,
              previewURI: node.image ? node.image.image_url : undefined,
            }
          : undefined,
        causes: node.causes.map(causeToSelectItem),
        address: node.address
          ? {
              kind: AddressKind.WEAK,
              node: { description: node.address.typed_address },
            }
          : null,
        addressComplement: node.address ? node.address.typed_address2 : '',
      },
      contact: {
        phone: node.contact_phone || '',
        contact_email: node.contact_email,
        website: node.website || '',
        facebook_page: node.facebook_page || '',
      },
      about: {
        content: node.details,
      },
    },
  }
}

export default connect(mapStateToProps)(OrganizationComposerPage)

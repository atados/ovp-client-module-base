import React, { useState } from 'react'
import { Organization } from '~/base/redux/ducks/organization'
import styled from 'styled-components'
import Avatar from '~/components/Avatar'
import OrganizationVerificationBadge from '../OrganizationVerificationBadge'
import PageLink from '../PageLink'
import Icon from '../Icon'
import { FormattedMessage } from 'react-intl'
import { useImageUpload } from '~/base/hooks/use-image-upload'
import ActivityIndicator from '../ActivityIndicator'
import { ImageDict } from '~/base/common'
import { useDispatch } from 'react-redux'
import { editOrganization } from '~/base/redux/ducks/organization-composer'

const Photo = styled(Avatar)`
  border: 6px solid #fff;
  margin: -130px 0 0 -6px;
  border-radius: 12px;
  width: 140px;
  height: 140px;
`

const Cover = styled.div`
  padding-top: 240px;
  margin: 0 -10px;
  overflow: hidden;

  svg {
    margin: 0 -1px;
  }

  @media (min-width: 768px) {
    margin: 0 -1.5rem;
  }
`

const UpdateCoverButton = styled.div`
  position: absolute;
  right: 12px;
  top: 12px;
  z-index: 50;
  display: inline-block;
`

interface NewCoverState {
  source: string
  image?: ImageDict
  uploading?: boolean
}

interface OrganizationPageHeaderProps {
  readonly className?: string
  readonly organization: Organization
}

const OrganizationPageHeader: React.FC<OrganizationPageHeaderProps> = ({
  className,
  organization,
}) => {
  const [newCover, setNewCover] = useState<NewCoverState | null>(null)
  const uploadImageFile = useImageUpload()
  const handleCoverInputFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files ? event.target.files[0] : null

    if (file) {
      try {
        const image = await uploadImageFile(file, {
          onLoadPreview: previewSource => {
            setNewCover({ source: previewSource, uploading: true })
          },
        })

        setNewCover({ source: image.image_url, image })
      } catch (error) {
        // ...
      }
    }
  }
  const dispatchToRedux = useDispatch()
  const handleNewCoverSubmit = async () => {
    if (newCover && newCover.image) {
      await dispatchToRedux(
        editOrganization({
          cover_id: newCover.image.id,
          slug: organization.slug,
        }),
      )
      setNewCover(null)
    }
  }

  return (
    <div className={className}>
      <div className="container">
        <Cover
          className="bg-gray-300 mb-3 rounded-b-lg bg-cover relative"
          style={{
            backgroundImage:
              organization.cover || newCover
                ? `url('${
                    newCover
                      ? newCover.source
                      : organization.cover && organization.cover.image_url
                  }')`
                : undefined,
          }}
        >
          {newCover ? (
            // @ts-ignore
            <UpdateCoverButton
              as="button"
              type="button"
              className="btn bg-green-500 tc-white absolute shadow"
              disabled={newCover.uploading}
              onClick={handleNewCoverSubmit}
            >
              <Icon name="save" className="mr-2" />
              <FormattedMessage
                id="organizationPageHeader.saveNewCover"
                defaultMessage="Salvar alteração da capa"
              />
              {newCover.uploading && (
                <ActivityIndicator size={24} fill="#fff" className="ml-2" />
              )}
            </UpdateCoverButton>
          ) : (
            <UpdateCoverButton className="btn bg-white absolute shadow inputFileWrapper">
              <input
                name="cover"
                type="file"
                onChange={handleCoverInputFileChange}
              />
              <Icon name="edit" className="mr-2" />
              <FormattedMessage
                id="organizationPageHeader.editCover"
                defaultMessage="Alterar capa"
              />
            </UpdateCoverButton>
          )}
          <svg
            viewBox="0 0 1100 40"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            className="block"
          >
            <g
              id="Artboard"
              stroke="none"
              strokeWidth="1"
              fill="none"
              fillRule="evenodd"
            >
              <g id="divider-2" fill="#fff" fillRule="nonzero">
                <path
                  d="M0,0 C0,0 0,0 0,0 C5.83593225e-16,4.76540032 3.71405885,8.7050829 8.47118281,8.98581743 C8.68506253,8.99843826 8.86737677,9.01328944 9.01812555,9.03037095 C189.345417,29.463457 369.672708,39.68 550,39.68 C730.313224,39.68 910.626447,29.465051 1090.93967,9.03515285 C1091.09612,9.01742695 1091.28874,9.00192937 1091.51753,8.98866009 C1096.27968,8.71248671 1100,4.77015153 1100,0 C1100,0 1100,0 1100,0 L1100,40 L0,40 L0,0 Z"
                  id="Path"
                ></path>
              </g>
            </g>
          </svg>
        </Cover>
        <Photo
          className="z-5 relative bg-contain mb-4"
          image={organization.image}
          fallBackClassName="bg-gray-300"
        />
        <span className="block tc-secondary-500 tt-upper tw-medium mb-1">
          {organization.address ? organization.address.city_state : ''}
        </span>
        <h1 className="h2 tw-medium mb-1">
          {organization.name}

          {organization.verified && (
            <OrganizationVerificationBadge className="w-6 h-6 ml-2" />
          )}
        </h1>
        <p className="tc-gray-700 ts-medium">{organization.description}</p>
        <div>
          {organization.causes.map(cause => (
            <PageLink key={cause.id} href="Cause" params={{ slug: cause.slug }}>
              <a className="tc-gray-600 mr-3">
                <span
                  className="w-2 h-2 inline-block mr-2 rounded-circle vertical-align-middle"
                  style={{ backgroundColor: cause.color }}
                />
                {cause.name}
              </a>
            </PageLink>
          ))}
        </div>
      </div>
    </div>
  )
}

OrganizationPageHeader.displayName = 'OrganizationPageHeader'

export default OrganizationPageHeader

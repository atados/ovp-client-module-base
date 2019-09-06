import React from 'react'
import styled from 'styled-components'
import { InputAddressValueType } from '~/components/InputAddress/InputAddress'
import { InputImageValueType } from '~/components/InputImage/InputImage'
import { styles } from '~/components/OrganizationCard/OrganizationCard'
import { channel } from '~/base/common/constants'

const Container = styled.div`
  max-width: 300px;
`

const InfoPlaceholder = styled.div`
  width: 75%;
  height: 18px;
  background: ${channel.theme.color.secondary[500]};
  margin-bottom: 8px;
`

const NamePlaceholder = styled.div`
  width: 100%;
  height: 21px;
  background: #999;
  margin-bottom: 8px;
`

const DescriptionPlaceholder = styled.div`
  position: relative;
  margin-top: 8px;

  &,
  &::after,
  &::before {
    width: 100%;
    height: 16px;
    background: #ddd;
  }

  &::after,
  &::before {
    content: '';
    display: block;
    position: absolute;
  }

  &::before {
    top: 24px;
  }

  &::after {
    top: 48px;
    width: 50%;
  }
`

const { Header, HeaderInner, Info, Description, Name } = styles

interface OrganizationComposerCardProps {
  readonly className?: string
  readonly name?: string
  readonly description?: string
  readonly image?: InputImageValueType
  readonly address?: InputAddressValueType
}

const OrganizationComposerCard: React.FC<OrganizationComposerCardProps> = ({
  className,
  image,
  name,
  description,
  address,
}) => (
  <Container className={className}>
    <Header
      className="ratio"
      style={{
        backgroundColor: image ? '#fff' : undefined,
        backgroundImage: image ? `url('${image.previewURI}')` : undefined,
      }}
    >
      <HeaderInner className="ratio-fill" style={{ paddingTop: '100%' }} />
    </Header>
    {address ? (
      <Info className="w-full tc-secondary-500">
        {address.node.description}
      </Info>
    ) : (
      <InfoPlaceholder />
    )}
    {name ? <Name className="text-truncate">{name}</Name> : <NamePlaceholder />}
    {description ? (
      <Description>{description}</Description>
    ) : (
      <DescriptionPlaceholder />
    )}
  </Container>
)

OrganizationComposerCard.displayName = 'OrganizationComposerCard'
OrganizationComposerCard.defaultProps = {
  className: undefined,
}

export default OrganizationComposerCard

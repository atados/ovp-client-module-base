import React, { useMemo } from 'react'
import styled from 'styled-components'
import Icon from '~/components/Icon'
import { InputAddressValueType } from '~/components/InputAddress/InputAddress'
import { InputImageValueType } from '~/components/InputImage/InputImage'
import { styles } from '~/components/ProjectCard/ProjectCard'
import useMultipleStepsForm from '~/hooks/use-multiple-steps-form'
import { Project } from '~/redux/ducks/project'

const Container = styled.div`
  max-width: 300px;
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

const { Author, Footer, Header, HeaderInner, Info, Description, Name } = styles

interface ProjectComposerCardProps {
  readonly className?: string
  readonly values: Partial<Pick<Project, 'name' | 'description'>> & {
    address?: InputAddressValueType
    image?: InputImageValueType
  }
}

const ProjectComposerCard: React.FC<ProjectComposerCardProps> = ({
  className,
  values,
}) => {
  const { value, context } = useMultipleStepsForm()
  const { image, name, description, address, organization } = useMemo(
    () => ({
      ...value,
      ...context,
      ...values,
    }),
    [value, context, values],
  )

  return (
    <Container className={className}>
      <Header
        className="ratio"
        style={{
          backgroundColor: image ? '#fff' : undefined,
          backgroundImage: image ? `url('${image.previewURI}')` : undefined,
        }}
      >
        <HeaderInner
          className="ratio-fill"
          style={{ paddingTop: '66.666666666%' }}
        />
      </Header>
      <Author>
        por{' '}
        {organization && <span className="tc-link">{organization.name}</span>}
      </Author>
      {name ? (
        <Name className="text-truncate">{name}</Name>
      ) : (
        <NamePlaceholder />
      )}
      {description ? (
        <Description>{description}</Description>
      ) : (
        <DescriptionPlaceholder />
      )}
      <Footer className="row">
        {address && (
          <div className="col-6">
            <Info title={address.node.description} className="w-full">
              <Icon name="place" /> {address.node.description}
            </Info>
          </div>
        )}
      </Footer>
    </Container>
  )
}

ProjectComposerCard.displayName = 'ProjectComposerCard'

export default ProjectComposerCard

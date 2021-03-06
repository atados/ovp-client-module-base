import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import Link from 'next/link'
import React from 'react'

import useCauses from '~/hooks/use-causes'
import { Page, PageAs } from '~/common'
import { API } from '~/types/api'

import PageLink from '../PageLink'
import Icon from '../Icon'

export interface CausesSectionProps {
  readonly causes?: API.Cause[]
  readonly titleClassName?: string
  readonly className?: string
}

const Container = styled.div``

const SectionTitle = styled.h3`
  font-size: 24px;
  color: rgb(72, 72, 72);
  margin-bottom: 0;
`

const SectionSubtitle = styled.p`
  font-size: 18px;
  color: #999;
`

const Name = styled.h4`
  font-size: 16px;
  color: #fff;
  position: absolute;
  left: 15px;
  right: 15px;
  bottom: 20px;
  font-weight: 500;
  text-align: center;
  z-index: 2;
  text-decoration: none;
  transition: bottom 0.3s;
`

const Card = styled.div`
  display: inline-block;
  width: 100%;
  height: 100%;
  background: #eee;
  border-radius: 10px;
  position: relative;
  background-size: cover;
  background-position: center;

  &:hover ${Name} {
    bottom: 25px;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border-radius: 10px;
    background-image: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0)
    );
  }
`

const CausesSection: React.FC<CausesSectionProps> = ({
  titleClassName,
  ...props
}) => {
  const { causes, loading } = useCauses()

  if (loading || !causes?.length) {
    return null
  }

  return (
    <Container {...props}>
      <SectionTitle className={titleClassName}>
        <FormattedMessage
          id="causesSection.title"
          defaultMessage="Encontre sua causa"
        />
      </SectionTitle>
      <SectionSubtitle>
        <FormattedMessage
          id="causesSection.subtitle"
          defaultMessage="Clique numa causa e encontre vagas relacionadas"
        />
      </SectionSubtitle>

      <div className="flex -mx-2 flex-wrap">
        {causes?.slice(0, 6).map(cause => (
          <Link
            as={PageAs.Cause({ slug: cause.slug })}
            href={Page.Cause}
            key={cause.id}
          >
            <a className="px-2 w-1/2 md:w-1/3 lg:w-1/6 mb-6">
              <div className="ratio">
                <span
                  className="ratio-fill"
                  style={{
                    paddingTop: '100%',
                  }}
                />
                <div className="ratio-body">
                  <Card
                    style={{
                      backgroundColor: cause.color,
                      backgroundImage: cause.image
                        ? `url('${cause.image.image_url}')`
                        : undefined,
                    }}
                  >
                    <Name>{cause.name}</Name>
                  </Card>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
      <PageLink href="Cause" params={{ slug: causes[0].slug }}>
        <a className="text-xl text-secondary-500">
          <FormattedMessage
            id="causesSection.viewAll"
            defaultMessage="Veja todas as causas"
          />{' '}
          <Icon name="arrow_forward" className="ml-1" />
        </a>
      </PageLink>
    </Container>
  )
}

CausesSection.displayName = 'CausesSection'

export default CausesSection

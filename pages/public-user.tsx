import { NextPageContext, NextPage } from 'next'
import Link from 'next/link'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Meta from '~/components/Meta'
import PublicUserLayout from '~/components/PublicUserLayout'
import { getPublicUserLayoutInitialProps } from '~/components/PublicUserLayout/PublicUserLayout'
import PublicUserTimeline from '~/components/PublicUserTimeline'
import { PublicUser } from '~/redux/ducks/public-user'
import { RootState } from '~/redux/root-reducer'
import { PageAs, Page, Config } from '~/common'

const Causes = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  > li {
    margin-right: 10px;
    display: inline-block;
    vertical-align: top;
  }

  > li > a {
    color: #333;
  }
`

const CauseIndicator = styled.span`
  display: inline-block;
  vertical-align: top;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #999;
  margin: 7px 5px 0 0;
`

const SkillList = styled.div`
  margin: -5px;
`
const SkillItem = styled.div`
  color: #ca5200;
  background: #ffeee3;
  border-radius: 3px;
  padding: 3px 7px;
  display: inline-block;
  margin: 5px;
`

const Info = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  border-bottom: 1px solid #ddd;
`

const InfoItem = styled.li`
  display: inline-block;
  border-right: 1px solid #eee;
  padding: 10px 16px;

  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    border-right-width: 0;
    padding-right: 0;
  }
`

const InfoItemValue = styled.h3`
  font-weight: normal;
  font-size: 24px;
  margin-bottom: 0;
`

const InfoItemLabel = styled.span`
  font-size: 13px;
  color: #666;
  font-weight: 500;
`

export interface PublicUserPageProps {
  readonly isAuthenticatedUser?: boolean
  readonly publicUser?: PublicUser
}

const PublicUserPage: NextPage<PublicUserPageProps> = ({ publicUser }) => {
  if (!publicUser) {
    return <PublicUserLayout />
  }

  return (
    <PublicUserLayout>
      <Meta title={publicUser.name} description={publicUser.profile.about} />

      <Info className="mb-6">
        {Config.volunteer.showHours && (
          <InfoItem>
            <InfoItemValue>{publicUser.volunteer_hours || 0}</InfoItemValue>
            <InfoItemLabel className="truncate">
              HORAS DE VOLUNTARIADO
            </InfoItemLabel>
          </InfoItem>
        )}
        <InfoItem>
          <InfoItemValue>{publicUser.applies.length}</InfoItemValue>
          <InfoItemLabel className="truncate">
            PARTICIPAÇÕES VOLUNTÁRIAS
          </InfoItemLabel>
        </InfoItem>
      </Info>
      {publicUser.profile.causes && publicUser.profile.causes.length > 0 && (
        <>
          <h4 className="text-lg">Causas preferidas</h4>
          <Causes className="mb-6">
            {publicUser.profile.causes.map(cause => (
              <li key={cause.id}>
                <Link as={PageAs.Cause({ slug: cause.slug })} href={Page.Cause}>
                  <a>
                    <CauseIndicator style={{ backgroundColor: cause.color }} />
                    {cause.name}
                  </a>
                </Link>
              </li>
            ))}
          </Causes>
        </>
      )}
      {publicUser.profile.skills && publicUser.profile.skills.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg">Habilidades</h4>
          <SkillList>
            {publicUser.profile.skills.map(skill => (
              <SkillItem key={skill.id}>{skill.name}</SkillItem>
            ))}
          </SkillList>
        </div>
      )}
      <PublicUserTimeline
        applies={publicUser.applies.filter(
          application => !application.canceled,
        )}
      />
    </PublicUserLayout>
  )
}

PublicUserPage.displayName = 'PublicUserPage'
PublicUserPage.getInitialProps = async (context: NextPageContext) => {
  return getPublicUserLayoutInitialProps(context)
}

const mapStateToProps = ({ user, publicUser }: RootState) => ({
  isAuthenticatedUser: !!(
    publicUser.node &&
    user &&
    user.slug === publicUser.node.slug
  ),
  publicUser: publicUser.node,
})

export default connect(mapStateToProps)(PublicUserPage)

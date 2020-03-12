import React from 'react'
import { defineMessages } from 'react-intl'
import styled from 'styled-components'
import { Color, Config } from '~/common'
import { rgba } from '~/lib/color/transformers'
import { useIntl } from 'react-intl'
import { colors } from '~/common/constants'

const RoleApply = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  border-radius: 10px;
  background: ${rgba(Color.primary[500], 90)};
  opacity: 0;
  transition: opacity 0.2s;
  cursor: pointer;
  color: #fff;
  font-size: 18px;
  text-align: center;

  > div {
    display: none;
    height: 40px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
`

const Role = styled.button`
  padding: 16px;
  border: 1px solid #e5e5e5;
  background: #fff;
  border-radius: 10px;
  width: 100%;
  text-align: left;
  outline: none;
  position: relative;

  &:hover ${RoleApply} {
    opacity: 1;

    > div {
      display: block;
    }
  }
`

const RoleName = styled.h2`
  font-size: 20px;
  font-weight: normal;
  line-height: 1.5;
`

const RoleSectionTitle = styled.h3`
  font-size: 12px;
  color: #666;
  font-weight: 500;
`

const RoleText = styled.p`
  font-size: 16px;
  margin-bottom: 12px;
`

const Apply = styled.li`
  width: 28px;
  height: 28px;
  border: 3px solid #fff;
  display: inline-block;
  border-radius: 50%;
  background-color: #eee;
  background-size: cover;
  background-position: center;
  vertical-align: top;

  > a {
    width: 100%;
    height: 100%;
    display: block;
  }

  &.apply__more {
    font-size: 11px;
    text-align: center;
    line-height: 2.2;
    background: #0288f6;
    color: #fff;
  }
`

const Applies = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: inline-block;

  ${Apply} + ${Apply} {
    margin-left: -12px;
  }
`

const { QUERO_CONTRIBUIR, FUNCAO, PRE_REQUISITOS, SEM_VAGAS } = defineMessages({
  QUERO_CONTRIBUIR: {
    id: 'QUERO_CONTRIBUIR',
    defaultMessage: 'Quero contribuir como',
  },
  FUNCAO: {
    id: 'FUNCAO',
    defaultMessage: 'FUNÇÃO',
  },
  PRE_REQUISITOS: {
    id: 'PRE_REQUISITOS',
    defaultMessage: 'PRÉ-REQUISITOS',
  },
  SEM_VAGAS: {
    id: 'SEM VAGAS',
    defaultMessage: 'SEM VAGAS',
  },
})

const ProjectPageRoleItem = ({ role, onApply, project }) => {
  const intl = useIntl()
  const hasVacancies = role.applied_count < role.vacancies
  const disableCard = Config.project.blockApplicationsAtLimit && !hasVacancies

  return (
    <Role
      key={role.id}
      type="button"
      className={`mb-6 ${disableCard ? 'opacity-50 cursor-default' : ''}`}
      disabled={disableCard}
      onClick={onApply ? () => onApply(role.id) : undefined}
    >
      {!disableCard && (
        <RoleApply>
          <div className="animte-slideInUp">
            {intl.formatMessage(QUERO_CONTRIBUIR)}{' '}
            <b className="block">{role.name}</b>
          </div>
        </RoleApply>
      )}
      <RoleName>{role.name}</RoleName>
      <RoleSectionTitle>{intl.formatMessage(FUNCAO)}</RoleSectionTitle>
      <RoleText>{role.details}</RoleText>
      <RoleSectionTitle>{intl.formatMessage(PRE_REQUISITOS)}</RoleSectionTitle>
      <RoleText>{role.prerequisites}</RoleText>
      <div className="flex">
        {disableCard ? (
          <span className="font-medium mr-2 text-red-700">
            {intl.formatMessage(SEM_VAGAS)}
          </span>
        ) : (
          <span className="font-medium mr-2">
            {role.applied_count}/{role.vacancies}
          </span>
        )}
        <div className="mr-auto" />
        {role.applies && role.applies.length > 0 && (
          <Applies className="mr-2">
            {role.applies.slice(0, 10).map((application, i) => (
              <Apply
                key={application.user ? application.user.uuid : i}
                style={{
                  backgroundColor: colors[i],
                  backgroundImage:
                    application.user && application.user.avatar
                      ? `url('${application.user.avatar.image_small_url}')`
                      : undefined,
                }}
              />
            ))}
            {project.applied_count > 10 && (
              <Apply className="apply__more">
                +{Math.min(99, project.applied_count - 10)}
              </Apply>
            )}
          </Applies>
        )}
      </div>
    </Role>
  )
}

export default ProjectPageRoleItem

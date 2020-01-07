import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import { Project } from '~/redux/ducks/project'
import ClosePostForm from '../ClosePostForm'
import Icon from '../Icon'
import { useModal } from '../Modal'
import { defineMessages } from 'react-intl'
import { useIntl } from 'react-intl'
import { Page, PageAs } from '~/base/common'

const Table = styled.table`
  min-width: 900px;
  background: none;

  tr td,
  tr th {
    &:first-child {
      padding-left: 20px;
    }

    &:last-child {
      padding-right: 20px;
    }
  }

  th {
    font-size: 14px;
  }

  td {
    font-size: 16px;
    padding-top: 16px;
    padding-bottom: 16px;
  }
`

const PlaceholderIcon = styled(Icon)`
  font-size: 64px;
  color: #999;
`

interface ProjectManagePagePostsProps {
  readonly className?: string
  readonly organizationSlug?: string
  readonly project: Project
}

const {
  NOVA_PUB,
  PUB,
  ESSA_VAGA,
  AS_PUB,
  ADICIONAR_PRIMEIRA,
  TITULO,
  CONTEUDO,
  ULTIMA,
  REMOVER,
} = defineMessages({
  NOVA_PUB: {
    id: 'NOVA_PUB',
    defaultMessage: 'Nova publicação',
  },
  PUB: {
    id: 'PUB',
    defaultMessage: 'Publicações',
  },
  ESSA_VAGA: {
    id: 'ESSA_VAGA',
    defaultMessage: 'Essa vaga ainda não possui nenhuma publicação',
  },
  AS_PUB: {
    id: 'AS_PUB',
    defaultMessage:
      'As publicações são um espaço para a história dessa vaga. Conta o que ta rolando!',
  },
  ADICIONAR_PRIMEIRA: {
    id: 'ADICIONAR_PRIMEIRA',
    defaultMessage: 'Adicionar primeira publicação',
  },
  TITULO: {
    id: 'TITULO',
    defaultMessage: 'Titulo',
  },
  CONTEUDO: {
    id: 'CONTEUDO',
    defaultMessage: 'Conteúdo',
  },
  ULTIMA: {
    id: 'ULTIMA',
    defaultMessage: 'Ultima atualização',
  },
  REMOVER: {
    id: 'REMOVER',
    defaultMessage: 'Remover',
  },
})

const ProjectManagePagePosts: React.FC<ProjectManagePagePostsProps> = ({
  className,
  project,
  organizationSlug,
}) => {
  const intl = useIntl()

  const openClosePostModal = useModal({
    id: 'ClosePost',
    component: ClosePostForm,
    cardClassName: 'p-5',
    onClosePropName: 'onFinish',
  })
  const hasPosts = project.posts && project.posts.length !== 0

  return (
    <div
      id="posts"
      className={`rounded-lg bg-white shadow mb-6${
        className ? ` ${className}` : ''
      }`}
    >
      <div className="p-4 relative">
        {hasPosts && (
          <Link
            href={
              organizationSlug
                ? Page.OrganizationProjectNewPost
                : Page.ProjectNewPost
            }
            as={
              organizationSlug
                ? PageAs.OrganizationProjectNewPost({
                    organizationSlug,
                    projectSlug: project.slug,
                  })
                : PageAs.ProjectNewPost({ projectSlug: project.slug })
            }
          >
            <a className="btn btn-outline-primary float-right">
              <Icon name="add" className="mr-2" />
              {intl.formatMessage(NOVA_PUB)}
            </a>
          </Link>
        )}
        <h4 className="font-normal mb-0">{intl.formatMessage(PUB)}</h4>
      </div>
      {!hasPosts && (
        <div className="pb-8 text-center">
          <PlaceholderIcon name="library_books" />
          <span className="h4 block font-normal mb-2">
            {intl.formatMessage(ESSA_VAGA)}
          </span>
          <span className="text-gray-600 block mb-4">
            {intl.formatMessage(AS_PUB)}
          </span>
          <Link
            href={
              organizationSlug
                ? Page.OrganizationProjectNewPost
                : Page.ProjectNewPost
            }
            as={
              organizationSlug
                ? PageAs.OrganizationProjectNewPost({
                    organizationSlug,
                    projectSlug: project.slug,
                  })
                : PageAs.ProjectNewPost({ projectSlug: project.slug })
            }
          >
            <a className="btn btn-outline-primary">
              <Icon name="add" /> {intl.formatMessage(ADICIONAR_PRIMEIRA)}
            </a>
          </Link>
        </div>
      )}
      {hasPosts && (
        <Table className="table card-item borderless">
          <thead>
            <tr>
              <th>{intl.formatMessage(TITULO)}</th>
              <th>{intl.formatMessage(CONTEUDO)}</th>
              <th>{intl.formatMessage(ULTIMA)}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {project.posts &&
              project.posts.map(post => (
                <tr key={post.id}>
                  <td>{post.title || 'Atualizações'}</td>
                  <td className="truncate" style={{ maxWidth: '200px' }}>
                    {post.content.substr(0, 150)}
                  </td>
                  <td>{moment(post.modified_date).fromNow()}</td>
                  <td style={{ width: 190 }} className="text-right">
                    <Link
                      href={
                        organizationSlug
                          ? Page.OrganizationProjectEditPost
                          : Page.ProjectEditPost
                      }
                      as={
                        organizationSlug
                          ? PageAs.OrganizationProjectEditPost({
                              postId: post.id,
                              organizationSlug,
                              projectSlug: project.slug,
                            })
                          : PageAs.ProjectEditPost({
                              postId: post.id,
                              projectSlug: project.slug,
                            })
                      }
                    >
                      <a className="btn btn-muted btn--size-2 mr-2">
                        <Icon name="edit" className="mr-1" />
                        Editar
                      </a>
                    </Link>
                    <button
                      type="button"
                      className="btn btn-muted text-red-600 btn--size-2"
                      onClick={() => openClosePostModal({ project, post })}
                    >
                      {intl.formatMessage(REMOVER)}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}

ProjectManagePagePosts.displayName = 'ProjectManagePagePosts'

export default React.memo(ProjectManagePagePosts)

import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import { resolvePage } from '~/common/page'
import { Project } from '~/redux/ducks/project'
import ClosePostForm from '../ClosePostForm'
import Icon from '../Icon'
import { useModal } from '../Modal'
import { defineMessages } from 'react-intl'
import useIntl from '~/hooks/use-intl'

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
  NAO_PODE,
  DESCREVA,
  IMPORTANCIA,
  PUBLICO,
  SE_HOUVER,
  ETAPA4,
  SOBRE,
  DESCREVA_CLAREZA,
  HINT,
  PLACEHOLDER,
} = defineMessages({
  NAO_PODE: {
    id: 'NAO_PODE',
    defaultMessage: 'O que não pode faltar!',
  },
  DESCREVA: {
    id: 'DESCREVA',
    defaultMessage: 'Descreva as atividades que o voluntário (a) irá realizar;',
  },
  IMPORTANCIA: {
    id: 'IMPORTANCIA',
    defaultMessage: 'Importância da ação;',
  },
  PUBLICO: {
    id: 'PUBLICO',
    defaultMessage: 'Público que será atendido pelo voluntariado;',
  },
  SE_HOUVER: {
    id: 'SE_HOUVER',
    defaultMessage: 'Se houver capacitação, é importante mencionar;',
  },
  ETAPA4: {
    id: 'ETAPA4',
    defaultMessage: 'ETAPA 4',
  },
  SOBRE: {
    id: 'SOBRE',
    defaultMessage: 'Sobre a Vaga',
  },
  DESCREVA_CLAREZA: {
    id: 'DESCREVA_CLAREZA',
    defaultMessage: 'Descreva com clareza a finalidade da vaga.',
  },
  HINT: {
    id: 'HINT',
    defaultMessage: 'Você pode adicionar links e formatações ao texto.',
  },
  PLACEHOLDER: {
    id: 'PLACEHOLDER',
    defaultMessage:
      'Faça uma descrição completa e deixa um bom convite. Isso garante que mais voluntários se candidatem a esta vaga.',
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
      className={`radius-10 bg-white shadow mb-4${
        className ? ` ${className}` : ''
      }`}
    >
      <div className="p-4 pos-relative">
        {hasPosts && (
          <Link
            href={{
              pathname: resolvePage('/post-form'),
              query: {
                nodeKind: 'project',
                nodeSlug: project.slug,
                organizationSlug,
              },
            }}
            as={
              organizationSlug
                ? `/ong/${organizationSlug}/vaga/${project.slug}/publicacoes/nova`
                : `/minhas-vagas/vaga/${project.slug}/publicacoes/nova`
            }
          >
            <a className="btn btn-outline-primary float-right">
              <Icon name="add" className="mr-2" />
              Nova publicação
            </a>
          </Link>
        )}
        <h4 className="tw-normal mb-0">Publicações</h4>
      </div>
      {!hasPosts && (
        <div className="pb-5 ta-center">
          <PlaceholderIcon name="library_books" />
          <span className="h4 d-block tw-normal mb-2">
            Essa vaga ainda não possui nenhuma publicação
          </span>
          <span className="tc-muted d-block mb-3">
            As publicações são um espaço para a história dessa vaga. Conta o que
            ta rolando!
          </span>
          <Link
            href={{
              pathname: resolvePage('/post-form'),
              query: {
                nodeKind: 'project',
                nodeSlug: project.slug,
                organizationSlug,
              },
            }}
            as={
              organizationSlug
                ? `/ong/${organizationSlug}/vaga/${project.slug}/publicacoes/nova`
                : `/minhas-vagas/vaga/${project.slug}/publicacoes/nova`
            }
          >
            <a className="btn btn-outline-primary">
              <Icon name="add" /> Adicionar primeira publicação
            </a>
          </Link>
        </div>
      )}
      {hasPosts && (
        <Table className="table card-item borderless">
          <thead>
            <tr>
              <th>Titulo</th>
              <th>Conteúdo</th>
              <th>Ultima atualização</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {project.posts &&
              project.posts.map(post => (
                <tr key={post.id}>
                  <td>{post.title || 'Atualizações'}</td>
                  <td className="text-truncate" style={{ maxWidth: '200px' }}>
                    {post.content.substr(0, 150)}
                  </td>
                  <td>{moment(post.modified_date).fromNow()}</td>
                  <td style={{ width: 190 }} className="ta-right">
                    <Link
                      href={{
                        pathname: resolvePage('/post-form'),
                        query: {
                          nodeKind: 'project',
                          nodeSlug: project.slug,
                          organizationSlug,
                          postId: post.id,
                        },
                      }}
                      as={
                        organizationSlug
                          ? `/ong/${organizationSlug}/vaga/${project.slug}/publicacoes/editar/${post.id}`
                          : `/minhas-vagas/vaga/${project.slug}/publicacoes/editar/${post.id}`
                      }
                    >
                      <a className="btn btn-muted btn--size-2 mr-2">
                        <Icon name="edit" className="mr-1" />
                        Editar
                      </a>
                    </Link>
                    <button
                      type="button"
                      className="btn btn-muted tc-error btn--size-2"
                      onClick={() => openClosePostModal({ project, post })}
                    >
                      Remover
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

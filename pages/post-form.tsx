import { NextPage } from 'next'
import Link from 'next/link'
import Router from 'next/router'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { connect } from 'react-redux'
import Textarea from 'react-textarea-autosize'
import styled from 'styled-components'
import ActivityIndicator from '~/components/ActivityIndicator'
import Icon from '~/components/Icon'
import Layout from '~/components/Layout'
import MarkdownEditor from '~/components/MarkdownEditor'
import OrganizationLayout from '~/components/OrganizationLayout/OrganizationLayout'
import useFetchAPIMutation from '~/hooks/use-fetch-api-mutation'
import { NotFoundPageError } from '~/lib/next/errors'
import { throwActionError } from '~/lib/utils/redux'
import { fetchProject, Project, updateProject } from '~/redux/ducks/project'
import { UserOrganization } from '~/redux/ducks/user'
import { RootState } from '~/redux/root-reducer'
import { API } from '~/types/api'
import { ProjectPageSubPage } from '~/types/project'
import { Page, PageAs } from '~/common'

const Content = styled.div`
  max-width: 700px;
  margin: 0 auto;
`

const Editor = styled(MarkdownEditor)`
  min-height: 50vh;
  padding-top: 10px !important;

  > .input {
    border-width: 0;
    padding: 0 !important;
    font-size: 20px !important;
    line-height: 1.5 !important;
  }
`

const TitleInput = styled(Textarea)`
  border-width: 0;
  padding: 0;
  font-size: 42px;
  background: none;
  resize: none;
  font-weight: 500;
`

type PostFormNodeKind = 'project'

interface PostFormPageInitialProps {
  readonly nodeKind: PostFormNodeKind
  readonly nodeSlug: string
  readonly organizationSlug?: string
  readonly postId?: number
}

interface PostFormPageProps extends PostFormPageInitialProps {
  readonly organization?: UserOrganization
  readonly parentNode?: Project
  readonly dispatchProjectChange: (
    changes: Partial<Project> & { slug: string },
  ) => void
}

const PostFormPage: NextPage<PostFormPageProps, PostFormPageInitialProps> = ({
  organization,
  parentNode,
  postId,
  dispatchProjectChange,
}) => {
  const [defaultValue, defaultTitleValue] = useMemo(() => {
    if (postId && parentNode) {
      const post = parentNode.posts.find(postItem => postItem.id === postId)

      return post ? [post.content, post.title] : ['', '']
    }

    return ['', '']
  }, [postId])
  const [state, setState] = useState({
    titleInputValue: defaultTitleValue,
    renderEditor: false,
  })
  const contentValueRef = useRef(defaultValue)
  const handleTitleInputChange = (event: React.ChangeEvent<any>) => {
    setState({
      ...state,
      titleInputValue: event.target.value,
    })
  }

  const handleEditorChange = useCallback(
    (newValue: string) => {
      contentValueRef.current = newValue
    },
    [contentValueRef.current],
  )

  useEffect(() => {
    if (defaultTitleValue !== state.titleInputValue) {
      setState(prevState => ({
        ...prevState,
        titleInputValue: defaultTitleValue,
      }))
    }
  }, [defaultTitleValue])

  useEffect(() => {
    // Prevent editor from rendering on the server
    // It throws an error
    setState(currentState => ({ ...currentState, renderEditor: true }))
  }, [])

  const submitMutation = useFetchAPIMutation<API.Post>(() => ({
    method: postId ? 'PATCH' : 'POST',
    endpoint: postId
      ? `/projects/${parentNode ? parentNode.slug : ''}/post/${postId}/`
      : `/projects/${parentNode ? parentNode.slug : ''}/post/`,
  }))
  const updateNodeTrigger = useFetchAPIMutation(() => ({
    method: 'PATCH',
    endpoint: `/projects/${parentNode ? parentNode.slug : ''}/`,
  }))
  const handleSubmit = useCallback(async () => {
    if (!parentNode) {
      return
    }

    let post: API.Post | undefined
    if (postId) {
      const result = await submitMutation.mutate({
        title: state.titleInputValue,
        content: contentValueRef.current,
      })
      post = result.data

      dispatchProjectChange({
        slug: parentNode.slug,
        posts: parentNode.posts.map(parentNodePost => {
          if (parentNodePost.id === postId) {
            return {
              ...post!,
              id: postId,
            }
          }

          return parentNodePost
        }),
      })
    } else {
      const result = await submitMutation.mutate({
        title: state.titleInputValue,
        content: contentValueRef.current,
      })
      post = result.data
      await updateNodeTrigger.mutate({
        posts: [
          ...parentNode.posts,
          {
            id: post!.id,
          },
        ],
      })

      dispatchProjectChange({
        slug: parentNode.slug,
        posts: [post!, ...parentNode.posts],
      })
    }

    Router.push(
      `/project?slug=${parentNode.slug}&subpage=${ProjectPageSubPage.Stories}`,
      `/vaga/${parentNode.slug}/${ProjectPageSubPage.Stories}`,
    )
  }, [postId, parentNode, state, submitMutation.mutate])

  const children = !parentNode ? (
    <div className="py-8 text-center">
      <ActivityIndicator size={48} fill="#999" />
    </div>
  ) : (
    <>
      <nav className="py-4 shadow-sm">
        <div className="container flex">
          <Link
            href={
              organization
                ? Page.OrganizationDashboardProject
                : Page.ViewerProjectDashboard
            }
            as={
              organization
                ? PageAs.OrganizationDashboardProject({
                    organizationSlug: organization.slug,
                    slug: parentNode.slug,
                  })
                : PageAs.ViewerProjectDashboard({ slug: parentNode.slug })
            }
          >
            <a className="media text-base td-hover-none">
              <Icon name="arrow_back" className="mr-2" />
              <div className="media-body">
                <span className="h4 font-normal mb-0 block">
                  {parentNode.name}
                </span>
                <span className="text-sm text-gray-600 font-normal">
                  Nova publicação
                </span>
              </div>
            </a>
          </Link>
          <div className="mr-auto" />
          <div>
            <button
              type="button"
              onClick={handleSubmit}
              className="btn text-white bg-primary-500 hover:bg-primary-600"
            >
              {postId ? 'Salvar alterações' : 'Pronto pra publicar?'}
              {submitMutation.loading ? (
                <ActivityIndicator size={24} fill="#fff" className="ml-2" />
              ) : (
                <Icon name="send" className="ml-2" />
              )}
            </button>
          </div>
        </div>
      </nav>
      <div className="container mt-12">
        <Content>
          <TitleInput
            className="input"
            placeholder="Titulo"
            onChange={handleTitleInputChange}
            value={state.titleInputValue}
          />
          {state.renderEditor && (
            <Editor
              controls={false}
              placeholder="Escreva aqui..."
              defaultValue={defaultValue}
              onChange={handleEditorChange}
            />
          )}
        </Content>
      </div>
    </>
  )

  if (organization) {
    return (
      <OrganizationLayout
        organization={organization}
        isViewerMember
        layoutProps={{ disableFooter: true }}
      >
        {children}
      </OrganizationLayout>
    )
  }

  return <Layout disableFooter>{children}</Layout>
}

PostFormPage.displayName = 'PostFormPage'
PostFormPage.getInitialProps = async ({ query, store }) => {
  const nodeSlug = query.nodeSlug && String(query.nodeSlug)
  const nodeKind = query.nodeKind && String(query.nodeKind)

  let node: Project | undefined
  if (nodeSlug && nodeKind === 'project') {
    node = await store.dispatch(fetchProject(nodeSlug)).then(throwActionError)
  }

  if (!node) {
    throw new NotFoundPageError()
  }

  return {
    nodeSlug: String(query.nodeSlug),
    nodeKind: nodeKind as PostFormNodeKind,
    postId: query.postId ? parseInt(String(query.postId), 10) : undefined,
    organizationSlug: query.organizationSlug && String(query.organizationSlug),
  }
}

const mapStateToProps = (
  { user, project }: RootState,
  { organizationSlug, nodeSlug },
) => {
  return {
    viewer: user!,
    parentNode: project.slug === nodeSlug ? project.node : undefined,
    organization:
      (organizationSlug &&
        user &&
        user.organizations.find(
          userOrganization => userOrganization.slug === organizationSlug,
        )) ||
      undefined,
  }
}

export default connect(mapStateToProps, {
  dispatchProjectChange: updateProject,
})(PostFormPage)

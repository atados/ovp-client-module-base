import React from 'react'
import { connect } from 'react-redux'
import { Waypoint } from 'react-waypoint'
import styled from 'styled-components'
import { BlogPost, fetchBlogPosts } from '~/redux/ducks/blog'
import { RootState } from '~/redux/root-reducer'
import Icon from '../Icon'

const Post = styled.a`
  border-radius: 10px;
  min-height: 200px;
  color: #333;
  display: block;

  &:hover {
    text-decoration: none;
  }
`

const Thumbnail = styled.div`
  width: 100%;
  border-radius: 10px 10px 0 0;
  height: 150px;
  background-color: #eee;
`

const PostBody = styled.div`
  max-height: 190px;
  overflow: hidden;
`

interface BlogSectionProps {
  readonly className?: string
  readonly onLoad: (filters?: string) => any
  readonly filters?: string
  readonly posts: BlogPost[]
}

const BlogSection: React.FC<BlogSectionProps> = ({
  onLoad,
  posts,
  filters,
}) => (
  <Waypoint onEnter={() => onLoad(filters)}>
    <div>
      {' '}
      <h4 className="mb-0">Leia as publicações do nosso blog</h4>
      <p className="tc-muted mb-3">Publicando gente boa</p>
      <div className="row">
        {posts.map(post => (
          <div key={post.id} className="col-sm-6 col-md-3 mb-4">
            <Post href={post.link} className="bg-muted" target="__blank">
              {post.better_featured_image && (
                <Thumbnail
                  style={{
                    backgroundImage: `url('${post.better_featured_image.media_details.sizes.medium.source_url}')`,
                  }}
                />
              )}
              <div className="p-3">
                <PostBody>
                  <h4 className="ts-normal tl-normal">{post.title.rendered}</h4>
                  <div
                    className="tc-muted ts-small"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />
                </PostBody>
              </div>
            </Post>
          </div>
        ))}
      </div>
      <a
        href="https://blog.atados.com.br/"
        className="ts-medium"
        target="__blank"
      >
        Ver todas as publicações no blog
        <Icon name="arrow_forward" className="ml-2" />
      </a>
    </div>
  </Waypoint>
)

BlogSection.displayName = 'BlogSection'

const mapStateToProps = ({ blog }: RootState) => ({
  fetching: blog.fetching,
  fetched: blog.fetched,
  posts: blog.nodes,
})

const mapDispatchToProps = dispatch => ({
  onLoad: filters => dispatch(fetchBlogPosts(filters)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BlogSection)

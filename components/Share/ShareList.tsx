import * as React from 'react'
import styled from 'styled-components'
import ShareButton from '~/components/Share/ShareButton'

const Item = styled.button`
  position: relative;
  background: none;
  border: 0;
  display: block;
  padding: 0 0 0 60px;
  font-size: 18px;
  width: 100%;
  text-align: left;
  cursor: pointer;

  &:hover > span {
    text-decoration: underline;
  }

  > small {
    display: block;
    color: #999;
  }
`

const ItemIcon = styled.svg`
  display: block;
  position: absolute;
  left: 10px;
  top: 0;
  bottom: 0;
  margin: auto;
`

export interface ShareListProps {
  readonly className?: string
  readonly title?: string
  readonly subtitle?: string
  readonly meta: { title: string; description?: string }
  readonly url: string
}

const ShareList: React.SFC<ShareListProps> = ({
  url,
  title,
  subtitle,
  meta,
  className,
}) => {
  return (
    <div className={className}>
      <h2 className="tw-medium">{title}</h2>
      {subtitle && <p className="text-truncate">{subtitle}</p>}
      <ShareButton network="facebook" url={url}>
        <Item className="mt-4">
          <ItemIcon
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 216 216"
            color="#3b5998"
            width="32"
            height="32"
          >
            <path
              fill="#3b5998"
              d="
            M204.1 0H11.9C5.3 0 0 5.3 0 11.9v192.2c0 6.6 5.3 11.9 11.9
            11.9h103.5v-83.6H87.2V99.8h28.1v-24c0-27.9 17-43.1 41.9-43.1
            11.9 0 22.2.9 25.2 1.3v29.2h-17.3c-13.5 0-16.2 6.4-16.2
            15.9v20.8h32.3l-4.2 32.6h-28V216h55c6.6 0 11.9-5.3
            11.9-11.9V11.9C216 5.3 210.7 0 204.1 0z"
            />
          </ItemIcon>
          <small>Compartilhar no</small>
          <span>Facebook</span>
        </Item>
      </ShareButton>
      <hr className="my-3" />
      <ShareButton network="twitter" url={url} meta={meta}>
        <Item>
          <ItemIcon
            viewBox="0 0 32 32"
            role="presentation"
            aria-hidden="true"
            focusable="false"
            width="32"
            height="32"
          >
            <path
              fill="#1da1f2"
              d="m31 6.36c-1.16.49-2.32.82-3.55.95 1.29-.76 2.22-1.87 2.72-3.38a13.05 13.05 0 0 1 -3.91 1.51c-1.23-1.28-2.75-1.94-4.51-1.94-3.41 0-6.17 2.73-6.17 6.12 0 .49.07.95.17 1.38-4.94-.23-9.51-2.6-12.66-6.38-.56.95-.86 1.97-.86 3.09 0 2.07 1.03 3.91 2.75 5.06-1-.03-1.92-.3-2.82-.76v.07c0 2.89 2.12 5.42 4.94 5.98-.63.17-1.16.23-1.62.23-.3 0-.7-.03-1.13-.13a6.07 6.07 0 0 0 5.74 4.24c-2.22 1.74-4.78 2.63-7.66 2.63-.56 0-1.06-.03-1.43-.1 2.85 1.84 6 2.76 9.41 2.76 7.29 0 12.83-4.01 15.51-9.3 1.36-2.66 2.02-5.36 2.02-8.09v-.46c-.03-.17-.03-.3-.03-.33a12.66 12.66 0 0 0 3.09-3.16"
              fillRule="evenodd"
            />
          </ItemIcon>
          <small>Compartilhar no</small>
          <span>Twitter</span>
        </Item>
      </ShareButton>
      <hr className="my-3" />
      <ShareButton network="whatsapp" url={url} meta={meta}>
        <Item>
          <ItemIcon
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            x="0px"
            y="0px"
            width="32px"
            height="32px"
            viewBox="0 0 90 90"
          >
            <g>
              <path
                d="M90,43.841c0,24.213-19.779,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455L0,90l7.975-23.522   c-4.023-6.606-6.34-14.354-6.34-22.637C1.635,19.628,21.416,0,45.818,0C70.223,0,90,19.628,90,43.841z M45.818,6.982   c-20.484,0-37.146,16.535-37.146,36.859c0,8.065,2.629,15.534,7.076,21.61L11.107,79.14l14.275-4.537   c5.865,3.851,12.891,6.097,20.437,6.097c20.481,0,37.146-16.533,37.146-36.857S66.301,6.982,45.818,6.982z M68.129,53.938   c-0.273-0.447-0.994-0.717-2.076-1.254c-1.084-0.537-6.41-3.138-7.4-3.495c-0.993-0.358-1.717-0.538-2.438,0.537   c-0.721,1.076-2.797,3.495-3.43,4.212c-0.632,0.719-1.263,0.809-2.347,0.271c-1.082-0.537-4.571-1.673-8.708-5.333   c-3.219-2.848-5.393-6.364-6.025-7.441c-0.631-1.075-0.066-1.656,0.475-2.191c0.488-0.482,1.084-1.255,1.625-1.882   c0.543-0.628,0.723-1.075,1.082-1.793c0.363-0.717,0.182-1.344-0.09-1.883c-0.27-0.537-2.438-5.825-3.34-7.977   c-0.902-2.15-1.803-1.792-2.436-1.792c-0.631,0-1.354-0.09-2.076-0.09c-0.722,0-1.896,0.269-2.889,1.344   c-0.992,1.076-3.789,3.676-3.789,8.963c0,5.288,3.879,10.397,4.422,11.113c0.541,0.716,7.49,11.92,18.5,16.223   C58.2,65.771,58.2,64.336,60.186,64.156c1.984-0.179,6.406-2.599,7.312-5.107C68.398,56.537,68.398,54.386,68.129,53.938z"
                fill="#128c7e"
              />
            </g>
          </ItemIcon>
          <small>Compartilhar no</small>
          <span>WhatsApp</span>
        </Item>
      </ShareButton>
      <hr className="my-3" />
      <ShareButton network="messenger" url={url} meta={meta}>
        <Item className="d-md-none">
          <ItemIcon
            viewBox="0 0 32 32"
            role="presentation"
            aria-hidden="true"
            focusable="false"
            width="32"
            height="32"
          >
            <path
              fill="#0084ff"
              d="m17.59 19.95-4.07-4.35-7.95 4.35 8.74-9.28 4.17 4.35 7.85-4.35zm-1.59-19.95c-8.84 0-16 6.63-16 14.82 0 4.66 2.33 8.82 5.96 11.54v5.64l5.45-2.99a17.24 17.24 0 0 0 4.59.62c8.84 0 16-6.63 16-14.82 0-8.18-7.16-14.81-16-14.81z"
              fillRule="evenodd"
            />
          </ItemIcon>
          <small>Compartilhar no</small>
          <span>Messenger</span>
        </Item>
      </ShareButton>
      <hr className="my-3 d-md-none" />
      <ShareButton network="linkedin" url={url} meta={meta}>
        <Item>
          <ItemIcon
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 382 382"
            width="32"
            height="32"
          >
            <path
              fill="#0077b5"
              d="M347.445,0H34.555C15.471,0,0,15.471,0,34.555v312.889C0,366.529,15.471,382,34.555,382h312.889
	C366.529,382,382,366.529,382,347.444V34.555C382,15.471,366.529,0,347.445,0z M118.207,329.844c0,5.554-4.502,10.056-10.056,10.056
	H65.345c-5.554,0-10.056-4.502-10.056-10.056V150.403c0-5.554,4.502-10.056,10.056-10.056h42.806
	c5.554,0,10.056,4.502,10.056,10.056V329.844z M86.748,123.432c-22.459,0-40.666-18.207-40.666-40.666S64.289,42.1,86.748,42.1
	s40.666,18.207,40.666,40.666S109.208,123.432,86.748,123.432z M341.91,330.654c0,5.106-4.14,9.246-9.246,9.246H286.73
	c-5.106,0-9.246-4.14-9.246-9.246v-84.168c0-12.556,3.683-55.021-32.813-55.021c-28.309,0-34.051,29.066-35.204,42.11v97.079
	c0,5.106-4.139,9.246-9.246,9.246h-44.426c-5.106,0-9.246-4.14-9.246-9.246V149.593c0-5.106,4.14-9.246,9.246-9.246h44.426
	c5.106,0,9.246,4.14,9.246,9.246v15.655c10.497-15.753,26.097-27.912,59.312-27.912c73.552,0,73.131,68.716,73.131,106.472
	L341.91,330.654L341.91,330.654z"
            />
          </ItemIcon>
          <small>Compartilhar no</small>
          <span>Linkedin</span>
        </Item>
      </ShareButton>
    </div>
  )
}

ShareList.displayName = 'ShareList'
ShareList.defaultProps = {
  title: 'Compartilhar',
}

export default ShareList

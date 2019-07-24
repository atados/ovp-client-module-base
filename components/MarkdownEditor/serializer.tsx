import SlateHtmlSerializer from 'slate-html-serializer'

const MARK_TAGS = {
  strong: 'bold',
  em: 'italic',
  b: 'bold',
  i: 'italic',
  s: 'strikethrough',
}

const BLOCK_TAGS = {
  img: 'image',
  // h1: 'heading',
  // h2: 'heading2',
}

export default new SlateHtmlSerializer({
  rules: [
    {
      deserialize(el, next) {
        const type = BLOCK_TAGS[el.tagName.toLowerCase()]

        if (!type) {
          return undefined
        }

        return {
          type,
          object: 'block',
          nodes: next(el.childNodes),
        }
      },
      serialize(object, children) {
        if (object.object !== 'block') {
          return undefined
        }

        switch (object.type) {
          case 'image':
            return (
              <figure>
                <img src="https://ksr-ugc.imgix.net/assets/025/620/141/d52b8df2dbd682bd3cabfc7b4c9ac933_original.gif?ixlib=rb-2.1.0&w=700&fit=max&v=1561565547&auto=format&gif-q=50&q=92&s=e0fdaaa079b53532d81549f17affff92" />
              </figure>
            )
          case 'heading':
            return <h1>{children}</h1>
          case 'heading2':
            return <h3>{children}</h3>
          case 'paragraph':
            return <p>{children}</p>
          default:
            return undefined
        }
      },
    },
    // Add a new rule that handles marks...
    {
      deserialize(el, next) {
        const type = MARK_TAGS[el.tagName.toLowerCase()]
        if (!type) {
          return undefined
        }

        return {
          type,
          object: 'mark',
          nodes: next(el.childNodes),
        }
      },
      serialize(object, children) {
        if (object.object !== 'mark') {
          return undefined
        }

        switch (object.type) {
          case 'bold':
            return <b>{children}</b>
          case 'italic':
            return <i>{children}</i>
          case 'strikethrough':
            return <s>{children}</s>
          default:
            return undefined
        }
      },
    },
    {
      deserialize(el, next) {
        if (el.tagName.toLowerCase() === 'a') {
          return {
            object: 'inline',
            type: 'link',
            nodes: next(el.childNodes),
            data: {
              href: el.getAttribute('href'),
            },
          }
        }

        return undefined
      },
      serialize(object, children) {
        if (
          (object.object === 'inline' || object.object === 'mark') &&
          object.get('type') === 'link'
        ) {
          return <a href={object.data.get('href')}>{children}</a>
        }

        return undefined
      },
    },
  ],
})

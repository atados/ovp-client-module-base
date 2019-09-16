import { Express } from 'express'
import next from 'next'
import { resolvePage } from '~/common/page'
import { SearchType } from '~/redux/ducks/search'

export default (app: next.Server | null, server: Express): void => {
  if (!app) {
    return
  }

  server.use((req, res, skip) => {
    const userAgent = req.headers['user-agent']
    console.info(userAgent)
    if (
      userAgent &&
      // Old IE or IE 11
      (userAgent.indexOf('MSIE') >= 0 ||
        (/rv:[0-9]{1,2}\.[0-9]/.test(userAgent) &&
          /Trident\/[0-9].[0-9]/.test(userAgent))) &&
      req.path !== '/browsers'
    ) {
      res.redirect('/browsers')
      return
    }

    skip()
  })

  server.get('/browsers', (req, res) => {
    app.render(req, res, '/base/browsers')
  })

  server.get('/sou-uma-ong/:stepId?', (req, res) => {
    const { stepId } = req.params

    if (req.user) {
      if (stepId && stepId !== 'basics') {
        res.redirect('/sou-uma-ong/basics')
        return
      }
    } else if (stepId && stepId !== 'auth') {
      res.redirect('/sou-uma-ong/auth')
      return
    }

    app.render(req, res, resolvePage('/organization-composer'), {
      stepId,
    })
  })

  server.get('/minhas-vagas', (req, res, skip) => {
    if (!req.user) {
      skip()
    }

    app.render(req, res, resolvePage('/manageable-projects-list'), {
      query: req.query.query,
      closed: req.query.closed,
    })
  })

  server.get('/minhas-vagas/vaga/:slug', (req, res, skip) => {
    if (!req.user) {
      skip()
    }

    app.render(req, res, resolvePage('/manage-project'), {
      slug: req.params.slug,
    })
  })

  server.get('/minhas-vagas/editar/:slug', (req, res, skip) => {
    if (!req.user) {
      skip()
    }

    app.render(req, res, resolvePage('/project-composer'), {
      mode: 'EDIT',
      projectSlug: req.params.slug,
    })
  })

  server.get('/minhas-vagas/duplicar/:slug/:stepId?', (req, res, skip) => {
    if (!req.user) {
      skip()
    }

    app.render(req, res, resolvePage('/project-composer'), {
      mode: 'DUPLICATE',
      projectSlug: req.params.slug,
      stepId: req.params.stepId,
    })
  })

  server.get('/minhas-vagas/editar/:slug/:stepId?', (req, res, skip) => {
    if (!req.user) {
      skip()
    }

    app.render(req, res, resolvePage('/project-composer'), {
      mode: 'EDIT',
      projectSlug: req.params.slug,
      stepId: req.params.stepId,
    })
  })

  server.get('/criar-vaga/:stepId?', (req, res) => {
    if (!req.user) {
      res.redirect('/entrar?next=/criar-vaga')
      return
    }

    if (req.params.stepId && req.params.stepId !== 'basics') {
      res.redirect('/criar-vaga')
      return
    }

    app.render(req, res, resolvePage('/project-composer'), {
      stepId: req.params.stepId,
      draftIndex: req.query.draftIndex,
    })
  })

  server.get('/entrar', (req, res) => {
    if (req.user) {
      res.redirect('/')
      return
    }

    app.render(req, res, resolvePage('/enter'), {
      path: '/login',
      errorCode: req.query.failed,
      successRedirect: req.query.next,
    })
  })

  server.get('/entrar/cadastro', (req, res) => {
    if (req.user) {
      res.redirect('/')
      return
    }

    app.render(req, res, resolvePage('/enter'), {
      path: '/register',
      errorCode: req.query.failed,
      successRedirect: req.query.next,
    })
  })

  server.get('/redefinir-senha', (req, res) =>
    app.render(req, res, resolvePage('/enter'), {
      path: '/recover',
    }),
  )

  server.get('/recuperar-senha', (req, res, skip) => {
    if (!req.query.token) {
      skip()
      return
    }

    app.render(req, res, resolvePage('/recover-password'), {
      token: req.query.token,
    })
  })

  server.get('/voluntario/:slug', (req, res) =>
    app.render(req, res, resolvePage('/public-user'), {
      slug: req.params.slug,
    }),
  )

  server.get('/perfil', (req, res, skip) => {
    if (!req.user) {
      skip()
      return
    }

    app.render(req, res, resolvePage('/public-user'), {
      slug: req.user.slug,
    })
  })

  server.get('/configuracoes/perfil', (req, res, skip) => {
    if (!req.user) {
      skip()
      return
    }

    app.render(req, res, resolvePage('/settings-user'), {
      slug: req.user.slug,
    })
  })

  server.get('/configuracoes/ongs', (req, res, skip) => {
    if (!req.user) {
      skip()
      return
    }

    app.render(req, res, resolvePage('/settings-organizations'), {
      slug: req.user.slug,
    })
  })

  server.get('/configuracoes/alterar-senha', (req, res, skip) => {
    if (!req.user) {
      skip()
      return
    }

    app.render(req, res, resolvePage('/settings-password'), {
      slug: req.user.slug,
    })
  })

  server.get('/ong/:slug', (req, res) =>
    app.render(req, res, resolvePage('/organization'), {
      slug: req.params.slug,
    }),
  )

  server.get('/ong/:slug/participar', (req, res, skip) => {
    if (!req.query.user_slug) {
      skip()
      return
    }

    app.render(req, res, resolvePage('/organization-join'), {
      slug: req.params.slug,
      userSlug: req.query.user_slug,
    })
  })

  server.get('/ong/:slug/membros', (req, res) =>
    app.render(req, res, resolvePage('/organization-members'), {
      organizationSlug: req.params.slug,
    }),
  )

  server.get('/ong/:slug/gerenciar/vagas', (req, res) =>
    app.render(req, res, resolvePage('/manageable-projects-list'), {
      organizationSlug: req.params.slug,
      query: req.query.query,
      closed: req.query.closed,
    }),
  )

  server.get('/ong/:organizationSlug/vaga/:slug', (req, res) =>
    app.render(req, res, resolvePage('/manage-project'), {
      slug: req.params.slug,
      organizationSlug: req.params.organizationSlug,
    }),
  )

  server.get('/ong/:organizationSlug/vagas/editar/:slug/:stepId?', (req, res) =>
    app.render(req, res, resolvePage('/project-composer'), {
      organizationSlug: req.params.organizationSlug,
      projectSlug: req.params.slug,
      stepId: req.params.stepId,
      mode: 'EDIT',
    }),
  )

  server.get(
    '/ong/:organizationSlug/vagas/duplicar/:slug/:stepId?',
    (req, res) =>
      app.render(req, res, resolvePage('/project-composer'), {
        organizationSlug: req.params.organizationSlug,
        projectSlug: req.params.slug,
        stepId: req.params.stepId,
        mode: 'DUPLICATE',
      }),
  )

  server.get('/ong/:slug/criar-vaga/:stepId?', (req, res) => {
    if (req.params.stepId && req.params.stepId !== 'basics') {
      return res.redirect(`/ong/${req.params.slug}/criar-vaga`)
    }

    app.render(req, res, resolvePage('/project-composer'), {
      organizationSlug: req.params.slug,
      stepId: req.params.stepId,
      draftIndex: req.query.draftIndex,
    })
  })

  server.get('/ong/:slug/vagas', (req, res) =>
    app.render(req, res, resolvePage('/organization-projects'), {
      slug: req.params.slug,
    }),
  )

  server.get('/ong/:slug/editar/:stepId?', (req, res) =>
    app.render(req, res, resolvePage('/organization-edit'), {
      slug: req.params.slug,
      stepId: req.params.stepId,
    }),
  )

  server.get('/causa/:slug', (req, res) =>
    app.render(req, res, resolvePage('/cause'), {
      slug: req.params.slug,
    }),
  )

  server.get('/explorar', (req, res) =>
    app.render(req, res, resolvePage('/explore'), req.query),
  )
  server.get('/vagas', (req, res) =>
    app.render(req, res, resolvePage('/explore'), {
      ...req.query,
      searchType: SearchType.Projects,
    }),
  )
  server.get('/ongs', (req, res) =>
    app.render(req, res, resolvePage('/explore'), {
      ...req.query,
      searchType: SearchType.Organizations,
    }),
  )

  server.get('/vaga/:slug/:subpage?', (req, res) =>
    app.render(req, res, resolvePage('/project'), {
      slug: req.params.slug,
      subpage: req.params.subpage,
    }),
  )

  server.get('/vaga/:slug/inscricao', (req, res) =>
    app.render(req, res, resolvePage('/project'), {
      slug: req.params.slug,
      defaultRoleId: req.query.role,
      applyFormOpen: '1',
    }),
  )

  server.get('/mensagens', (req, res) =>
    app.render(req, res, resolvePage('/inbox'), {
      viewerSlug: 'me',
    }),
  )

  server.get('/mensagens/:viewerSlug/:threadId?', (req, res) =>
    app.render(req, res, resolvePage('/inbox'), {
      viewerSlug: req.params.viewerSlug || 'me',
      threadId: req.params.threadId,
    }),
  )

  server.get('/minhas-vagas/vaga/:project/publicacoes/nova', (req, res) => {
    app.render(req, res, resolvePage('/post-form'), {
      nodeKind: 'project',
      nodeSlug: req.params.project,
    })
  })

  server.get(
    '/ong/:organization/vaga/:project/publicacoes/nova',
    (req, res) => {
      app.render(req, res, resolvePage('/post-form'), {
        organizationSlug: req.params.organization,
        nodeKind: 'project',
        nodeSlug: req.params.project,
      })
    },
  )

  server.get(
    '/minhas-vagas/vaga/:project/publicacoes/editar/:id',
    (req, res) => {
      app.render(req, res, resolvePage('/post-form'), {
        nodeKind: 'project',
        nodeSlug: req.params.project,
        postId: req.params.id,
      })
    },
  )

  server.get(
    '/ong/:organization/vaga/:project/publicacoes/editar/:id',
    (req, res) => {
      app.render(req, res, resolvePage('/post-form'), {
        organizationSlug: req.params.organization,
        nodeKind: 'project',
        nodeSlug: req.params.project,
        postId: req.params.id,
      })
    },
  )

  server.get('/', (req, res) => app.render(req, res, resolvePage('/home')))
}

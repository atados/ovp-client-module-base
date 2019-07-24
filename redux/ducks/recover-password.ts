import { createAction } from 'redux-handy'
import { fetchAPI } from '~/lib/fetch'
import { catchErrorAndReport } from '~/lib/utils/error'

export const recoverPassword = createAction<
  { token: string; password: string },
  boolean,
  string
>('PASSWORD_RECOVER', ({ password, token }) =>
  fetchAPI<{ success: true }>('/users/recover-password/', {
    method: 'POST',
    body: { new_password: password, token },
  })
    .then(({ success }) => success)
    .catch(catchErrorAndReport),
)

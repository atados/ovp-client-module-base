import { createAction } from 'redux-handy'
import { fetchAPI } from '~/lib/fetch'
import { catchErrorAndReport } from '~/lib/utils/error'

export const requestPasswordRecovery = createAction<string, boolean, string>(
  'PASSWORD_RECOVERY_REQUEST',
  email =>
    fetchAPI<{ success: true }>('/users/recovery-token/', {
      method: 'POST',
      body: { email },
    })
      .then(({ success }) => success)
      .catch(catchErrorAndReport),
  email => email,
)

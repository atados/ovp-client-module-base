import * as Yup from 'yup'

Yup.addMethod(
  Yup.string,
  'equals',
  (key: string, message: string, func?: any) => {
    message = message || 'Values do not match'
    func =
      func ||
      function(value) {
        return value === this.options.parent[key]
      }

    return Yup.string().test('match', message, func)
  },
)

export default Yup

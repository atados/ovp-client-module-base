import chalk from 'chalk'
import { inspect } from 'util'

function inspectObject(object) {
  return inspect(object, {
    colors: true,
  })
}

function singleLine(str) {
  return str.replace(/\s+/g, ' ')
}

const actionFormatters = {
  // This is used at feature/apollo branch, but it can help you when implementing Apollo
  APOLLO_QUERY_INIT: a =>
    `queryId:${a.queryId} variables:${inspectObject(
      a.variables,
    )}\n   ${singleLine(a.queryString)}`,

  APOLLO_QUERY_RESULT: a =>
    `queryId:${a.queryId}\n   ${singleLine(inspectObject(a.result))}`,

  APOLLO_QUERY_STOP: a => `queryId:${a.queryId}`,
}

// Server side redux action logger
export default function createLogger() {
  return () => next => action => {
    let formattedPayload = ''
    const actionFormatter = actionFormatters[action.type]
    if (typeof actionFormatter === 'function') {
      formattedPayload = actionFormatter(action)
    } else if (action.toString !== Object.prototype.toString) {
      formattedPayload = action.toString()
    } else if (typeof action.payload !== 'undefined') {
      formattedPayload = inspectObject(action.payload)
    } else {
      formattedPayload = inspectObject(action)
    }

    // tslint:disable-next-line
    console.log(
      `[${chalk.magenta('REDUX')}] ${chalk.bold(
        action.type,
      )}: ${formattedPayload}`,
    )
    return next(action)
  }
}

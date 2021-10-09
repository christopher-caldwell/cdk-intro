import { CloudFrontFunctionsEvent } from 'aws-lambda'

export const handler = function (event: CloudFrontFunctionsEvent) {
  var response = event.response
  var headers = response.headers
  headers['cache-control'] = {
    value: ['public', 'max-age=31536000', 'immutable'].join(','),
  }
  return response
}

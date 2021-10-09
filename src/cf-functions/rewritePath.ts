import { CloudFrontFunctionsEvent } from 'aws-lambda'

export const handler = function (event: CloudFrontFunctionsEvent) {
  var request = event.request
  var oldUri = request.uri
  var newUri = oldUri.replace(/\/$/, '/index.html')
  request.uri = newUri
  return request
}

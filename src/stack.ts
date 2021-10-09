import * as cdk from '@aws-cdk/core'
import * as S3 from '@aws-cdk/aws-s3'
import * as cloudfront from '@aws-cdk/aws-cloudfront'
import * as origins from '@aws-cdk/aws-cloudfront-origins'

// import { handler as nextJsCacheHandler } from './cf-functions/nextCache'
import { handler as rewritePathHandler } from './cf-functions/rewritePath'

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const uiBucket = new S3.Bucket(this, 'UiSourceBucket', {
      bucketName: 'ui-host-bucket',
      versioned: true,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html',
      accessControl: S3.BucketAccessControl.PRIVATE,
    })
    const originIdentity = new origins.S3Origin(uiBucket)

    // const nextJsCache = new cloudfront.Function(this, 'NextJsCache', {
    //   code: cloudfront.FunctionCode.fromInline(nextJsCacheHandler.toString()),
    // })
    const rewritePath = new cloudfront.Function(this, 'RewritePath', {
      code: cloudfront.FunctionCode.fromInline(rewritePathHandler.toString()),
    })

    new cloudfront.Distribution(this, 'UiDist', {
      defaultBehavior: {
        origin: originIdentity,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        functionAssociations: [
          // {
          //   function: nextJsCache,
          //   eventType: cloudfront.FunctionEventType.VIEWER_RESPONSE,
          // },
          {
            function: rewritePath,
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          },
        ],
      },
      defaultRootObject: 'index.html',
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
    })
  }
}

// new S3.BucketPolicy(this, '', {
//   bucket: uiBucket,
// })

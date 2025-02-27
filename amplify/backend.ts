import { auth } from './auth/resource'
import { defineBackend } from '@aws-amplify/backend'
import { Stack } from 'aws-cdk-lib'
import {
	AppSyncAuthorizationType,
	ChannelNamespace,
	Code,
	EventApi,
} from 'aws-cdk-lib/aws-appsync'

const backend = defineBackend({
	auth,
})

const connect4EventAPI = new EventApi(
	Stack.of(backend.auth.stack),
	'EventApi',
	{
		apiName: 'connect-api',
		authorizationConfig: {
			authProviders: [
				{
					authorizationType: AppSyncAuthorizationType.USER_POOL,
					cognitoConfig: {
						userPool: backend.auth.resources.userPool,
					},
				},
				{
					authorizationType: AppSyncAuthorizationType.IAM,
				},
			],
		},
	}
)

connect4EventAPI.grantPublishAndSubscribe(
	backend.auth.resources.authenticatedUserIamRole
)
connect4EventAPI.grantConnect(backend.auth.resources.authenticatedUserIamRole)

//* This is the namespace for the connect4 game
new ChannelNamespace(backend.stack, 'Connect4Namespace', {
	api: connect4EventAPI,
	channelNamespaceName: 'connect4',
})

//* This is the namespace for the message channel with enriched data
new ChannelNamespace(backend.stack, 'MessageNamespace', {
	api: connect4EventAPI,
	channelNamespaceName: 'message',
	code: Code.fromInline(`
    import { util } from '@aws-appsync/utils'

    export function onPublish(ctx) {
      return ctx.events.map(event => ({
        id: event.id,
        payload: {
          ...event.payload,
          timestamp: util.time.nowISO8601() //adding a timestamp to the payload
        }
      }))
    }

    `),
})

backend.addOutput({
	custom: {
		events: {
			url: `https://${connect4EventAPI.httpDns}/event`,
			aws_region: backend.stack.region,
			default_authorization_type: AppSyncAuthorizationType.IAM,
		},
	},
})

import { defineBackend } from '@aws-amplify/backend'
import { Expiration, Duration } from 'aws-cdk-lib'
import {
	AppSyncAuthorizationType,
	ChannelNamespace,
	Code,
	EventApi,
} from 'aws-cdk-lib/aws-appsync'

const backend = defineBackend({})

const connect4EventAPI = new EventApi(backend.stack, 'EventApi', {
	apiName: 'connect-api',
	//! I'm being explicit here to demo but the default is API_KEY, so all of this is optional
	authorizationConfig: {
		authProviders: [
			{
				authorizationType: AppSyncAuthorizationType.API_KEY,
				apiKeyConfig: {
					name: 'Default', //* Name of the API Key that is passed in the output below
					description: 'Default API Key',
					expires: Expiration.after(Duration.days(365)),
				},
			},
		],
	},
})

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
			default_authorization_type: AppSyncAuthorizationType.API_KEY,
			api_key: connect4EventAPI.apiKeys['Default'].attrApiKey,
		},
	},
})

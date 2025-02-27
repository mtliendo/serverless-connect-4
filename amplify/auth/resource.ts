import { defineAuth } from '@aws-amplify/backend'

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
	loginWith: {
		email: {
			verificationEmailSubject: 'Confirm your Connect 4 account',
			verificationEmailBody: (createCode: () => string) =>
				`Welcome to Connect 4! Your verification code is ${createCode()}`,
		},
	},
	userAttributes: {
		nickname: {
			required: true,
		},
	},
})

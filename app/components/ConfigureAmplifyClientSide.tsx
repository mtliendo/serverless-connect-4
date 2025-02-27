'use client'

import { Amplify } from 'aws-amplify'
import awsConfig from '@/amplify_outputs.json'

Amplify.configure(awsConfig)

export default function ConfigureAmplifyClientSide() {
	return null
}

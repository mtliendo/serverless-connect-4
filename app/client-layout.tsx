'use client'
import { Authenticator } from '@aws-amplify/ui-react'
import { Suspense } from 'react'
import ConfigureAmplifyClientSide from './components/ConfigureAmplifyClientSide'

import Navbar from './components/Navbar'
export default function ClientLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<>
			<ConfigureAmplifyClientSide />
			<Authenticator.Provider>
				<Suspense fallback={<div>Loading...</div>}>
					<Navbar />
					{children}
				</Suspense>
			</Authenticator.Provider>
		</>
	)
}

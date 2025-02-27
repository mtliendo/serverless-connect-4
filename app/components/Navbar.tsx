//create a navbar component that is used in the client layout

import { Button } from '@/components/ui/button'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { signOut } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'

export default function Navbar() {
	const { user } = useAuthenticator((context) => [
		context.user,
		context.signOut,
	])
	const router = useRouter()
	return (
		<div className="flex justify-between items-center p-4">
			<h1 className="text-2xl font-bold">Connect 4</h1>
			{user && (
				<Button
					onClick={async () => {
						await signOut()
						router.push('/')
					}}
				>
					Sign Out {user.signInDetails?.loginId}
				</Button>
			)}
		</div>
	)
}

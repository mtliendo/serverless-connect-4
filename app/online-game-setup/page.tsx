'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { fetchAuthSession } from 'aws-amplify/auth'

function generateShortCode() {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
	const length = Math.floor(Math.random() * 3) + 6 // 6-8 characters
	let result = ''
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length))
	}
	return result
}

function OnlineGameSetupPage() {
	const [shortCode, setShortCode] = useState('')
	const [generatedCode, setGeneratedCode] = useState('')
	const [screenName, setScreenName] = useState('')
	const router = useRouter()

	useEffect(() => {
		const fetchUserInfo = async () => {
			try {
				const session = await fetchAuthSession()
				console.log('Auth session:', session)

				// Extract user information safely
				let nickname = ''

				if (session?.tokens?.idToken?.payload) {
					const payload = session.tokens.idToken.payload

					// Try to find a suitable identifier from the payload
					if (typeof payload.nickname === 'string') {
						nickname = payload.nickname
					} else if (typeof payload['cognito:username'] === 'string') {
						nickname = payload['cognito:username']
					} else if (typeof payload.email === 'string') {
						nickname = payload.email.split('@')[0] // Use part before @ in email
					} else if (typeof payload.name === 'string') {
						nickname = payload.name
					} else if (typeof payload.preferred_username === 'string') {
						nickname = payload.preferred_username
					}
				}

				console.log('User nickname:', nickname)

				if (nickname) {
					setScreenName(nickname)
				}
			} catch (error) {
				console.error('Error fetching auth session:', error)
			}
		}

		fetchUserInfo()
	}, [])

	const handleGenerateCode = () => {
		const newCode = generateShortCode()
		setGeneratedCode(newCode)
	}

	const handleStartGame = (code: string) => {
		if (code && screenName) {
			const gameUrl = `/game/${code}?player=${encodeURIComponent(
				screenName
			)}&creator=true`
			console.log('Starting game with URL:', gameUrl)
			router.push(gameUrl)
		}
	}

	const handleJoinGame = (code: string) => {
		if (code && screenName) {
			const gameUrl = `/game/${code}?player=${encodeURIComponent(
				screenName
			)}&creator=false`
			console.log('Joining game with URL:', gameUrl)
			router.push(gameUrl)
		}
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Online Connect 4 Game</CardTitle>
					<CardDescription>
						Create a new game or join an existing one
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="screen-name">Screen Name</Label>
						<Input
							id="screen-name"
							placeholder="Your screen name"
							value={screenName}
							onChange={(e) => setScreenName(e.target.value)}
							readOnly={!!screenName}
							className={screenName ? 'bg-gray-100' : ''}
						/>
						{screenName && (
							<p className="text-xs text-gray-500">
								Using your account nickname
							</p>
						)}
					</div>
					<div>
						<Button onClick={handleGenerateCode} className="w-full mb-2">
							Generate New Game Code
						</Button>
						{generatedCode && (
							<div className="text-center">
								<p className="mb-2">Your game code:</p>
								<p className="font-bold text-2xl">{generatedCode}</p>
								<Button
									onClick={() => handleStartGame(generatedCode)}
									className="mt-2"
									disabled={!screenName}
								>
									Start New Game
								</Button>
							</div>
						)}
					</div>
					<div className="space-y-2">
						<Label htmlFor="game-code">Join Existing Game</Label>
						<div className="flex items-center space-x-2">
							<Input
								id="game-code"
								placeholder="Enter game code"
								value={shortCode}
								onChange={(e) => setShortCode(e.target.value.toUpperCase())}
								maxLength={8}
							/>
							<Button
								onClick={() => handleJoinGame(shortCode)}
								disabled={!screenName || !shortCode}
							>
								Join
							</Button>
						</div>
					</div>
					<Button
						onClick={() => router.push('/')}
						className="w-full"
						variant="outline"
					>
						Back to Home
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}

const formFields = {
	signUp: {
		nickname: {
			order: -1,
			label: 'Nickname',
			placeholder: 'Enter your nickname',
		},
	},
}
export default withAuthenticator(OnlineGameSetupPage, { formFields })

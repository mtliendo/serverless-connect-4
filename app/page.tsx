'use client'

import { useState } from 'react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function generateShortCode() {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
	const length = Math.floor(Math.random() * 3) + 6 // 6-8 characters
	let result = ''
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length))
	}
	return result
}

export default function StartGameComponent() {
	const [shortCode, setShortCode] = useState('')
	const [generatedCode, setGeneratedCode] = useState('')
	const [screenName, setScreenName] = useState('')
	const [player1Name, setPlayer1Name] = useState('')
	const [player2Name, setPlayer2Name] = useState('')
	const router = useRouter()

	const handleGenerateCode = () => {
		const newCode = generateShortCode()
		setGeneratedCode(newCode)
	}

	const handleStartGame = (code: string) => {
		if (code && screenName) {
			router.push(
				`/game/${code}?player=${encodeURIComponent(screenName)}&creator=true`
			)
		}
	}

	const handleJoinGame = (code: string) => {
		if (code && screenName) {
			router.push(
				`/game/${code}?player=${encodeURIComponent(screenName)}&creator=false`
			)
		}
	}

	const handleStartLocalGame = () => {
		if (player1Name && player2Name) {
			router.push(
				`/local-game?player1=${encodeURIComponent(
					player1Name
				)}&player2=${encodeURIComponent(player2Name)}`
			)
		}
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Start a Connect 4 Game</CardTitle>
					<CardDescription>
						Play online or locally with a friend
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="online" className="w-full">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="online">Online Game</TabsTrigger>
							<TabsTrigger value="local">Local Game</TabsTrigger>
						</TabsList>
						<TabsContent value="online" className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="screen-name">Screen Name</Label>
								<Input
									id="screen-name"
									placeholder="Enter your screen name"
									value={screenName}
									onChange={(e) => setScreenName(e.target.value)}
								/>
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
										Join Game
									</Button>
								</div>
							</div>
						</TabsContent>
						<TabsContent value="local" className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="player1-name">
									Player 1 Name <span className="text-red-500">(Red)</span>
								</Label>
								<Input
									id="player1-name"
									placeholder="Enter Player 1 name"
									value={player1Name}
									onChange={(e) => setPlayer1Name(e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="player2-name">
									Player 2 Name{' '}
									<span className="text-yellow-500">(Yellow)</span>
								</Label>
								<Input
									id="player2-name"
									placeholder="Enter Player 2 name"
									value={player2Name}
									onChange={(e) => setPlayer2Name(e.target.value)}
								/>
							</div>
							<Button
								onClick={handleStartLocalGame}
								className="w-full"
								disabled={!player1Name || !player2Name}
							>
								Start Local Game
							</Button>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	)
}

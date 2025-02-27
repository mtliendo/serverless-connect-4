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

export default function LocalGameSetupPage() {
	const [player1Name, setPlayer1Name] = useState('')
	const [player2Name, setPlayer2Name] = useState('')
	const router = useRouter()

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
					<CardTitle>Set Up Local Game</CardTitle>
					<CardDescription>
						Enter player names to start a local game
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
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
							Player 2 Name <span className="text-yellow-500">(Yellow)</span>
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

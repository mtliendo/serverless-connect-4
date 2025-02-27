'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

export default function LandingPage() {
	const router = useRouter()

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<Card className="w-[600px] max-w-[90vw]">
				<CardHeader>
					<CardTitle className="text-3xl text-center">Connect 4</CardTitle>
					<CardDescription className="text-center text-lg">
						The classic two-player connection game
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-4">
						<h2 className="text-xl font-semibold">How to Play</h2>
						<p>
							Connect 4 is a two-player connection game where players take turns
							dropping colored discs into a vertical grid. The objective is to
							be the first to form a horizontal, vertical, or diagonal line of
							four of one&apos;s own discs.
						</p>
						<p>
							Players choose a color and take turns dropping one colored disc
							from the top into any of the seven columns. The disc falls to the
							lowest available space in the column.
						</p>
						<p>
							The game ends when one player creates a line of four consecutive
							discs of their color, or when the board is full with no winner.
						</p>
					</div>

					<div className="space-y-4">
						<h2 className="text-xl font-semibold">Game Modes</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="border rounded-lg p-4 space-y-2">
								<h3 className="font-medium">Local Game</h3>
								<p>
									Play against a friend on the same device. Take turns making
									moves on a shared screen.
								</p>
								<Button
									onClick={() => router.push('/local-game-setup')}
									className="w-full"
								>
									Play Local Game
								</Button>
							</div>
							<div className="border rounded-lg p-4 space-y-2">
								<h3 className="font-medium">Online Game</h3>
								<p>
									Play against others online. Create a game and share the code,
									or join an existing game with a code.
								</p>
								<Button
									onClick={() => router.push('/online-game-setup')}
									className="w-full"
								>
									Play Online Game
								</Button>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

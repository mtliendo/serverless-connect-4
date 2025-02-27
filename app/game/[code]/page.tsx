'use client'

import { useReducer, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'

import { gameReducer, ROWS, COLS, EMPTY, PLAYER1, PLAYER2 } from './GameState'
import { Connect4Board } from '../../../components/connect4board'
import { GameChat } from '@/components/game-chat'

type GameMessage = {
	message: string
	player: string
}

export default function Connect4Component() {
	const params = useParams()
	const searchParams = useSearchParams()
	const gameCode = params.code as string
	const playerName = searchParams.get('player') || 'Player 1'
	const isCreator = searchParams.get('creator') === 'true'
	const initialGameState = {
		board: Array(ROWS)
			.fill(null)
			.map(() => Array(COLS).fill(EMPTY)),
		currentPlayer: PLAYER1,
		winner: null,
		gameOver: false,
		player1Name: isCreator ? playerName : 'Waiting for player...',
		player2Name: isCreator ? 'Waiting for player...' : playerName,
	}

	const [state, dispatch] = useReducer(gameReducer, initialGameState)
	const [messages, setMessages] = useState<GameMessage[]>([])

	const handleSendMessage = async (text: string) => {
		if (text !== '') {
			const newMessage: GameMessage = { message: text, player: playerName }
			setMessages((prevMessages) => [...prevMessages, newMessage])
		}
	}

	async function handleBoardClick(col: number) {
		if (
			state.gameOver ||
			(isCreator && state.currentPlayer !== PLAYER1) ||
			(!isCreator && state.currentPlayer !== PLAYER2)
		)
			return

		dispatch({ type: 'PLACE_PIECE', col })
	}

	async function resetGame() {
		dispatch({ type: 'RESET_GAME' })
	}

	const playerColor = isCreator ? 'red' : 'yellow'
	const isPlayerTurn =
		(isCreator && state.currentPlayer === PLAYER1) ||
		(!isCreator && state.currentPlayer === PLAYER2)

	return (
		<div className="md:flex h-screen">
			<div className="flex-1 bg-muted">
				<div className="max-w-3xl mx-auto">
					<Connect4Board
						gameCode={gameCode}
						handleClick={handleBoardClick}
						isPlayerTurn={isPlayerTurn}
						playerColor={playerColor}
						resetGame={resetGame}
						state={state}
						showPlayerInfo={true}
						isLocalGame={false}
					/>
				</div>
			</div>
			<div className="w-full max-w-sm border rounded-lg overflow-hidden bg-background shadow-sm min-h-screen flex flex-col">
				<GameChat
					currentPlayer={playerName}
					messages={messages}
					onSendMessage={handleSendMessage}
				/>
			</div>
		</div>
	)
}

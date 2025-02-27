'use client'

import { useEffect, useReducer, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { events, type EventsChannel } from 'aws-amplify/data'
import { gameReducer, ROWS, COLS, EMPTY, PLAYER1, PLAYER2 } from './GameState'
import { Connect4Board } from '../../../components/connect4board'
import { GameChat } from '@/components/game-chat'

type GameMessage = {
	timestamp?: string
	player: string
	message: string
}

export default function Connect4Component() {
	const params = useParams()
	const searchParams = useSearchParams()
	const gameCode = params.code as string
	const playerName = searchParams.get('player') || 'Player 1'
	const isCreator = searchParams.get('creator') === 'true'

	console.log('Game params:', { gameCode, playerName, isCreator })

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

	useEffect(() => {
		let channel: EventsChannel

		const connectAndSubscribe = async () => {
			channel = await events.connect(`message/${gameCode}/chat`)

			channel.subscribe({
				next: (data) => {
					console.log('received message', data)
					const message: GameMessage = data.event
					console.log('message', message)
					if (message.player !== playerName) {
						setMessages((prev) => [...prev, message])
					}
				},
				error: (err) => console.error('error', err),
			})
		}

		connectAndSubscribe()

		return () => channel && channel.close()
	}, [gameCode, playerName])

	useEffect(() => {
		let channel: EventsChannel

		const connectAndSubscribe = async () => {
			channel = await events.connect(`connect4/${gameCode}`)

			channel.subscribe({
				next: (data) => {
					console.log('received game state update:', data)
					dispatch({ type: 'UPDATE_GAME_STATE', newState: data.event })
				},
				error: (err) => console.error('error', err),
			})
		}

		connectAndSubscribe()

		return () => channel && channel.close()
	}, [gameCode])

	// Share player information when joining a game
	useEffect(() => {
		const sharePlayerInfo = async () => {
			try {
				// When a player joins, share their name with the other player
				const playerInfo = {
					player1Name: isCreator ? playerName : state.player1Name,
					player2Name: isCreator ? state.player2Name : playerName,
				}

				console.log('Sharing player info:', playerInfo)
				await events.post(`connect4/${gameCode}`, playerInfo)
			} catch (error) {
				console.error('Error sharing player info:', error)
			}
		}

		sharePlayerInfo()
	}, [gameCode, isCreator, playerName, state.player1Name, state.player2Name])

	const handleSendMessage = async (text: string) => {
		if (text !== '') {
			const newMessage = { player: playerName, message: text }
			setMessages((prevMessages) => [...prevMessages, newMessage])
			await events.post(`message/${gameCode}/chat`, newMessage)
		}
	}

	async function handleBoardClick(col: number) {
		if (
			state.gameOver ||
			(isCreator && state.currentPlayer !== PLAYER1) ||
			(!isCreator && state.currentPlayer !== PLAYER2)
		)
			return

		console.log(
			'Player clicked column:',
			col,
			'isCreator:',
			isCreator,
			'currentPlayer:',
			state.currentPlayer
		)

		const newState = gameReducer(state, { type: 'PLACE_PIECE', col })
		dispatch({ type: 'PLACE_PIECE', col })

		// Include player names in the update to ensure they're preserved
		await events.post(`connect4/${gameCode}`, {
			board: newState.board,
			currentPlayer: newState.currentPlayer,
			gameOver: newState.gameOver,
			winner: newState.winner,
			player1Name: newState.player1Name,
			player2Name: newState.player2Name,
		})
	}

	async function resetGame() {
		const newState = gameReducer(state, { type: 'RESET_GAME' })
		dispatch({ type: 'RESET_GAME' })
		await events.post(`connect4/${gameCode}`, {
			board: newState.board,
			currentPlayer: newState.currentPlayer,
			gameOver: newState.gameOver,
			winner: newState.winner,
			player1Name: newState.player1Name,
			player2Name: newState.player2Name,
		})
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
					messages={messages as GameMessage[]}
					onSendMessage={handleSendMessage}
				/>
			</div>
		</div>
	)
}

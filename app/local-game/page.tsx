'use client'

import { useReducer } from 'react'
import { useSearchParams } from 'next/navigation'
import {
	gameReducer,
	ROWS,
	COLS,
	EMPTY,
	PLAYER1,
} from '../game/[code]/GameState'
import { Connect4Board } from '@/components/connect4board'

export default function LocalGamePage() {
	const searchParams = useSearchParams()
	const player1Name = searchParams.get('player1') || 'Player 1'
	const player2Name = searchParams.get('player2') || 'Player 2'

	const initialGameState = {
		board: Array(ROWS)
			.fill(null)
			.map(() => Array(COLS).fill(EMPTY)),
		currentPlayer: PLAYER1,
		winner: null,
		gameOver: false,
		player1Name,
		player2Name,
	}

	const [state, dispatch] = useReducer(gameReducer, initialGameState)

	const handleBoardClick = (col: number) => {
		if (state.gameOver) return
		dispatch({ type: 'PLACE_PIECE', col })
	}

	const resetGame = () => {
		dispatch({ type: 'RESET_GAME' })
	}

	return (
		<Connect4Board
			state={state}
			handleClick={handleBoardClick}
			resetGame={resetGame}
			isLocalGame={true}
		/>
	)
}

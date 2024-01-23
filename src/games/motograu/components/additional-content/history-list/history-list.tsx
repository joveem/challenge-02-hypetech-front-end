import './history-list.css'

import React, { useContext, useEffect, useRef, useState } from 'react'
import ProgressBar from '@/core/components/progress-bar'
import If from '@/core/components/conditions/if'
import { GameStatus } from '@/core/providers/enums/game-status'
import { CrashGameContext } from '@/core/providers/games/crash-game.provider'

// import GameButton from './../../../ components/game-button/game-button'
// import GameButton from './../game-button/game-button'

type Props = {
  // color: string
}

export default function BetsHistory (props: Props) {


  return (
    <div className='history-list-container'>
      <h1>Histórico</h1>
    </div>
  )
}

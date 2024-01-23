import './index.css'

import React, { useContext, useEffect } from 'react'
import Display from './components/display'
import Snackbar from '@/core/components/snackbar'
import Results from '@/core/components/results'
import TransactionBar from '@/core/components/transaction-bar'
import Controls from '@/core/components/controls/crash-control'
import { CrashGameContext } from '@/core/providers/games/crash-game.provider'
import { SessionContext } from '@/core/providers/session.provider'
import { GameStatus } from '@/core/providers/enums/game-status'
import Navbar from '@/core/components/navbar'

import GameButton from './components/game-button/game-button'
import AdditionalContentController from './components/additional-content/additional-content-controller'
import BetPanel from './components/bet-panel/bet-panel'

function HomePage () {
  const { setLoading } = useContext<any>(SessionContext)
  const { iframeRef, gameStatus, executeAction, balance } =
    useContext<any>(CrashGameContext)

  useEffect(() => {
    iframeRef.current?.contentWindow.addEventListener(
      'instance-created',
      () => {
        setLoading(false)
        if (gameStatus == GameStatus.RUNNING)
          setTimeout(() => executeAction('start'), 1000)
      }
    )
  }, [iframeRef])

  return (
    <div className='flex min-h-screen overflow-hidden bg-gradient-to-r motograu-game'>
      <div className='game-container grow relative z-0'>
        <iframe
          ref={iframeRef}
          className='rounded-md overflow-hidden w-full h-full pointer-events-none min-h-[250px] sm:min-h-[300px]'
          // src="/motograu/index.html"
          src='/motograu-02/motograu-02.html'
        ></iframe>
      </div>

      <div className='game-ui grow absolute z-10'>
        {/* <TransactionBar /> */}
        {/* <Navbar
          game="motograu"
          executeAction={executeAction}
          balance={balance}
        /> */}
        <AdditionalContentController />
        <BetPanel />
        <Results />
      </div>
    </div>
  )
}

export default HomePage

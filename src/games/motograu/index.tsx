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
// import Navbar from '@/core/components/navbar'
import Header from '@/core/components/navbar/header'

import GameButton from './components/game-button/game-button'
import AdditionalContentController from './components/additional-content/additional-content-controller'
import OriginalBetPanel from './components/bet-panel/ORIGINAL-bet-panel'

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
      <link
        rel='preload'
        as='image'
        href='/motograu/src/assets/sprites/UI/icons/auto-bet-icon'
      />
      <link
        rel='preload'
        as='image'
        href='/motograu/src/assets/sprites/UI/icons/auto-withdraw-icon.png'
      />
      <link
        rel='preload'
        as='image'
        href='/motograu/src/assets/sprites/UI/icons/chat-icon.png'
      />
      <link
        rel='preload'
        as='image'
        href='/motograu/src/assets/sprites/UI/icons/emoji-icon.png'
      />
      <link
        rel='preload'
        as='image'
        href='/motograu/src/assets/sprites/UI/icons/history-icon.png'
      />
      <link
        rel='preload'
        as='image'
        href='/motograu/src/assets/sprites/UI/icons/list-icon.png'
      />
      <link
        rel='preload'
        as='image'
        href='/motograu/src/assets/sprites/UI/icons/menu-icon.png'
      />
      <link
        rel='preload'
        as='image'
        href='/motograu/src/assets/sprites/UI/icons/pin-icon.png'
      />
      <link
        rel='preload'
        as='image'
        href='/motograu/src/assets/sprites/UI/icons/send-icon.png'
      />
      <link
        rel='preload'
        as='image'
        href='/motograu/src/assets/sprites/UI/icons/pin-icon.png'
      />
      <link
        rel='preload'
        as='image'
        href='/motograu/src/assets/sprites/UI/icons/user-icon.png'
      />
      <link
        rel='preload'
        as='image'
        href='/motograu/src/assets/sprites/UI/cb-fec-01-buttons-01-01-pressed-border.png'
      />

      <div className='grow relative z-0'>
        <iframe
          ref={iframeRef}
          className='rounded-md overflow-hidden w-full h-full pointer-events-none min-h-[250px] sm:min-h-[300px]'
          // src="/motograu/index.html"
          src='/motograu-02/motograu-02.html'
        ></iframe>
        <div className='transform sm:translate-y-[-390px] translate-y-[-200px]'></div>
      </div>

      {/* <div className='flex w-full sm:gap-3 min-h-screen relative'>
        <section className='flex flex-col h-full grow p-0'>
          <div className='' style={{ zIndex: 100 }}>
            <Header
              game='motograu'
              executeAction={executeAction}
              balance={balance}
            />
          </div>
          <div className='grid p-3 gap-3 grow rounded w-full grid-cols-12'>
            <div className='col-span-12 sm:col-span-4 grow xl:col-span-3 order-2 sm:order-1'>
              <TransactionBar />
            </div>

            <div className='col-span-12 sm:col-span-8 xl:col-span-9 relative order-1 sm:order-1 lg:order-2'>
              <div className='flex gap-3 h-full flex-col'>
                <Results />
                <div className='grow relative z-0'>
                  <iframe
                    ref={iframeRef}
                    className='rounded-md overflow-hidden w-full h-full pointer-events-none min-h-[250px] sm:min-h-[300px]'
                    // src="/motograu/index.html"
                    src='/motograu-02/motograu-02.html'
                  ></iframe>
                  <div className='transform sm:translate-y-[-390px] translate-y-[-200px]'></div>
                </div>
              </div>

              <Snackbar />
            </div>
          </div>
        </section>
      </div> */}

      <div className='game-ui grow absolute z-10'>
        <Header
          game='motograu'
          executeAction={executeAction}
          balance={balance}
        />
        {/* <section className='flex flex-col h-full grow p-0'>
          <div className='' style={{ zIndex: 100 }}>
            <Header
              game='motograu'
              executeAction={executeAction}
              balance={balance}
            />
          </div>
        </section> */}
        {/* <TransactionBar /> */}
        {/* <Header
          game="motograu"
          executeAction={executeAction}
          balance={balance}
        /> */}
        <AdditionalContentController />
        <Controls color='lime' position={'center'} />
        {/* <OriginalBetPanel /> */}
        <Results />

        <Snackbar />
      </div>
    </div>
  )
}

export default HomePage

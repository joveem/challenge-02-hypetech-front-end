import './additional-content-controller.css'

import React, { useContext, useEffect, useRef, useState } from 'react'
import ProgressBar from '@/core/components/progress-bar'
import If from '@/core/components/conditions/if'
import { GameStatus } from '@/core/providers/enums/game-status'
import { CrashGameContext } from '@/core/providers/games/crash-game.provider'

// import GameButton from './../../../ components/game-button/game-button'
import GameButton from './../game-button/game-button'

import BetsList from './bets-list/bets-list'
import HistoryList from './history-list/history-list'
import Chat from './chat/chat'

type Props = {
  color?: string
}

const _betListKey = 'bet-list'
const _historyListKey = 'history-list'
const _chatKey = 'chat'

let _currentPanelName = 'bet-list'

export default function AdditionalContentController (props: Props) {
  let _betsListButtonRef = useRef<any>()
  let _historyButtonRef = useRef<any>()
  let _chatButtonRef = useRef<any>()

  function OnButtonClick (panelName: string) {
    if (_currentPanelName == panelName) _currentPanelName = ''
    else _currentPanelName = panelName

    ApplyCurrentPanelState()
  }

  function ApplyCurrentPanelState () {
    DisableAllPanels()

    switch (_currentPanelName) {
      case _betListKey:
        _betsListButtonRef.current?.SetHeld(true)
        break

      case _historyListKey:
        _historyButtonRef.current?.SetHeld(true)
        break

      case _chatKey:
        _chatButtonRef.current?.SetHeld(true)
        break

      default:
        break
    }
  }

  function DisableAllPanels () {
    _betsListButtonRef.current.SetHeld(false)
    _historyButtonRef.current.SetHeld(false)
    _chatButtonRef.current.SetHeld(false)
  }

  useEffect(() => {
    ApplyCurrentPanelState()
  })

  return (
    <div className='additional-content-container'>
      <div className='additional-content'>
        <If condition={_currentPanelName == _betListKey}>
          <BetsList />
        </If>

        <If condition={_currentPanelName == _historyListKey}>
          <HistoryList />
        </If>

        <If condition={_currentPanelName == _chatKey}>
          <Chat />
        </If>
      </div>

      <div className='content-buttons-container'>
        <div className='button-container'>
          <GameButton
            ref={_betsListButtonRef}
            onClickCallback={() => OnButtonClick(_betListKey)}
            iconSrc='/motograu/src/assets/sprites/UI/icons/list-icon.png'
            mainColor='yellow'
          />
        </div>
        <div className='button-container'>
          <GameButton
            ref={_historyButtonRef}
            onClickCallback={() => OnButtonClick(_historyListKey)}
            iconSrc='/motograu/src/assets/sprites/UI/icons/history-icon.png'
            mainColor='yellow'
          />
        </div>
        <div className='button-container'>
          <GameButton
            ref={_chatButtonRef}
            onClickCallback={() => OnButtonClick(_chatKey)}
            iconSrc='/motograu/src/assets/sprites/UI/icons/chat-icon.png'
            mainColor='yellow'
          />
        </div>
      </div>
    </div>
  )
}

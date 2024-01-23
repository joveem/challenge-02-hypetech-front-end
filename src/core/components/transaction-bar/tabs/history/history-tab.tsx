import './history-tab.css'

import React, { useContext, useEffect, useState } from 'react'
import BetList, { TransactionStatus } from '../../lists/history'
import { CrashGameContext } from '@/core/providers/games/crash-game.provider'
import Header from '../../lists/history/header'
import If from '@/core/components/conditions/if'
import BetHistoryItem from './bet-history-item'

type Props = {
  show?: boolean
}

export default function HistoryTab ({ show }: Props) {
  const { betsHistory, getBetsHistory } = useContext(CrashGameContext)

  const sum = (bets = []) => {
    let sum = 0
    bets.map(bet => {
      sum += parseFloat(bet.amount)
    })

    return sum.toFixed(2)
  }

  useEffect(() => {
    getBetsHistory()
  }, [])

  let _showNewStyle = true
  // let _showNewStyle = false

  return (
    <If condition={true}>
      <If condition={_showNewStyle}>
        <div className='bets-list-container'>
          <h1 className='title'>Histórico Pessoal</h1>

          <div className='header-container'>
            {/* <UserIcon className='header-item h-3.5 w-3.5' /> */}
            {/* <img
              src='/motograu/src/assets/sprites/UI/icons/user-icon.png'
              className='users-amount-icon header-item h-5 w-5'
            /> */}
            <span className='users-amount-text header-item'>
              {betsHistory.length}x
            </span>

            <span className='bets-sum-text header-item'>
              R$ {sum(betsHistory).replace('.', ',')}
            </span>
          </div>

          <div className='bets-container'>
            {betsHistory.map((item, idx) => (
              <BetHistoryItem key={idx} data={item} />
            ))}
            {/* {_messagesList.map((message, index) => (
            <ChatMessage
              LocalUserId={_localUserId}
              Message={message}
            />
          ))} */}
            {/* {messages.map((data: IGameMessage, idx: number) => (
              <ChatMessage
                LocalUserId={session.userId}
                Message={{
                  SenderId: '' + data.userId,
                  SenderName: '' + data.userId,
                  MessageContent: data.message,
                }}
              />
            ))} */}
          </div>
        </div>
      </If>
      <If condition={!_showNewStyle}>
        <div className='flex flex-col flex-1'>
          <section className='py-3 w-full'>
            <div className='flex justify-between items-center'>
              <div className='flex items-center'>
                <div className='text-sm'>{betsHistory.length}x</div>
              </div>

              <span className='text-sm'>R$ {sum(betsHistory)}</span>
            </div>
          </section>
          <Header />
          <section className='h-full flex-shrink-1 flex-grow basis-0  overflow-y-scroll scrollbar-w-0 scrollbar-track-gray-400 scrollbar-thumb-gray-700 scrollbar scrollbar-track-rounded scrollbar-thumb-rounded'>
            <BetList items={betsHistory} />
          </section>
        </div>
      </If>
    </If>
  )
}

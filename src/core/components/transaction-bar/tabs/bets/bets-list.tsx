import './bets-list.css'

import React, { useContext, useEffect, useState } from 'react'
import BetList from '../../lists/bets'
import { UserIcon } from '@heroicons/react/24/outline'

import { CrashGameContext } from '@/core/providers/games/crash-game.provider'
import Header from '../../lists/bets/header'
import If from '@/core/components/conditions/if'

import ListItem from './../../lists/bets/list-item'
import BetItem from './bet-item'

type Props = {
  show?: boolean
}

export default function BetsList ({ show }: Props) {
  const { registeredBets, getRegisteredBets } =
    useContext(CrashGameContext)

  const sum = (bets = []) => {
    let sum = 0
    bets.map(bet => {
      sum += parseFloat(bet.amount)
    })

    return sum.toFixed(2)
  }

  useEffect(() => {
    getRegisteredBets()
  }, [])

  let _showNewStyle = true

  return (
    <If condition={show}>
      <If condition={_showNewStyle}>
        <div className='bets-list-container'>
          <h1 className='title'>Apostas</h1>

          <div className='header-container'>
            {/* <UserIcon className='header-item h-3.5 w-3.5' /> */}
            <img
              src='/motograu/src/assets/sprites/UI/icons/user-icon.png'
              className='users-amount-icon header-item h-5 w-5'
            />
            <span className='users-amount-text header-item'>
              {registeredBets.length}
            </span>

            <span className='bets-sum-text header-item'>
              R$ {sum(registeredBets).replace('.', ',')}
            </span>
          </div>

          <div className='bets-container'>
            {registeredBets.map((item, idx) => (
              <BetItem key={idx} data={item} />
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
          <section className='py-3  w-full'>
            <div className='flex justify-between rounded bg-opacity-25 items-center '>
              <div className='flex items-center gap-1'>
                <UserIcon className='h-3.5 w-3.5' />
                <div className='text-sm'>{registeredBets.length}</div>
              </div>

              <span className='text-sm'>
                R$ {sum(registeredBets)}
              </span>
            </div>
          </section>

          <Header />
          <section className='h-full flex-shrink-1 flex-grow basis-0  overflow-y-scroll scrollbar-w-0 scrollbar-track-gray-400 scrollbar-thumb-gray-600 scrollbar scrollbar-track-rounded scrollbar-thumb-rounded'>
            <BetList items={registeredBets} />

            <div className='relative'>
              {registeredBets.map((item, idx) => (
                <BetItem key={idx} data={item} />
              ))}
            </div>
          </section>
        </div>
      </If>
    </If>
  )
}

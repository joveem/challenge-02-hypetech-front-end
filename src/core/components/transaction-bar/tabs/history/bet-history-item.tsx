import './bet-history-item.css'

import React, { useState, useEffect } from 'react'
import { Transaction, TransactionStatus } from './../../lists/history/index'
import If from '@/core/components/conditions/if'
import { dateToHumanReadable } from '@/core/helpers/date'

type Props = {
  data: Transaction
}

export default function BetItem ({ data }: Props) {
  const isGreen = data.outcome == 'win'
  const isRed = data.outcome == 'lose'
  const [randomNumber, setRandomNumber] = useState(null)

  // Gere o número aleatório uma única vez quando o componente for montado
  useEffect(() => {
    const randomNum = Math.floor(Math.random() * 21)
    setRandomNumber(randomNum)
  }, []) // O array vazio [] garante que o efeito seja executado apenas uma vez

  let showNewStyle = true
  // let showNewStyle = false

  return (
    <If condition={true}>
      <If condition={showNewStyle}>
        <div className='bet-item'>
          {/* <h1 className='sender-name'>{data.player.username}</h1> */}
          {/* <h1 className='sender-name'>Há 3 horas</h1> */}
          <h1 className='sender-name'>{dateToHumanReadable(data.updated_at)}</h1>

          <div className='content-container'>
            <span className='message-content'>
              {/* R$ {data.payout.toFixed(2)} */}
              R$ {data.amount.replace('.', ',')}
              {/* R$ 999.99 */}
            </span>

            {/* <span className='message-content message-content-win'>
              x2.50 (R$ 50,00)
            </span> */}
            <If condition={data.outcome == 'win'}>
              <span className='message-content message-content-win'>
                x{data.payout} (R${' '}
                {(data.amount  * data.payout).toFixed(2).replace('.', ',')})
              </span>
            </If>
          </div>
        </div>
      </If>
      <If condition={!showNewStyle}>
        <div
          className={`flex items-center rounded mb-1 border text-xs border-transparent p-1.5 gap-1 ${
            isGreen
              ? 'border-green-700 bg-green-600 bg-opacity-20'
              : ' border-gray-700 bg-gray-600 bg-opacity-20'
          } `}
        >
          <h1 className='w-1/4 flex gap-3 overflow-hidden items-center'>
            <img
              src={`https://api.multiavatar.com/${randomNumber}.svg`}
              className='w-5 h-5 rounded invert'
            />
            <span className='whitespace-nowrap player-name'>
              {/* {data.player.username} */}
            </span>
          </h1>
          <h1 className='w-1/4 text-center items-center gap-2'>
            <span className='w-10 text-right'>
              {/* R$ {data.amount.toFixed(2)} */}
            </span>
          </h1>
          <h1 className='w-1/4 items-center text-center gap-2'>
            <If condition={data.outcome == 'win'}>
              <span className='bg-green-500 text-center mx-auto rounded-full text-xs h-5 flex items-center justify-center text-gray-100 w-12'>
                {data.payout}x
              </span>
            </If>
          </h1>
          <div className='w-1/4 text-right'>
            {/* <If condition={data.outcome === 'win'}>
              {data.profit !== undefined &&
              typeof data.profit === 'number'
                ? `R$ ${data.profit.toFixed(2)}`
                : '0,00'}
            </If> */}
          </div>
        </div>
      </If>
    </If>
  )
}

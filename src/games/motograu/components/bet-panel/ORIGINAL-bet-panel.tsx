import './bet-panel.css'

import React, { useContext, useEffect, useRef, useState } from 'react'
import ProgressBar from '@/core/components/progress-bar'
import If from '@/core/components/conditions/if'
import { useSelector } from 'react-redux'

import { GameStatus } from '@/core/providers/enums/game-status'
import { CrashGameContext } from '@/core/providers/games/crash-game.provider'
import { TransactionStatus } from '@/core/providers/enums/transaction'

import GameButton from '../game-button/game-button'

//////////////////////
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import Tabs from '@/core/components/tabs'
import TextField from '@/core/components/text-field'
import store from '@/store'

import {
  formatCurrencyToNumber,
  formatOdd,
  formatBRLCurrency,
} from '@/core/helpers/format-currency'

let position = 'left'

  // ! //////////////////////////////////////////////
// import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
// import React, { useContext, useEffect, useRef, useState } from 'react'
// import Tabs from '@/core/components/tabs'
// import If from '@/core/components/conditions/if'
// import TextField from '@/core/components/text-field'
// import { GameStatus } from '@/core/providers/enums/game-status'

// import {
//   formatCurrencyToNumber,
//   formatOdd,
//   formatBRLCurrency,
// } from '@/core/helpers/format-currency'
// import { CrashGameContext } from '@/core/providers/games/crash-game.provider'
// import { TransactionStatus } from '@/core/providers/enums/transaction'
import { TransactionMode } from '@/core/providers/enums/transaction'
import { MAX_AMOUNT, MIN_AMOUNT } from '@/core/constants'

// import * as GameButton from "@/public/showcase-01/features/game-button/game-button.js"
// import * as GameButton from "./../../../../../public/showcase-01/features/game-button/game-button.js"
// import * as GameButton from "./../../../../../public/showcase-01/features/game-button/game-button.js"
// import "./../../../../../public/showcase-01/features/game-button/game-button.css"

type Props = {
  // color: string
  secondEnabled?: boolean
  toggleSecond?: Function
  hideSelf?: Function
  color?: string
  position: string
}

const getBackgroundColor = (color: string) => {
  switch (color) {
    case 'blue':
      return 'bg-blue-600 hover:bg-blue-700'
    case 'lime':
      return 'bg-[#28a909] hover:bg-[#28a909] border-[#b2f2a3]'
    case 'amber':
      return 'bg-amber-600 hover:bg-amber-700'
    case 'yellow':
      return 'bg-yellow-400 hover:bg-yellow-500'
    case 'red':
      return 'bg-red-700 hover:bg-red-800'
    case 'redDark':
      return 'bg-red-800 hover:bg-red-800'
    case 'pink':
      return 'bg-pink-700 hover:bg-pink-800'
    case 'rose':
      return 'bg-rose-700 hover:bg-rose-800'
    case 'custom-freestyle-v2':
      return 'custom-button-freestyle-v2'
    case 'purple':
      return 'bg-purple-600 hover:bg-purple-700'
    case 'blue2':
      return 'bg-blue-800 hover:bg-blue-700'
  }
}
  // ! //////////////////////////////////////////////

export default function BetPanel (props: Props) {
  const [_partialWithdrawSliderValue, setPartialWithdrawSliderValue] =
    useState('50')

  let toggleSecond = props.toggleSecond;
  let secondEnabled = props.secondEnabled;
  let hideSelf = props.hideSelf;
  let color = props.color;
  let position = props.position;

  // ! //////////////////////////////////////////////

  if (color === 'custom-freestyle-v2') {
    // Set hideSelf to true and secondEnabled to false when color is blue
    if (hideSelf) hideSelf()
    if (toggleSecond) toggleSecond()
  }

  const backgroundColor = getBackgroundColor(color)
  const formRef = useRef<any>(null)

  const {
    gameStatus,
    multiplier,
    registerTransaction,
    cancelTransaction,
    transactions,
    setTransactions,
    cashOut,
  } = useContext<any>(CrashGameContext)

  const transaction = transactions[position]
  useEffect(() => {
    // GameButton.ResetState()
    updateAmount(formatBRLCurrency(1.0))
    updateExitValue(formatBRLCurrency(100.0))
    // GameButton.ResetState()
  }, [])

  function submitTransaction (e) {
    e.preventDefault()
    registerTransaction(position)
  }

  function cancelFuterTransaction () {
    transaction.status = TransactionStatus.UNREGISTERED
    setTransactions({ ...transactions, [position]: transaction })
  }

  const updateMode = (value: string) => {
    transaction.mode = value
    setTransactions({ ...transactions, [position]: transaction })
  }

  const updateAmount = (value: string) => {
    let newAmount = formatCurrencyToNumber(value)

    if (newAmount < MIN_AMOUNT) newAmount = MIN_AMOUNT
    else if (newAmount > MAX_AMOUNT) newAmount = MAX_AMOUNT

    transaction.amount = formatOdd(newAmount)
    setTransactions({ ...transactions, [position]: transaction })
  }

  const updateExitValue = (value: string) => {
    const multiplier = formatCurrencyToNumber(value)

    transaction.exitValue = formatOdd(multiplier)
    // Verifica se o novo valor é menor que 1.5, se for, define como 1.5 - NUNCA pode ser menor que 1.5 pois reflete em um grande problema
    if (multiplier < 1.5) {
      transaction.exitValue = formatOdd(1.5)
    } else {
      transaction.exitValue = formatOdd(multiplier)
    }
    setTransactions({ ...transactions, [position]: transaction })
  }

  const updateRoundCount = (value: any) => {
    let parsed = parseInt(value)

    if (isNaN(parsed)) parsed = 0
    else if (parsed < 0) parsed = 0
    else if (parsed > 100) parsed = 100

    transaction.roundCount = parsed
    setTransactions({ ...transactions, [position]: transaction })
  }

  const doubleAmount = () => {
    const realAmount = transaction.amount
    updateAmount(formatBRLCurrency(realAmount * 2))
  }

  const divideAmount = () => {
    const realAmount = transaction.amount
    updateAmount(formatBRLCurrency(realAmount / 2))
  }

  const tabs = [
    { key: TransactionMode.COMMON, title: 'Normal' },
    { key: TransactionMode.AUTO, title: 'Auto' },
  ]

  // GameButton.ResetState()
  // ! //////////////////////////////////////////////

  // const formRef = useRef<any>(null)
  // const [activeTab, setActiveTab] = useState<string>('common')
  // const [amount, setAmount] = useState<string>(1.0)
  // const [exitValue, setExitValue] = useState<string>('100.00')
  // const [roundCount, setRoundCount] = useState('1')
  // const [minAmount, setMinAmount] = useState(0)
  // const [maxAmount, setMaxAmount] = useState(500.0)

  // const transactions = useSelector((state: any) => state.transaction)
  // const game = useSelector((state: any) => state.game)
  // const bet = useSelector((state: any) => state.bet)

  // const {
  //   gameStatus,
  //   multiplier,
  //   registerTransaction,
  //   cancelTransaction,
  //   transactions,
  //   setTransactions,
  //   cashOut,
  // } = useContext<any>(CrashGameContext)

  // const transaction = transactions[position]

  // let transaction: any = null
  // const transaction = useSelector(
  //   (state: any) => state.transaction.registered[position]
  // )
  // let handler: any = null
  // let multiplier: any = null
  // let gameStatus: any = null

  // const handler = useSelector((state :any) => state.game.handler)

  // if (transactions != null)
  //   transaction = transactions.registered[position]
  // else transaction = {}

  // if (game != null) {
  //   handler = game.handler
  //   gameStatus = game.status
  // }

  // if (bet != null) multiplier = bet.currentOdd

  // const transaction = useSelector(
  //   (state :any) => state.transaction.registered[position]
  // )

  // const handler = useSelector((state :any) => state.game.handler)
  // const multiplier = useSelector((state :any) => state.bet.currentOdd)
  // const gameStatus = useSelector((state :any) => state.game.status)

  // useEffect(() => {
  //   updateAmount(formatBRLCurrency(1.0))
  // }, [])

  function MainButton () {
    if (gameStatus == GameStatus.IDLE) registerTransaction()
  }

  // function registerTransaction () {
  //   // e.preventDefault() // TODO: REVIEW THIS
  //   document
  //     .getElementById('reactIFrame')
  //     .contentWindow.dispatchEvent(
  //       new CustomEvent('soundsPlayOneTime', {
  //         detail: {
  //           som: 'inicioDaPartida',
  //         },
  //       })
  //     )

  //   const transaction = {
  //     autoExit: activeTab == 'auto',
  //     status: TransactionStatus.PENDING,
  //     exitValue,
  //     autoRegister: false,
  //     index: position,
  //     amount,
  //   }

  //   store.dispatch({
  //     type: 'transaction/register',
  //     transaction,
  //   })

  //   if (gameStatus == GameStatus.IDLE) {
  //     handler.registerTransaction(transaction, position)
  //   }
  // }

  // function cancelTransaction () {
  //   if (gameStatus == GameStatus.IDLE) {
  //     handler.cancelTransaction(transaction)
  //   } else {
  //     cancelFuterTransaction()
  //   }
  // }

  // function cancelFuterTransaction () {
  //   store.dispatch({
  //     type: 'transaction/update',
  //     payload: {
  //       index: position,
  //       status: TransactionStatus.UNREGISTERED,
  //     },
  //   })
  // }

  // function cashOut () {
  //   document
  //     .getElementById('reactIFrame')
  //     .contentWindow.dispatchEvent(
  //       new CustomEvent('soundsPlayOneTime', {
  //         detail: {
  //           som: 'cashout',
  //         },
  //       })
  //     )

  //   handler.cashOut(transaction, multiplier)
  // }

  // const updateAmount = (value: string) => {
  //   const newAmount = formatCurrencyToNumber(value)

  //   if (newAmount < minAmount) setAmount(formatOdd(minAmount))
  //   else if (newAmount > maxAmount) setAmount(formatOdd(maxAmount))
  //   else setAmount(formatOdd(newAmount))
  // }

  // const updateExitValue = (value: string) => {
  //   const multiplier = formatCurrencyToNumber(value)

  //   transaction.exitValue = formatOdd(multiplier)
  //   // Verifica se o novo valor é menor que 1.5, se for, define como 1.5 - NUNCA pode ser menor que 1.5 pois reflete em um grande problema
  //   if (multiplier < 1.5) {
  //     transaction.exitValue = formatOdd(1.5)
  //   } else {
  //     transaction.exitValue = formatOdd(multiplier)
  //   }
  //   setTransactions({ ...transactions, [position]: transaction })
  // }

  // const doubleAmount = () => {
  //   const realAmount = formatCurrencyToNumber(amount)
  //   updateAmount(formatBRLCurrency(realAmount * 2))
  // }

  // const updateRoundCount = () => {
  //   setRoundCount('1')
  // }

  // const divideAmount = () => {
  //   const realAmount = formatCurrencyToNumber(amount)
  //   updateAmount(formatBRLCurrency(realAmount / 2))
  // }

  // const tabs = [
  //   { key: 'common', title: 'Normal' },
  //   { key: 'auto', title: 'Auto' },
  // ]

  return (
    <div className='bet-panel-container'>
      <div className='bet-panel'>
        <div className='bet-button-section'>
          <GameButton
            contentTitle='Apostar'
            contentTitleClass='bet-button-title'
            contentSubtitle={'R$ ' + transaction.amount}
            contentSubtitleClass='bet-button-subtitle'
            mainColor='green'
            onClickCallback={MainButton}
          />
        </div>

        <div className='value-section'>
          <div className='value-multiplier-container'>
            <GameButton
              contentTitle='÷2'
              contentTitleClass='value-multiplier-title'
              mainColor='gray'
            />
          </div>
          <div className='value-input-container'>
            <span className='input-header-title'>valor</span>
            <input
              value='1,00'
              className='value-input'
              type='text'
              name=''
              id=''
            />
          </div>
          <div className='value-multiplier-container'>
            <GameButton
              contentTitle='x2'
              contentTitleClass='value-multiplier-title'
              mainColor='gray'
            />
          </div>
        </div>

        <div className='auto-withdraw-section'>
          <div className='auto-withdraw-button-container'>
            <GameButton
              iconSrc='/motograu/src/assets/sprites/UI/icons/auto-withdraw-icon.png'
              iconClass='auto-withdraw-icon'
              mainColor='gray'
            />
          </div>
          <div className='value-input-container'>
            <span className='input-header-title'>
              auto-retirar no
            </span>
            <input
              className='value-input'
              value='x1.50'
              type='text'
              name=''
              id=''
            />
          </div>
        </div>

        <div className='auto-bet-section'>
          <div className='auto-bet-button-container'>
            <GameButton
              iconSrc='/motograu/src/assets/sprites/UI/icons/auto-bet-icon.png'
              iconClass='auto-bet-icon'
              mainColor='gray'
            />
          </div>
          <div className='value-input-container'>
            <span className='input-header-title'>
              entradas automáticas
            </span>
            <input
              className='value-input'
              value='5'
              type='text'
              name=''
              id=''
            />
          </div>
        </div>

        <div className='partial-withdraw-section'>
          <div className='auto-bet-button-container'>
            <GameButton
              contentTitle='%'
              contentTitleClass='partial-withdraw-button-title'
              // iconSrc='/motograu/src/assets/sprites/UI/icons/auto-bet-icon.png'
              // iconClass='auto-bet-icon'
              mainColor='gray'
            />
          </div>
          <div className='value-input-container'>
            <span className='input-header-title'>
              retirada parcial
            </span>
            <span className='slider-input-value-text'>
              {_partialWithdrawSliderValue}%
            </span>
            <input
              className='slider-input'
              type='range'
              // id='cowbell'
              // name='cowbell'
              min='5'
              max='95'
              // value='50'
              step='5'
              value={_partialWithdrawSliderValue}
              onChange={e =>
                setPartialWithdrawSliderValue(e.target.value)
              }
            />
            {/* <input
              className='value-input'
              value='50%'
              type='text'
              name=''
              id=''
            /> */}
          </div>
        </div>

        <div className='advanced-options-button-section'>
          <GameButton
            contentTitle='Opções avançadas...'
            contentTitleClass='advanced-options-title'
            mainColor='yellow'
          />
        </div>
      </div>

      {/* <h1 className='title'>Chat</h1>

      <div className='messages-container'>
        {_messagesList.map((message, index) => (
          <ChatMessage LocalUserId={_localUserId} Message={message} />
        ))}
      </div>

      <div className='message-input-container'>
        <button className='input-button emoji-button'>
          <img
            className='emoji-button-icon'
            src='/motograu/src/assets/sprites/UI/icons/emoji-icon.png'
            alt=''
          />
        </button>

        <input
          className='message-input'
          type='text'
          placeholder='Enter search text...'
        ></input>

        <button className='input-button send-button'>
          <img
            className='send-button-icon'
            src='/motograu/src/assets/sprites/UI/icons/send-icon.png'
            alt=''
          />
        </button>
      </div> */}
    </div>
  )
}

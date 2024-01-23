import './bet-panel.css'

import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Tabs from '@/core/components/tabs'
import If from '@/core/components/conditions/if'
import TextField from '@/core/components/text-field'
import { GameStatus } from '@/core/providers/enums/game-status'

import {
  formatCurrencyToNumber,
  formatOdd,
  formatBRLCurrency,
} from '@/core/helpers/format-currency'
import { CrashGameContext } from '@/core/providers/games/crash-game.provider'
import { TransactionStatus } from '@/core/providers/enums/transaction'
import { TransactionMode } from '@/core/providers/enums/transaction'
import { MAX_AMOUNT, MIN_AMOUNT } from '@/core/constants'

// import * as GameButton from "@/public/showcase-01/features/game-button/game-button.js"
// import * as GameButton from "./../../../../../public/showcase-01/features/game-button/game-button.js"
// import * as GameButton from './../../../../../public/showcase-01/features/game-button/game-button.js'
// import './../../../../../public/showcase-01/features/game-button/game-button.css'

// import GameButton from './../game-button/game-button'

import GameButton from './../../../../games/motograu/components/game-button/game-button'

type Props = {
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

export default function BetPanel ({
  toggleSecond,
  secondEnabled,
  hideSelf,
  color = 'lime',
  position,
}: Props) {
  if (color === 'custom-freestyle-v2') {
    // Set hideSelf to true and secondEnabled to false when color is blue
    if (hideSelf) hideSelf()
    if (toggleSecond) toggleSecond()
  }

  const backgroundColor = getBackgroundColor(color)
  const formRef = useRef<any>(null)

  const [_partialWithdrawSliderValue, setPartialWithdrawSliderValue] =
    useState('50')

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
    if (e != null) e.preventDefault()
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

  const [_isAutoWithdrawEnabled, setIsAutoWithdrawEnabled] =
    useState(false)
  const [_autoWithdrawValue, setAutoWithdrawValue] = useState(1.5)

  const OnAutoWithdrawValueChanged = (value: string) => {
    setAutoWithdrawValue(formatCurrencyToNumber(value))

    if (_isAutoWithdrawEnabled) updateExitValue(value)
    else updateExitValue('50000')
  }

  const OnAutoWithdrawValueBlur = (value: string) => {
    let valueNumber = formatCurrencyToNumber(value)

    if (valueNumber < 1.5) valueNumber = 1.5

    setAutoWithdrawValue(valueNumber)

    if (_isAutoWithdrawEnabled)
      updateExitValue(valueNumber.toFixed(2))
    else updateExitValue('500.00')
  }

  const OnAutoWithdrawEnabledChanged = () => {
    setAutoWithdrawValue(
      formatCurrencyToNumber(_autoWithdrawValue.toFixed(2))
    )

    if (!_isAutoWithdrawEnabled)
      updateExitValue(_autoWithdrawValue.toFixed(2))
    else updateExitValue('500.00')

    setIsAutoWithdrawEnabled(!_isAutoWithdrawEnabled)
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

  let stateName = GetStateName()

  let mainButtonTitle = GetMainButtonTitle(stateName)
  let mainButtonTitleClass = GetMainButtonTitleClass(stateName)
  let mainButtonSubtitle = GetMainButtonSubtitle(stateName)
  let mainButtonColor = GetMainButtonColor(stateName)
  let autoBetButtonColor = GetAutoBetButtonColor()
  let autoWithdrawButtonColor = GetAutoWithdrawButtonColor()

  let autoWithdrawInputText = GetAutoWithdrawInputText()

  // if()

  function GetStateName () {
    let value: string = 'UNDEFINED'

    if (
      transaction == null ||
      transaction?.status == TransactionStatus.UNREGISTERED
    ) {
      if (transaction.mode != TransactionMode.AUTO) value = 'apostar'
      else value = 'apostar-auto'
    } else if (
      gameStatus != GameStatus.RUNNING &&
      transaction?.status == TransactionStatus.REGISTERED
    )
      value = 'cancelar-not-running'
    else if (
      gameStatus == GameStatus.RUNNING &&
      transaction?.status == TransactionStatus.REGISTERED
    )
      value = 'cancelar-running'
    else if (
      gameStatus != GameStatus.IDLE &&
      transaction?.status == TransactionStatus.PENDING
    )
      value = 'cancelar-running-idle'

    return value
  }

  function MainButton () {
    let stateName = GetStateName()

    if (_isAutoWithdrawEnabled)
      updateExitValue(_autoWithdrawValue.toFixed(2))
    else updateExitValue('500.00')

    switch (stateName) {
      case 'apostar':
      case 'apostar-auto':
        submitTransaction(null)
        break

      case 'cancelar-not-running':
        cancelTransaction(position)
        break

      case 'cancelar-running':
        cashOut(position)
        break

      case 'cancelar-running-idle':
        cancelFuterTransaction()
        break

      default:
        console.log(
          '$ > UNEXPECTED stateName! | stateName = ' + stateName
        )
        break
    }
  }

  function AutoBetButton () {
    if (transaction.mode == TransactionMode.COMMON) updateMode('auto')
    else updateMode('common')
  }

  function GetMainButtonTitle (stateName: string) {
    let value: string = '...'

    switch (stateName) {
      case 'apostar':
        value = 'Apostar'
        break

      case 'apostar-auto':
        value = 'Apostar Auto'
        break

      case 'cancelar-not-running': {
        if (!transaction.autoStarted) value = 'Cancelar'
        else
          value =
            'Cancelar (' +
            (Number.parseInt(transaction.roundCount) + 1) +
            ')'

        break
      }

      case 'cancelar-running':
        value = 'Retirar'
        break

      case 'cancelar-running-idle':
        value = 'Cancelar'
        break

      default:
        console.log(
          '$ > UNEXPECTED stateName! | stateName = ' + stateName
        )
        break
    }

    return value
  }

  function GetMainButtonTitleClass (stateName: string) {
    let value: string = ''

    switch (stateName) {
      case 'apostar':
      case 'apostar-auto':
      case 'cancelar-not-running':
      case 'cancelar-running':
        break

      case 'cancelar-running-idle':
        value = 'center-solo-title'
        break

      default:
        console.log(
          '$ > UNEXPECTED stateName! | stateName = ' + stateName
        )
        break
    }

    return value
  }

  function GetMainButtonSubtitle (stateName: string) {
    let value: string = '...'

    switch (stateName) {
      case 'apostar':
      case 'apostar-auto':
      case 'cancelar-not-running':
        value = 'R$ ' + transaction.amount.replace('.', ',')
        break

      case 'cancelar-running':
        value =
          'R$ ' +
          (transaction.amount * multiplier)
            .toFixed(2)
            .replace('.', ',')
        break

      case 'cancelar-running-idle':
        value = ''
        break

      default:
        console.log(
          '$ > UNEXPECTED stateName! | stateName = ' + stateName
        )
        break
    }

    return value
  }

  function GetMainButtonColor (stateName: string) {
    let value: string | null = 'gray'

    switch (stateName) {
      case 'apostar':
      case 'apostar-auto':
        value = 'green'
        break

      case 'cancelar-running':
        value = 'orange'
        break

      case 'cancelar-not-running':
      case 'cancelar-running-idle':
        value = 'red'
        break

      default:
        console.log(
          '$ > UNEXPECTED stateName! | stateName = ' + stateName
        )
        break
    }

    return value
  }

  function GetAutoBetButtonColor () {
    let value: string | null = 'gray'

    if (transaction.mode == TransactionMode.AUTO) value = 'green'

    return value
  }

  function GetAutoWithdrawButtonColor () {
    let value: string | null = 'gray'

    if (_isAutoWithdrawEnabled) value = 'green'

    return value
  }

  function GetAutoWithdrawInputText () {
    let value: string | null = '...'

    value = 'x' + _autoWithdrawValue.toFixed(2)

    return value
  }

  let _mainButtonRef = useRef<any>()
  let _duplicateValueButtonRef = useRef<any>()
  let _divideValueButtonRef = useRef<any>()
  let _autoWithdrawButtonRef = useRef<any>()
  let _autoBetButtonRef = useRef<any>()
  let _partialWithdrawButtonRef = useRef<any>()

  let _advancedSettingButtonRef = useRef<any>()

  let _autoWithdrawPinButtonRef = useRef<any>()
  let _autoBetPinButtonRef = useRef<any>()
  let _partialWithdrawPinButtonRef = useRef<any>()

  // let = false
  const [_isAdvancedSettingOppened, setIsAdvancedSettingOppened] =
    useState(false)

  function AdvancedSettingButton () {
    setIsAdvancedSettingOppened(!_isAdvancedSettingOppened)

    _advancedSettingButtonRef.current?.SetHeld(
      !_isAdvancedSettingOppened
    )
  }

  function HandleLockeableButtons (canChangeValues: boolean) {
    _mainButtonRef.current?.SetActive(
      _isAdvancedSettingOppened ? false : true
    )
    _duplicateValueButtonRef.current?.SetActive(
      _isAdvancedSettingOppened ? false : canChangeValues
    )
    _divideValueButtonRef.current?.SetActive(
      _isAdvancedSettingOppened ? false : canChangeValues
    )
    _autoWithdrawButtonRef.current?.SetActive(
      _isAdvancedSettingOppened ? false : canChangeValues
    )
    _autoBetButtonRef.current?.SetActive(
      _isAdvancedSettingOppened ? false : canChangeValues
    )
    _partialWithdrawButtonRef.current?.SetActive(
      _isAdvancedSettingOppened ? false : canChangeValues
    )
    _advancedSettingButtonRef.current?.SetActive(
      _isAdvancedSettingOppened || canChangeValues
    )
  }

  let canChangeValues = !(
    _isAdvancedSettingOppened ||
    transaction.status != TransactionStatus.UNREGISTERED
  )
  const [_pinnedSectionsList, setPinnedSectionsList] = useState([])

  const _autoWithdrawSectionKey = 'auto-withdraw-section'
  const _autoBetSectionKey = 'auto-bet-section'
  const _partialWithdrawSectionKey = 'partial-withdraw-section'

  let isAutoWithdrawSectionPinned = _pinnedSectionsList.includes(
    _autoWithdrawSectionKey
  )
  let isAutoBetSectionPinned = _pinnedSectionsList.includes(
    _autoBetSectionKey
  )
  let isPartialWithdrawSectionPinned = _pinnedSectionsList.includes(
    _partialWithdrawSectionKey
  )

  let hasToShowAutoWithdrawSection =
    _isAdvancedSettingOppened ||
    _isAutoWithdrawEnabled ||
    isAutoWithdrawSectionPinned

  let hasToShowAutoBetSection =
    _isAdvancedSettingOppened ||
    transaction.mode == TransactionMode.AUTO ||
    isAutoBetSectionPinned

  let hasToShowPartialWithdrawSection =
    _isAdvancedSettingOppened || isPartialWithdrawSectionPinned

  HandleLockeableButtons(canChangeValues)
  HandlePinsButtons()

  function HandlePinsButtons () {
    _autoWithdrawPinButtonRef.current?.SetHeld(
      isAutoWithdrawSectionPinned
    )
    _autoBetPinButtonRef.current?.SetHeld(isAutoBetSectionPinned)
    _partialWithdrawPinButtonRef.current?.SetHeld(
      isPartialWithdrawSectionPinned
    )
  }

  function PinButton (sectionName) {
    let pinnedSectionsList = _pinnedSectionsList

    let isAlreadyPinned = pinnedSectionsList.includes(sectionName)

    if (isAlreadyPinned) {
      pinnedSectionsList = pinnedSectionsList.filter(
        item => item != sectionName
      )
    } else pinnedSectionsList.push(sectionName)

    setPinnedSectionsList(pinnedSectionsList)
  }

  return (
    <div className='bet-panel-container'>
      <div className='bet-panel'>
        <div className='bet-button-section'>
          <GameButton
            contentTitle={mainButtonTitle}
            contentTitleClass={
              'bet-button-title ' + mainButtonTitleClass
            }
            contentSubtitle={mainButtonSubtitle}
            contentSubtitleClass='bet-button-subtitle'
            mainColor={mainButtonColor}
            onClickCallback={MainButton}
            ref={_mainButtonRef}
          />
        </div>

        <div className='value-section'>
          <div className='value-multiplier-container'>
            <GameButton
              ref={_divideValueButtonRef}
              contentTitle='÷2'
              contentTitleClass='value-multiplier-title'
              mainColor='gray'
              onClickCallback={divideAmount}
            />
          </div>
          <div className='value-input-container'>
            <span className='input-header-title'>valor</span>
            <input
              // value='1,00'
              className='value-input'
              type='text'
              name=''
              id=''
              disabled={!canChangeValues}
              value={transaction.amount}
              onChange={e => updateAmount(e.target.value)}
            />
          </div>
          <div className='value-multiplier-container'>
            <GameButton
              ref={_duplicateValueButtonRef}
              contentTitle='x2'
              contentTitleClass='value-multiplier-title'
              mainColor='gray'
              onClickCallback={doubleAmount}
            />
          </div>
        </div>

        <If condition={hasToShowAutoWithdrawSection}>
          <div className='auto-withdraw-section'>
            <If condition={_isAdvancedSettingOppened}>
              <div className='pin-button-container'>
                <GameButton
                  // contentTitle='o'
                  // contentTitleClass='partial-withdraw-button-title'
                  // iconSrc='/motograu/src/assets/sprites/UI/icons/auto-bet-icon.png'
                  iconSrc='/motograu/src/assets/sprites/UI/icons/pin-icon.png'
                  iconClass='pin-icon'
                  mainColor='gray'
                  onClickCallback={() =>
                    PinButton(_autoWithdrawSectionKey)
                  }
                  ref={_autoWithdrawPinButtonRef}
                />
              </div>
            </If>

            <div className='auto-withdraw-button-container'>
              <GameButton
                ref={_autoWithdrawButtonRef}
                iconSrc='/motograu/src/assets/sprites/UI/icons/auto-withdraw-icon.png'
                iconClass='auto-withdraw-icon'
                mainColor={autoWithdrawButtonColor}
                onClickCallback={OnAutoWithdrawEnabledChanged}
              />
            </div>
            <div className='value-input-container'>
              <span className='input-header-title'>
                auto-retirar no
              </span>
              <input
                className='value-input'
                value={autoWithdrawInputText}
                type='text'
                name=''
                id=''
                disabled={!canChangeValues}
                onChange={e =>
                  OnAutoWithdrawValueChanged(e.target.value)
                }
                onBlur={e => OnAutoWithdrawValueBlur(e.target.value)}
              />
            </div>
          </div>
        </If>

        <If condition={hasToShowAutoBetSection}>
          <div className='auto-bet-section'>
            <If condition={_isAdvancedSettingOppened}>
              <div className='pin-button-container'>
                <GameButton
                  // contentTitle='o'
                  // contentTitleClass='partial-withdraw-button-title'
                  // iconSrc='/motograu/src/assets/sprites/UI/icons/auto-bet-icon.png'
                  iconSrc='/motograu/src/assets/sprites/UI/icons/pin-icon.png'
                  iconClass='pin-icon'
                  mainColor='gray'
                  onClickCallback={() =>
                    PinButton(_autoBetSectionKey)
                  }
                  ref={_autoBetPinButtonRef}
                />
              </div>
            </If>

            <div className='auto-bet-button-container'>
              <GameButton
                iconSrc='/motograu/src/assets/sprites/UI/icons/auto-bet-icon.png'
                iconClass='auto-bet-icon'
                mainColor={autoBetButtonColor}
                onClickCallback={AutoBetButton}
                ref={_autoBetButtonRef}
              />
            </div>
            <div className='value-input-container'>
              <span className='input-header-title'>
                entradas automáticas
              </span>
              <input
                className='value-input'
                // value='5'
                type='text'
                name=''
                id=''
                disabled={!canChangeValues}
                value={transaction.roundCount}
                onChange={e => updateRoundCount(e.target.value)}
              />
            </div>
          </div>
        </If>

        <If condition={hasToShowPartialWithdrawSection}>
          <div className='partial-withdraw-section'>
            <If condition={_isAdvancedSettingOppened}>
              <div className='pin-button-container'>
                <GameButton
                  // contentTitle='o'
                  // contentTitleClass='partial-withdraw-button-title'
                  // iconSrc='/motograu/src/assets/sprites/UI/icons/auto-bet-icon.png'
                  iconSrc='/motograu/src/assets/sprites/UI/icons/pin-icon.png'
                  iconClass='pin-icon'
                  mainColor='gray'
                  onClickCallback={() =>
                    PinButton(_partialWithdrawSectionKey)
                  }
                  ref={_partialWithdrawPinButtonRef}
                />
              </div>
            </If>

            <div className='partial-withdraw-button-container'>
              <GameButton
                contentTitle='%'
                contentTitleClass='partial-withdraw-button-title'
                // iconSrc='/motograu/src/assets/sprites/UI/icons/auto-bet-icon.png'
                // iconClass='auto-bet-icon'
                mainColor='gray'
                ref={_partialWithdrawButtonRef}
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
        </If>

        <div className='advanced-options-button-section'>
          <GameButton
            contentTitle='Opções avançadas...'
            contentTitleClass='advanced-options-title'
            mainColor='yellow'
            ref={_advancedSettingButtonRef}
            onClickCallback={AdvancedSettingButton}
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

      {/*

    // <div className="bg-black border border-gray-600 bg-opacity-20 border-opacity-20 crash-form w-full h-45 md:w-1/2 flex rounded-md p-3 relative">
    //   <If condition={toggleSecond && !secondEnabled}>
    //     <button
    //       onClick={toggleSecond}
    //       className={`btn border-none bg-[#ffffff] bg-opacity-10 btn-xs btn-circle absolute px-1 mt-1 right-3`}
    //     >
    //       <PlusIcon className="h-4 w-4" />
    //     </button>
    //   </If>

    //   <If condition={hideSelf}>
    //     <button
    //       onClick={() => hideSelf()}
    //       className={`btn border-none btn-xs bg-[#ffffff] bg-opacity-10 hover:bg-opacity-95 btn-circle absolute px-1 mt-1 right-3`}
    //     >
    //       <MinusIcon className="h-4 w-4" />
    //     </button>
    //   </If>

    //   <form
    //     ref={formRef}
    //     method="POST"
    //     className="w-full xl:w-[75%] mx-auto justify-center"
    //     onSubmit={(e) => submitTransaction(e)}
    //   >
    //     <input type="hidden" name="teste" />
    //     <div className="w-full flex justify-center mb-3">
    //       <div className="w-[80%]">
    //         <Tabs
    //           tabs={tabs}
    //           size="w-1/2"
    //           active={transaction.mode}
    //           toggle={updateMode}
    //           variant={'gray'}
    //         />
    //       </div>
    //     </div>
    //     <section className="flex mx-auto gap-3">
    //       <div className="flex flex-col w-6/12 sm:w-6/12">
    //         <div className="flex mb-2 gap-2">
    //           <div className="w-1/2">
    //             <TextField
    //               id="valueInput"
    //               name="amount"
    //               className="text-lg text-white"
    //               disabled={
    //                 transaction.status !=
    //                 TransactionStatus.UNREGISTERED
    //               }
    //               value={transaction.amount}
    //               setValue={updateAmount}
    //               label="Valor"
    //             />
    //           </div>

    //           <div className="w-1/2">
    //             <div className="grid gap-2 h-full grid-cols-2">
    //               <div className="col-span-1">
    //                 <button
    //                   onClick={divideAmount}
    //                   type="button"
    //                   disabled={
    //                     transaction.status !=
    //                     TransactionStatus.UNREGISTERED
    //                   }
    //                   className="btn btn-ghost min-h-0 flex-1 w-full h-full rounded text-xl font-normal disabled:bg-gray-700 disabled:bg-opacity-30 border-gray-700 border-opacity-40"
    //                 >
    //                   &frac12;
    //                 </button>
    //               </div>

    //               <div className="col-span-1">
    //                 <button
    //                   onClick={doubleAmount}
    //                   type="button"
    //                   disabled={
    //                     transaction.status !=
    //                     TransactionStatus.UNREGISTERED
    //                   }
    //                   className="btn btn-ghost min-h-0 grow w-full h-full rounded capitalize text-normal font-normal disabled:bg-gray-700 disabled:bg-opacity-30 border-gray-700 border-opacity-40"
    //                 >
    //                   2x
    //                 </button>
    //               </div>
    //             </div>
    //           </div>
    //         </div>

    //         <div className="flex gap-2">
    //           <TextField
    //             id="valueInput"
    //             name="amount"
    //             disabled={
    //               transaction.status != TransactionStatus.UNREGISTERED
    //             }
    //             value={transaction.exitValue}
    //             setValue={updateExitValue}
    //             label="Auto Retirar"
    //           />
    //           <If
    //             condition={transaction.mode == TransactionMode.AUTO}
    //           >
    //             <TextField
    //               id="valueInput"
    //               name="amount"
    //               disabled={
    //                 transaction.status !=
    //                 TransactionStatus.UNREGISTERED
    //               }
    //               value={transaction.roundCount}
    //               setValue={updateRoundCount}
    //               label="Quantidade"
    //             />
    //           </If>
    //         </div>
    //       </div>

    //       <div className="w-6/12">
    //         <If
    //           condition={
    //             transaction == null ||
    //             transaction?.status == TransactionStatus.UNREGISTERED
    //           }
    //         >
    //           <div className="game-button">
    //             <button
    //               className="main-button"
    //               onMouseDown={GameButton.HandleMouseUpEvent}
    //             ></button>

    //             <div className="content-container">
    //               <span className="title title-01 text-sm font-normal text-white text-sm">
    //                 {transaction.mode == TransactionMode.COMMON
    //                   ? "Apostar"
    //                   : "Aposta Auto"}
    //               </span>
    //               <br />
    //               <span className="title title-02 mt-[3px] font-normal text-shadow-sm">
    //                 {" "}
    //                 {"R$ " + transaction.amount}
    //               </span>
    //             </div>

    //             <button className="border-sprite sprite-color-light-green"></button>

    //             <img className="center-sprite sprite-color-light-green" />
    //           </div>
    //         </If>

    //         <If
    //           condition={
    //             gameStatus != GameStatus.RUNNING &&
    //             transaction?.status == TransactionStatus.REGISTERED
    //           }
    //         >
    //           <div className="game-button">
    //             <button
    //               className="main-button"
    //               onClick={() => cancelTransaction(position)}
    //               onMouseDown={GameButton.HandleMouseUpEvent}
    //             ></button>

    //             <div className="content-container">
    //               <If condition={transaction.autoStarted}>
    //                 <span className="title title-01 text-sm">
    //                   Cancelar ({transaction.roundCount + 1})
    //                 </span>
    //               </If>

    //               <If condition={!transaction.autoStarted}>
    //                 <span className="title title-01 text-sm">
    //                   Cancelar
    //                 </span>
    //               </If>
    //               <br />
    //               <span className="title title-02 mt-[3px] font-normal text-shadow-sm">
    //                 {"R$ " + transaction.amount}
    //               </span>
    //             </div>

    //             <button className="border-sprite sprite-color-light-red"></button>

    //             <img className="center-sprite sprite-color-light-red" />
    //           </div>
    //         </If>

    //         <If
    //           condition={
    //             gameStatus != GameStatus.IDLE &&
    //             transaction?.status == TransactionStatus.PENDING
    //           }
    //         >
    //           <div className="game-button">
    //             <button
    //               className="main-button"
    //               onClick={cancelFuterTransaction}
    //               onMouseDown={GameButton.HandleMouseUpEvent}
    //             ></button>

    //             <div className="content-container">
    //               <span className="title title-01 text-xl text-large">
    //                 Cancelar
    //               </span>
    //             </div>

    //             <button className="border-sprite sprite-color-light-red"></button>

    //             <img className="center-sprite sprite-color-light-red" />
    //           </div>
    //         </If>

    //         <If
    //           condition={
    //             gameStatus == GameStatus.RUNNING &&
    //             transaction?.status == TransactionStatus.REGISTERED
    //           }
    //         >
    //           <div className="game-button">
    //             <button
    //               className="main-button"
    //               onClick={() => cashOut(position)}
    //               onMouseDown={GameButton.HandleMouseUpEvent}
    //             ></button>

    //             <div className="content-container">
    //               <If condition={transaction.autoStarted}>
    //                 <span className="title title-01 text-sm">
    //                   Retirar ({transaction.roundCount + 1})
    //                 </span>
    //               </If>

    //               <If condition={!transaction.autoStarted}>
    //                 <span className="title title-01 text-sm">
    //                   Retirar
    //                 </span>
    //               </If>
    //               <br />
    //               <span className="title title-02 mt-[3px] font-normal text-shadow-sm">
    //                 {"R$ " + transaction.amount}
    //               </span>
    //             </div>

    //             <button className="border-sprite sprite-color-light-orange"></button>

    //             <img className="center-sprite sprite-color-light-orange" />
    //           </div>
    //         </If>
    //       </div>
    //     </section>
    //   </form>
    //   <img className='preload-01' />
    // </div>*/}
    </div>
  )
}

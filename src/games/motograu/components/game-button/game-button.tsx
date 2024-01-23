import './game-button.css'

import React, {
  useContext,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react'
import ProgressBar from '@/core/components/progress-bar'
import If from '@/core/components/conditions/if'
import { GameStatus } from '@/core/providers/enums/game-status'
import { CrashGameContext } from '@/core/providers/games/crash-game.provider'

type Props = {
  mainColor?: string

  contentTitle?: string
  contentTitleClass?: string

  contentSubtitle?: string
  contentSubtitleClass?: string

  iconSrc?: string
  iconClass?: string

  onClickCallback?: (() => void) | null
}

// let _isPressed : boolean = false;
// let _isPressed: boolean = false

const GameButton = forwardRef((props: Props, ref) => {
  const [_isActive, SetIsActive] = useState(true)
  const [_isHeld, SetIsHeld] = useState(false)
  const [_isPressed, SetIsPressed] = useState(false)

  let _onClickCallback: (() => void) | null = null
  let _mainColor: string = 'red'

  if (props.mainColor != null) _mainColor = props.mainColor

  let _centerSpriteClass =
    _isHeld || _isPressed ? 'center-sprite-pressed' : ''
  let _borderSpriteClass =
    _isHeld || _isPressed ? 'border-sprite-pressed' : ''
  let _contentContainerClass =
    _isHeld || _isPressed ? 'content-container-pressed' : ''

  let _spriteColorGrade = _isActive ? 'light' : 'dark'
  let _spriteColorClass =
    'sprite-color-' + _spriteColorGrade + '-' + _mainColor

  function OnPressDown () {
    if (_isActive) SetIsPressed(true)
    window.onmouseup = OnPressUp
  }

  function OnPressUp () {
    window.onmouseup = null
    if (_isActive) SetIsPressed(false)
  }

  function OnClick () {
    if (_isActive && _onClickCallback != null) _onClickCallback()
  }

  _onClickCallback = props.onClickCallback

  useImperativeHandle(ref, () => ({
    SetActive (isActive: boolean) {
      SetIsActive(isActive)
    },
    SetHeld (isHeld: boolean) {
      SetIsHeld(isHeld)
    },
  }))

  let hasTitle = props.contentTitle != null
  let hasSubtitle = props.contentSubtitle != null
  let hasIcon = props.iconSrc != null

  return (
    <div className='game-button'>
      <button
        className='main-button'
        onMouseDown={OnPressDown}
        onMouseUp={OnPressUp}
        onClick={OnClick}
      ></button>

      <div className={`content-container ${_contentContainerClass}`}>
        <If condition={hasTitle}>
          <span
            className={'title title-01 ' + props.contentTitleClass}
          >
            {props.contentTitle}
          </span>
        </If>

        <If condition={hasTitle && hasSubtitle}>
          <br />
        </If>

        <If condition={hasSubtitle}>
          <span
            className={'title title-02 ' + props.contentSubtitleClass}
          >
            {props.contentSubtitle}
          </span>
        </If>

        <If condition={hasIcon}>
          <img
            className={'icon ' + props.iconClass}
            src={props.iconSrc}
          />
        </If>
      </div>

      <button
        className={`border-sprite ${_borderSpriteClass} ${_spriteColorClass}`}
      ></button>
      <img
        className={`center-sprite ${_centerSpriteClass} ${_spriteColorClass}`}
      />
    </div>
  )
})

export default GameButton

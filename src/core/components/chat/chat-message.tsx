import './chat-message.css'

import React, { useContext, useEffect, useRef, useState } from 'react'
import ProgressBar from '@/core/components/progress-bar'
import If from '@/core/components/conditions/if'
import { GameStatus } from '@/core/providers/enums/game-status'
import { CrashGameContext } from '@/core/providers/games/crash-game.provider'

// import GameButton from './../../../ components/game-button/game-button'
// import GameButton from './../game-button/game-button'

type Props = {
  LocalUserId?: string
  Message?: Message
}

type Message = {
  SenderId: string
  SenderName: string
  MessageContent: string
}

export default function ChatMessage (props: Props) {
  function IsLocalMessage (): boolean {
    let value = false

    if (props.Message != null)
      value = props.Message.SenderId == props.LocalUserId

    return value
  }

  let chatMessageClass = 'chat-message'
  let contentClass = 'message-content'

  let senderName = 'Name name'
  let messageContent = 'Message message message message'

  if (IsLocalMessage()) {
    chatMessageClass = 'chat-message chat-message-local'
    contentClass += ' message-content-local'
  }

  if (props.Message != null) {
    senderName = props.Message.SenderName
    messageContent = props.Message.MessageContent
  }

  return (
    <div className={chatMessageClass}>
      <If condition={!IsLocalMessage()}>
        <h1 className='sender-name'>{senderName}</h1>
      </If>

      <span className={contentClass}>{messageContent}</span>
    </div>
  )
}

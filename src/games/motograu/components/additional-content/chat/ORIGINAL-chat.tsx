import './chat.css'

import React, { useContext, useEffect, useRef, useState } from 'react'
import ProgressBar from '@/core/components/progress-bar'
import If from '@/core/components/conditions/if'
import { GameStatus } from '@/core/providers/enums/game-status'
import { CrashGameContext } from '@/core/providers/games/crash-game.provider'

// import GameButton from './../../../ components/game-button/game-button'
import ChatMessage from './ORIGINAL-chat-message'

type Props = {
  // color: string
}

let _localUserId = '9ajsd09jas'

let _messagesList = [
  {
    SenderId: '89ashd8ha',
    SenderName: 'Name Name 12345',
    MessageContent: 'Message message message',
  },
  {
    SenderId: '89ashd8ha',
    SenderName: 'Name Name 12345',
    MessageContent:
      'Message message message message message message message message message message message message message message',
  },
  {
    SenderId: _localUserId,
    SenderName: 'Name Name 12345',
    MessageContent: 'Message message message',
  },
  {
    SenderId: _localUserId,
    SenderName: 'Name Name 12345',
    MessageContent:
      'Message message message message message message message message message message message message message message',
  },
  {
    SenderId: '89ashd8ha',
    SenderName: 'Name Name 12345',
    MessageContent:
      'Message message message message message message message message message message message message message message',
  },
  {
    SenderId: '89ashd8ha',
    SenderName: 'Name Name 12345',
    MessageContent:
      'Message message message message message message message message message message message message message message',
  },
  {
    SenderId: _localUserId,
    SenderName: 'Name Name 12345',
    MessageContent:
      'Message message message message message message message message message message message message message message',
  },
  {
    SenderId: '89ashd8ha',
    SenderName: 'Name Name 12345',
    MessageContent:
      'Message message message message message message message message message message message message message message',
  },
  {
    SenderId: '89ashd8ha',
    SenderName: 'Name Name 12345',
    MessageContent:
      'Message message message message message message message message message message message message message message',
  },
  {
    SenderId: '89ashd8ha',
    SenderName: 'Name Name 12345',
    MessageContent:
      'Message message message message message message message message message message message message message message',
  },
]

export default function Chat (props: Props) {
  return (
    <div className='chat-container'>
      <h1 className='title'>Chat</h1>

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
      </div>
    </div>
  )
}

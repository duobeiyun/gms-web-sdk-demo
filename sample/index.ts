import RZGMS, { GMSClient, GMSChannel } from 'rz-gms-js-sdk'
import * as md5 from 'blueimp-md5'

const { createInstance, GMSClientEvents, GMSChannelEvents, MessageType } = RZGMS

const $appId = document.querySelector('.app .appId') as HTMLInputElement
const $appSecret = document.querySelector('.app .appSecret') as HTMLInputElement

const userId_a = 'a'
const $login_a = document.querySelector('.user_a_wrap .button-login')
const $logout_a = document.querySelector('.user_a_wrap .button-logout')
const $input_msg_a = document.querySelector('.user_a_wrap .input-message') as HTMLInputElement
const $join_channel_a = document.querySelector('.user_a_wrap .button-join-channel')
const $leave_channel_a = document.querySelector('.user_a_wrap .button-leave-channel')
const $send_msg_a = document.querySelector('.user_a_wrap .button-send-msg')
const $input_p2p_msg_a = document.querySelector('.user_a_wrap .input-p2p-message') as HTMLInputElement
const $send_p2p_msg_a = document.querySelector('.user_a_wrap .button-send-p2p-msg')
const $events_wrap_a = document.querySelector('.user_a_wrap .events-wrap')

const userId_b = 'b'
const $login_b = document.querySelector('.user_b_wrap .button-login')
const $logout_b = document.querySelector('.user_b_wrap .button-logout')
const $join_channel_b = document.querySelector('.user_b_wrap .button-join-channel')
const $leave_channel_b = document.querySelector('.user_b_wrap .button-leave-channel')
const $input_msg_b = document.querySelector('.user_b_wrap .input-message') as HTMLInputElement
const $send_msg_b = document.querySelector('.user_b_wrap .button-send-msg')
const $input_p2p_msg_b = document.querySelector('.user_b_wrap .input-p2p-message') as HTMLInputElement
const $send_p2p_msg_b = document.querySelector('.user_b_wrap .button-send-p2p-msg')
const $events_wrap_b = document.querySelector('.user_b_wrap .events-wrap')

function addEventTip(userTag: 'a' | 'b', content: string) {
  const $p = document.createElement('p')
  $p.innerText = content
  const $wrap = userTag === 'a' ? $events_wrap_a : $events_wrap_b
  $wrap.appendChild($p)
}

let clientA: GMSClient
let clientB: GMSClient
let channelA1: GMSChannel
let channelB1: GMSChannel

export function generToken(appId, timestamp = Date.now(), userId) {
  const query = `appId=${appId}&timestamp=${timestamp}&userId=${userId}` + $appSecret.value

  return md5(query)
}

$login_a.addEventListener('click', async () => {
  clientA = clientA || createInstance($appId.value)
  clientA.on(GMSClientEvents.ConnectionStateChanged, (...args) => {
    console.log('connection state:', ...args)
    addEventTip('a', `connection state: ${args}`)
  })
  clientA.on(GMSClientEvents.MessageFromPeer, (msg, from, opts) => {
    console.log('p2p msg:', msg, from)
    addEventTip('a', `p2p msg: ${JSON.stringify(msg)}, from: ${from}`)
  })
  // @ts-ignore
  window.clientA = clientA

  const timestamp = Date.now()
  const token = generToken($appId.value, timestamp, userId_a)
  const res = JSON.stringify(await clientA.login({
    userId: userId_a,
    token,
    timestamp,
  }).catch(e => e))
  console.log('login', res)
  addEventTip('a', `login result:${res}`)
})

$login_b.addEventListener('click', async () => {
  clientB = clientB || createInstance($appId.value)
  clientB.on(GMSClientEvents.ConnectionStateChanged, (...args) => {
    console.log('connection state:', ...args)
    addEventTip('b', `connection state: ${args}`)
  })
  clientB.on(GMSClientEvents.MessageFromPeer, (msg, from, opts) => {
    console.log('p2p msg:', msg, from)
    addEventTip('b', `p2p msg: ${JSON.stringify(msg)}, from: ${from}`)
  })
  // @ts-ignore
  window.clientB = clientB

  const timestamp = Date.now()
  const token = generToken($appId.value, timestamp, userId_b)
  const res = JSON.stringify(await clientB.login({
    userId: userId_b,
    token,
    timestamp,
  }).catch(e => e))
  console.log('login', res)
  addEventTip('b', `login result:${res}`)
})

$logout_a.addEventListener('click', async () => {
  const res = JSON.stringify(await clientA.logout().catch(e => e))
  console.log('logout', res)
  addEventTip('a', `logout result:${res}`)
})
$logout_b.addEventListener('click', async () => {
  const res = JSON.stringify(await clientB.logout().catch(e => e))
  console.log('logout', res)
  addEventTip('b', `logout result:${res}`)
})

$join_channel_a.addEventListener('click', async () => {
  channelA1 = channelA1 || clientA.createChannel('c1')
  channelA1.on(GMSChannelEvents.MemberJoined, (userId) => {
    console.log('channel member joined ', userId)
    addEventTip('a', `user: ${userId} joined!`)
  })
  channelA1.on(GMSChannelEvents.MemberLeft, (userId) => {
    console.log('channel member left ', userId)
    addEventTip('a', `user: ${userId} left!`)
  })
  channelA1.on(GMSChannelEvents.MemberCountUpdated, (count: number) => {
    console.log('channel member count updated', count)
    addEventTip('a', `channel member count updated, content: ${count}`)
  })
  channelA1.on(GMSChannelEvents.AttributesUpdated, (attributes) => {
    console.log('channel attribute updated ', attributes)
    addEventTip('a', `channel attribute update: ${JSON.stringify(attributes)}`)
  })
  channelA1.on(GMSChannelEvents.ChannelMessage, (message, userId) => {
    console.log('channel message received ', message)
    addEventTip('a', `new message, user: ${userId} content: ${JSON.stringify(message)}`)
  })
  const res = JSON.stringify(await channelA1.join().catch(e => e))
  console.log('join channel', res)
  addEventTip('a', `join channel result:${res}`)
})
$leave_channel_a.addEventListener('click', async () => {
  const res = JSON.stringify(await channelA1.leave().catch(e => e))
  console.log('leave channel', res)
  addEventTip('a', `leave channel result:${res}`)
})
$join_channel_b.addEventListener('click', async () => {
  channelB1 = channelB1 || clientB.createChannel('c1')
  channelB1.on(GMSChannelEvents.MemberJoined, (userId) => {
    console.log('channel member joined ', userId)
    addEventTip('b', `user: ${userId} joined!`)
  })
  channelB1.on(GMSChannelEvents.MemberLeft, (userId) => {
    console.log('channel member left ', userId)
    addEventTip('b', `user: ${userId} left!`)
  })
  channelB1.on(GMSChannelEvents.MemberCountUpdated, (count: number) => {
    console.log('channel member count updated', count)
    addEventTip('b', `channel member count updated, content: ${count}`)
  })
  channelB1.on(GMSChannelEvents.AttributesUpdated, (attributes) => {
    console.log('channel attribute updated ', attributes)
    addEventTip('b', `channel attribute update: ${JSON.stringify(attributes)}`)
  })
  channelB1.on(GMSChannelEvents.ChannelMessage, (message, userId) => {
    console.log('channel message received ', message)
    addEventTip('b', `new message, user: ${userId} content: ${JSON.stringify(message)}`)
  })

  const res = JSON.stringify(await channelB1.join().catch(e => e))
  console.log('join channel', res)
  addEventTip('b', `join channel result:${res}`)
})
$leave_channel_b.addEventListener('click', async () => {
  const res = JSON.stringify(await channelB1.leave().catch(e => e))
  console.log('leave channel', res)
  addEventTip('b', `leave channel result:${res}`)
})

$send_msg_a.addEventListener('click', async () => {
  const content = $input_msg_a.value
  const res = JSON.stringify(await channelA1.sendMessage({
      messageType: MessageType.TEXT,
      text: content,
    }).catch(e => e))
  console.log('send channel message', res)
  addEventTip('a', `send channel message result:${res}`)
})
$send_msg_b.addEventListener('click', async () => {
  const content = $input_msg_b.value
  const res = JSON.stringify(await channelB1.sendMessage({
    messageType: MessageType.TEXT,
    text: content,
  }).catch(e => e))
  console.log('send channel message', res)
  addEventTip('b', `send channel message result:${res}`)
})

$send_p2p_msg_a.addEventListener('click', async () => {
  const content = $input_p2p_msg_a.value
  const res = JSON.stringify(await clientA.sendMessageToPeer({
    messageType: MessageType.TEXT,
    text: content,
  }, userId_b).catch(e => e))
  console.log('send p2p message', res)
  addEventTip('a', `send p2p message result:${res}`)
})
$send_p2p_msg_b.addEventListener('click', async () => {
  const content = $input_p2p_msg_b.value
  const res = JSON.stringify(await clientB.sendMessageToPeer({
    messageType: MessageType.TEXT,
    text: content,
  }, userId_a).catch(e => e))
  console.log('send p2p message', res)
  addEventTip('b', `send p2p message result:${res}`)
})

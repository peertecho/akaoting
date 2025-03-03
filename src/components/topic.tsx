import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

import { onSwarm, createTopic, joinTopic, sendMessage } from '../lib/swarm'

export default function Topic () {
  const [error, setError] = useState<any>()

  const [size, setSize] = useState(0)

  const [newTopic, setNewTopic] = useState('')

  const [inputTopic, setInputTopic] = useState('')
  const [statusJoin, setStatusJoin] = useState('')

  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState < Array < { name: string, msg: string } >> ([])

  useEffect(() => {
    onSwarm({
      onError: (err) => {
        console.error(err)
        setError(err)
      },
      onData: (data) => {
        console.log(data)
        setMessages((items) => [...items, data])
      },
      onUpdate: (size) => setSize(size)
    })
  }, [])

  const onCreateTopic = async () => {
    setNewTopic('creating...')
    const topic = await createTopic()
    setNewTopic(topic)
  }

  const onJoinTopic = async () => {
    if (!inputTopic) {
      alert('Please enter a topic')
      return
    }
    setStatusJoin('Joining...')
    const topic = await joinTopic(inputTopic)
    setStatusJoin(`Joined ${topic}`)
    setInputTopic('')
  }

  const onSendMessage = () => {
    if (!size) {
      alert('Please join a topic')
      return
    }
    if (!inputMessage) {
      alert('Please enter a message')
      return
    }
    sendMessage(inputMessage)
    setInputMessage('')
  }

  return (
    <div className='pt-[1rem]'>
      <pre>{error}</pre>

      <Button onClick={onCreateTopic}>Create topic</Button>
      <p>New topic: {newTopic}</p>

      <hr className='my-[1rem]' />

      <h2>Join topic</h2>
      <div>
        <Textarea value={inputTopic} onChange={(evt) => setInputTopic(evt.currentTarget.value)} />
      </div>
      <Button onClick={onJoinTopic}>Join topic {inputTopic}</Button>
      <div>{statusJoin}</div>

      <hr className='my-[1rem]' />

      <h2>Message</h2>
      <div>
        <Textarea value={inputMessage} onChange={(evt) => setInputMessage(evt.currentTarget.value)} />
      </div>
      <Button onClick={onSendMessage}>Send message</Button>

      <hr className='my-[1rem]' />

      <p>Connections: {size}</p>
      <p>Messages: </p>
      {messages.map((item, index) => (
        <div key={`msg-${index}`} style={{ display: 'flex', gap: 10 }}>
          <div>{item.name}</div>
          <div>{`${item.msg}`}</div>
        </div>
      ))}
    </div>
  )
}

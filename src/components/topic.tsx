import { useState } from "react"
import Hyperswarm from "hyperswarm"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { createSwarm, createTopic, joinTopic, sendMessage } from "../lib/swarm"

export default function Topic () {
  const [error, setError] = useState('')
  
  const [inputName, setInputName] = useState('')
  const [swarm, setSwarm] = useState<Hyperswarm>()
  const [size, setSize] = useState(0)

  const [newTopic, setNewTopic] = useState('')
  
  const [inputTopic, setInputTopic] = useState('')
  const [statusJoin, setStatusJoin] = useState('')
  
  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState<{ name: string, msg: string }[]>([])

  const onStart = async () => {
    if (!inputName) {
      alert('Please enter a unique name per app instance')
      return
    }
    const newSwarm = await createSwarm({
      name: inputName,
      onError: (err: any) => {
        console.error(err)
        setError(err)
      },
      onUpdate: (size: any) => setSize(size),
      onData: (data: any) => {
        console.log(data)
        setMessages((items) => [...items, data])
      },
    })
    setSwarm(newSwarm)
  }

  const onCreateTopic = async () => {
    if (!swarm) {
      alert('Please start the app first')
      return
    }
    setNewTopic('creating...')
    const topic = await createTopic(swarm)
    setNewTopic(topic)
  }

  const onJoinTopic = async () => {
    if (!swarm) {
      alert('Please start the app first')
      return
    }
    if (!inputTopic) {
      alert('Please enter a topic')
      return
    }
    setStatusJoin('Joining...')
    const topic = await joinTopic(swarm, inputTopic)
    setStatusJoin(`Joined ${topic}`)
    setInputTopic('')
  }

  const onSendMessage = () => {
    if (!swarm) {
      alert('Please start the app first')
      return
    }
    if (!size) {
      alert('Please join a topic')
      return
    }
    if (!inputMessage) {
      alert('Please enter a message')
      return
    }
    sendMessage(swarm, inputMessage)
    setInputMessage('')
  }

  return (
    <div className="pt-[1rem]">
      <pre>{error}</pre>

      <h2>Your name</h2>
      <div className="flex gap-2">
        <Input value={inputName} onChange={(evt) => setInputName(evt.currentTarget.value)} />
        <Button onClick={onStart}>Start</Button>
      </div>
      <p className="text-md">Hi: {swarm ? inputName : ''}</p>

      <hr className="my-[1rem]" />

      <Button onClick={onCreateTopic}>Create topic</Button>
      <p>New topic: {newTopic}</p>
      
      <hr className="my-[1rem]" />

      <h2>Join topic</h2>
      <div>
        <Textarea value={inputTopic} onChange={(evt) => setInputTopic(evt.currentTarget.value)} />
      </div>
      <Button onClick={onJoinTopic}>Join topic {inputTopic}</Button>
      <div>{statusJoin}</div>

      <hr className="my-[1rem]" />

      <h2>Message</h2>
      <div>
        <Textarea value={inputMessage} onChange={(evt) => setInputMessage(evt.currentTarget.value)} />
      </div>
      <Button onClick={onSendMessage}>Send message</Button>
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

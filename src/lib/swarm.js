/** @typedef {import('pear-interface')} */ 

import Hyperswarm from 'hyperswarm'
import crypto from 'hypercore-crypto'
import b4a from 'b4a'

const { updates, reload, teardown } = Pear

updates(() => reload())

export async function createSwarm ({ name, onError, onData, onUpdate }) {
  const seed = crypto.hash(Buffer.from(name, 'utf-8'))
  const swarm = new Hyperswarm({ seed })
  teardown(() => swarm.destroy())

  swarm.on('connection', (peer) => {
    const name = b4a.toString(peer.remotePublicKey, 'hex').substr(0, 6)
    peer.on('error', (err) => onError({ peer, name, err }))
    peer.on('data', (msg) => onData({ peer, name, msg }))
  })
  swarm.on('update', () => onUpdate(swarm.connections.size))

  return swarm
}

export async function createTopic(swarm) {
  const topicBuffer = crypto.randomBytes(32)
  return joinSwarm(swarm, topicBuffer)
}

export async function joinTopic (swarm, topic) {
  const topicBuffer = b4a.from(topic, 'hex')
  return joinSwarm(swarm, topicBuffer)
}

async function joinSwarm (swarm, topicBuffer) {
  const discovery = swarm.join(topicBuffer, { client: true, server: true })
  await discovery.flushed()

  const topic = b4a.toString(topicBuffer, 'hex')
  return topic
}

export function sendMessage (swarm, msg) {
  const peers = [...swarm.connections]
  for (const peer of peers) peer.write(msg)
}

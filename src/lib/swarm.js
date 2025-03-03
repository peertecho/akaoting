import Hyperswarm from 'hyperswarm'
import crypto from 'hypercore-crypto'
import b4a from 'b4a'

/** @type {import('pear-interface').Pear} */
const { updates, reload, teardown } = global.Pear

updates(() => reload())

const swarm = new Hyperswarm()
teardown(() => swarm.destroy())

/**
 @param {{
    onError: (err: { peer: any, name: string, err: Error }) => void
    onData: (data: { peer: any, name: string, msg: string }) => void
    onUpdate: (size: number) => void
  }}
*/
export async function onSwarm ({ onError, onData, onUpdate }) {
  swarm.on('connection', (peer) => {
    const name = b4a.toString(peer.remotePublicKey, 'hex').substr(0, 6)
    peer.on('error', (err) => onError({ peer, name, err }))
    peer.on('data', (msg) => onData({ peer, name, msg }))
  })
  swarm.on('update', () => onUpdate(swarm.connections.size))
}

export async function createTopic () {
  const topicBuffer = crypto.randomBytes(32)
  return joinSwarm(topicBuffer)
}

/**
  @param {string} topic
 */
export async function joinTopic (topic) {
  const topicBuffer = b4a.from(topic, 'hex')
  return joinSwarm(topicBuffer)
}

/**
  @param {Buffer} topic
 */
async function joinSwarm (topicBuffer) {
  const discovery = swarm.join(topicBuffer, { client: true, server: true })
  await discovery.flushed()

  const topic = b4a.toString(topicBuffer, 'hex')
  return topic
}

/**
  @param {string} msg
 */
export function sendMessage (msg) {
  const peers = [...swarm.connections]
  for (const peer of peers) peer.write(msg)
}

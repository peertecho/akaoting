import Hyperswarm from 'hyperswarm'
import crypto from 'hypercore-crypto'
import b4a from 'b4a'

/** @type {import('pear-interface').Pear} */
const { updates, reload, teardown } = global.Pear

updates(() => reload())

/**
 @param {{
    name: string
    onError: (err: { peer: any, name: string, err: Error }) => void
    onData: (data: { peer: any, name: string, msg: string }) => void
    onUpdate: (size: number) => void
  }}
*/
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

/** @param {Hyperswarm} swarm */
export async function createTopic (swarm) {
  const topicBuffer = crypto.randomBytes(32)
  return joinSwarm(swarm, topicBuffer)
}

/**
  @param {Hyperswarm} swarm
  @param {string} topic
 */
export async function joinTopic (swarm, topic) {
  const topicBuffer = b4a.from(topic, 'hex')
  return joinSwarm(swarm, topicBuffer)
}

/**
  @param {Hyperswarm} swarm
  @param {Buffer} topic
 */
async function joinSwarm (swarm, topicBuffer) {
  const discovery = swarm.join(topicBuffer, { client: true, server: true })
  await discovery.flushed()

  const topic = b4a.toString(topicBuffer, 'hex')
  return topic
}

/**
  @param {Hyperswarm} swarm
  @param {string} msg
 */
export function sendMessage (swarm, msg) {
  const peers = [...swarm.connections]
  for (const peer of peers) peer.write(msg)
}

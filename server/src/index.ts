import RedisBroker from './redis-broker';
import WebsocketBroadcaster from './wss-broadcaster';

const redisBroker = RedisBroker.getInstance('*'); // Subscribe to all channels that match the pattern
redisBroker.onMessage = onReceiveRedisMessage;
redisBroker.start();

const broadcaster = WebsocketBroadcaster.getInstance();
broadcaster.start();

function onReceiveRedisMessage(message: any, channel: string) {
  console.log(`Received message on channel "${channel}":`, message);

  try {
    // Send the message to the websocket clients
    const parsedMessage = JSON.parse(message);
    broadcaster.send({ type: 'state-change', data: parsedMessage });
  } catch (error) {
    console.error(`Error parsing message on channel "${channel}":`, error);
  }
}

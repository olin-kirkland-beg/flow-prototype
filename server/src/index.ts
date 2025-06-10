import RedisBroker from './redis-broker';
import WebsocketBroadcaster from './wss-broadcaster';

const redisBroker = RedisBroker.getInstance('automation:info'); // Subscribe to all channels that match the pattern
redisBroker.onMessage = onReceiveRedisMessage;
redisBroker.start();

const broadcaster = WebsocketBroadcaster.getInstance();
broadcaster.start();

function onReceiveRedisMessage(message: any, channel: string) {
    console.log(`Received message on channel "${channel}":`, message);

    try {
        // Send the message to the websocket clients
        const parsedMessage = JSON.parse(message);
        // Example message format:
        // {"preState":"TrennwandUnten","curState":"TrennwandOben","status":"active","transGuard":false,"actorId":"UserActor_Turnhalle","stateMachineId":"Turnhalle"}
        const newState = parsedMessage.curState;
        const stateMachineId = parsedMessage.stateMachineId;
        broadcaster.send({
            type: 'state-change',
            data: {
                stateMachineId: stateMachineId,
                newState: newState
            }
        });
    } catch (error) {
        console.error(`Error parsing message on channel "${channel}":`, error);
    }
}

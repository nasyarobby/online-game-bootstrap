import GameServer from "./GameServer.js";
import {v4 as uuidv4} from "uuid";

/**
 * @this {WebSocket & {id: string}} 
 * @param {GameServer} gameServer
 */
export function handleNewConnection(gameServer) {
    this.id = uuidv4()
    gameServer.newPlayer(this.id)
    console.log(gameServer)
}

/**
 * @type {import("./@types/index.js").EventMessageHandler}
 */
export function handleNewMessage(game, message) {
    const _message = message.toString();
    try {
        const _data = JSON.parse(_message);
        switch(_data.e) {
            case "CHNAME":
                game.updatePlayer(this.id, _data.playerName)
                break;
        }
    }
    catch(err) {
        console.log(err)
        this.send('Err: Invalid payload.')
    }
}
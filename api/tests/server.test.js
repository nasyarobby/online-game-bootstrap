import tap from "tap";
import GameServer from "../GameServer.js";
/**
 * @type {{send: {data: any}[]}}
 */
const calls = {
    send: []
}

/**
 * 
 * @param {GameServer} server 
 * @param {string} message
 */
function handleMessage(server, message) {
    return server
}


tap.test("Test Game Server", (t) => {
    const game = new GameServer();
    // t.plan(11);

    game.newPlayer('id1', null)
    t.equal(game.players.length, 1)

    const playerTwo = game.newPlayer('id2', 'player-name')

    if(!playerTwo) return;

    t.equal(game.players.length, 2)
   
    const shouldBeNull  = game.newPlayer('id2', 'player-hello')
    t.equal(game.players.length, 2)
    t.equal(shouldBeNull, null)

    game.updatePlayer('id1', 'player-one');
    t.equal(game.getPlayerById('id1')?.name, 'player-one')
    
    let room;
    let playerOne = game.getPlayerById('id1');
    if(!playerOne) throw new Error("Player one is null")

    room = game.createRoom([playerOne])
    console.log(room.secret)
    t.not(room?.secret, undefined)
    t.not(playerOne?.room, null)

    room?.addPlayer(playerTwo);
    t.equal(room?.getPlayers().length, 2)
    t.not(playerTwo?.room, null)

    room?.addPlayer(playerTwo);
    t.equal(room?.getPlayers().length, 2)

    t.equal(room?.getOwner()?.id, 'id1')
    
    room?.updateOwner(playerTwo)
    t.equal(room?.getOwner()?.id, 'id2')

    room?.removePlayer(playerTwo)
    t.equal(room?.getOwner()?.id, 'id1')
    t.equal(room?.getPlayers().length, 1)

    playerOne?.exitCurrentRoom();

    t.equal(room?.getOwner()?.id, undefined)
    t.equal(room?.getPlayers().length, 0)

    room?.addPlayer([playerOne, playerTwo])
    
    playerTwo.exitCurrentRoom();

    room?.removePlayer(playerTwo)
    room?.updateOwner(playerTwo)
    t.equal(room?.getOwner()?.id, playerOne.id)

    t.test("Test updating non-existing player return null", (t2) => {
        t2.equal(game.updatePlayer('test', 'test'), null)
        t2.end();
    })

    t.equal(game.getRoomBySecret(room.secret)?.secret, room.secret)

    t.equal(room.isStarted(), false)
    room.start()
    t.equal(room.isStarted(), true )
    
    const playerThree = game.newPlayer('id3', 'Player3')
    if(!playerThree) return;

    t.throws(() => room.addPlayer(playerThree))
    room.stop()
    t.equal(room.isStarted(), false )
    
    t.end()
})
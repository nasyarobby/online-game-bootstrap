import randomstring from "randomstring"
class Room {
  /**
   * @param {Player[]} players
   */
  constructor(players) {
    this.secret = this.generateSecret()
    /**
     * @type {Player[]}
     * @private
     */
    this.players = [];
    /**
     * @private
     */
    this.started = false;
    this.addPlayer(players);
  }

  start() {
    this.started = true;
  }

  stop() {
    this.started = false;
  }

  isStarted() {
    return this.started;
  }

  generateSecret() {
    this.secret = randomstring.generate({
      length: 5,
      capitalization: "uppercase",
      readable: true,
      charset: ['alphanumeric']
    });

    return this.secret;
  }

  /**
   *
   * @returns {Player | undefined}
   */
  getOwner() {
    return this.players[0];
  }

  updateOwner(player) {
    const playerIndex = this.getPlayers().findIndex((p) => p.id === player.id);

    if (playerIndex < 0) return false;

    const prevOwner = this.getOwner();
    this.players[0] = player;
    if (prevOwner) {
      this.players[playerIndex] = prevOwner;
    }

    return this;
  }

  /**
   *
   * @param {Player | Player[]} players
   */
  addPlayer(players) {
    /**
     *
     * @param {Player} player
     * @returns
     */

    if(this.isStarted()) {
      throw new Error('Cannot add player. Game already started.')
    }

    const _addPlayer = (player) => {
      player.room = this;
      if (this.players.find((p) => p.id === player.id)) {
        return false;
      }
      this.players.push(player);
      return true;
    };

    if (Array.isArray(players)) {
      1;
      players.forEach((player) => {
        _addPlayer(player);
      });

      return this;
    }

    _addPlayer(players);
    return this;
  }

  /**
   *
   * @param {Player} player
   */
  removePlayer(player) {
    if (this.secret === player.room?.secret) {
      this.players = this.players.filter((p) => p.id !== player.id);
      player.room = null;
    }
    return this;
  }

  getPlayers() {
    return this.players;
  }
}

/**
 * @param {string |null} name
 * @param {string} id
 */
class Player {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    /**
     * @type {Room | null}
     */
    this.room = null;
  }

  exitCurrentRoom() {
    this.room?.removePlayer(this);
    return this;
  }
}

class GameServer {
  constructor() {
    /*** @type {Room[]} */
    this.rooms = [];
    /** @type {Player[]} */
    this.players = [];
  }
  /**
   *
   * @param {string} id
   * @param {string | null} name
   */
  newPlayer(id, name = null) {
    const exists = this.players.find((p) => p.id === id);
    if (exists) {
      return null;
    }
    const player = new Player(name, id);
    this.players.push(player);
    return player;
  }
  /**
   * @param {string} id
   * @param {string} name
   */
  updatePlayer(id, name) {
    const player = this.players.find((p) => p.id === id);
    if (!player) return null;
    player.name = name;
    return player;
  }
  /**
   * @param {string} id
   * @returns {Player | undefined}
   */
  getPlayerById(id) {
    return this.players.find((p) => p.id === id);
  }
  /**
   * @param {Player[]} players
   */
  createRoom(players) {
    const newRoom = new Room(players);

    this.rooms.push(newRoom);
    return newRoom;
  }

  getRoomBySecret(secret) {
    return this.rooms.find(r => r.secret === secret)
  }
}

export default GameServer;

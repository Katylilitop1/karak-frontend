import { createSlice, current } from '@reduxjs/toolkit';

const initialState = {
  id: '',
  playerNames_local: [],
  gamecreator: false,
  playerHeroeNames: [],
  game: {},
}

export const gamesSlice = createSlice({
  name: 'games',

  initialState,
  reducers: {
    setId: (state, action) => {
      state.id = action.payload;
      console.log('REDUX Exit setID, state.id: ', state.id);
    },

    addPlayerNames_local: (state, action) => {
      // receive [ <player 1 name>, <player 2 name> ...], only local players
      // due to implementation and go back to addplayer 
      // it is better to add the players
      state.playerNames_local.push(...action.payload);
      // console.log('Exit AddPlayerNames, state.playerName: ', state.playerNames_local)
      console.log('REDUX Exit AddPlayerNames_local, state.playerName_local: ', current(state.playerNames_local))
    },

    setCreator: (state) => {
      state.gamecreator = true
      console.log('REDUX setCreator is called')
    },

    setPlayerHeroeNames: (state, action) => {
      // action.payload is an array of {username:..., heroe:...}
      state.playerHeroeNames = action.payload;
      console.log('REDUX Exit setPlayerHeroeNames, state.playerHeroeNames: ', state.playerHeroeNames);
    },

    setGame: (state, action) => {
      // receive in action.payload the object game : { _id: ..., gameStarted: ..., tiles: [...], players: [...]}
      state.game = action.payload
    },




    //////////// mise à jour des tuiles
    removeTileMeet: (state, action) => { 
      //retirer le meeting d'une tuile à un index donné et le passer à null
      //action.payload = index
      state.game.tiles[action.payload].meeting = null;
    },
    updateRotation: (state, action) => { 
      //modifier la rotation (0, 1, 2 ou 3) et shifter la data d'une tuile à un index donné
      // action.payload = index
      console.log( state.game.tiles[action.payload] )
      state.game.tiles[action.payload].rotation += 1;
      let data = state.game.tiles[action.payload].data
      data = data.unshift(data.pop());
    },
    flagPlayed: (state, action) => { 
      //passer le isPlayed de null à 'x;y' à une tuile à un index donné
      //action.payload = {index, id}
      state.game.tiles[action.payload.index].isPlayed = action.payload.id
    },




    //////////// mise à jour des players
    looseLife: (state, action) => { 
      if(state.game.players[state.game.players.findIndex(e => e.type === action.payload)].life > 0){
        state.game.players[state.game.players.findIndex(e => e.type === action.payload)].life -= 1;
      }
    },
    restoreLife: (state, action) => { 
        state.game.players[state.game.players.findIndex(e => e.type === action.payload)].life = 5;
    },
    useKey: (state, action) => { 
        state.game.players[state.game.players.findIndex(e => e.type === action.payload)].key = null;
    },
    updateInventory: (state, action) => {
        console.log(action.payload)
        const playerIndex = state.game.players[state.game.players.findIndex(e => e.type === action.payload.playerType)];
        
        if(action.payload.loot === 'heal_portal' || action.payload.loot === 'magic_shot'){    
          const emptySlotIndex = playerIndex.scroll.findIndex(scrolls => scrolls === null);
          if (emptySlotIndex !== -1) {
            playerIndex.scroll[emptySlotIndex] = action.payload.loot;
          } else if (playerIndex.scroll.every(scroll => scroll === 'heal_portal') && action.payload.loot === 'magic_shot'){
            playerIndex.scroll[0] = action.payload.loot;
          } else if (playerIndex.scroll.every(scroll => scroll === 'magic_shot') && action.payload.loot === 'heal_portal'){
            playerIndex.scroll[2] = action.payload.loot;
          } 
        } else if(action.payload.loot === 'key'){
            if (playerIndex.key === null) {
            playerIndex.key = action.payload.loot;
            }
        } else if(action.payload.loot === 'open_chest'){
            playerIndex.treasure += 1
        } else if(action.payload.loot === 'dragon_open_chest'){
            playerIndex.treasure += 1.5
        } else{
            const emptySlotIndex = playerIndex.weapons.findIndex(weapons => weapons === null);
              if (emptySlotIndex !== -1) {
              playerIndex.weapons[emptySlotIndex] = action.payload.loot;
            } else if(playerIndex.weapons[0] === 'daggers' && (action.payload.loot === 'sword' || action.payload.loot === 'axe')){
                playerIndex.weapons[0] = action.payload.loot;
            } else if(playerIndex.weapons[1] === 'daggers' && (action.payload.loot === 'sword' || action.payload.loot === 'axe')){
              playerIndex.weapons[1] = action.payload.loot;
            } else if(playerIndex.weapons[0] === 'sword' && action.payload.loot === 'axe'){
              playerIndex.weapons[0] = action.payload.loot;
            } else if(playerIndex.weapons[1] === 'sword' && action.payload.loot === 'axe'){
              playerIndex.weapons[1] = action.payload.loot;
            }
        }
    },
    setTurn: (state, action) => { 
      //passer à true le joueur actif et passer à false les autres => state.game.player.turn
      //payload = index du joueur actif
      state.game.players.forEach(e => {
        e.turn = false
      });
      state.game.players[action.payload].turn = true;
    },
    setCoords: (state, action) => { 
      //modifier les coordonnées du joueur actif => state.game.player.coords & preCoords
      //payload = {index du joueur actif, coords}
      state.game.players[action.payload.playerActif].prevCoords = state.game.players[action.payload.playerActif].coords;
      state.game.players[action.payload.playerActif].coords = action.payload.id;
      console.log(current(state.game.players));
    },
  },
});

export const { setId, addPlayerNames_local, setCreator, setPlayerHeroeNames, setGame,        
  removeTileMeet, updateRotation, flagPlayed,
  looseLife, restoreLife, useKey, updateInventory, setTurn, setCoords } = gamesSlice.actions;
export default gamesSlice.reducer;

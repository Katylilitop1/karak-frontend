import Tile from './tile';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faRotate } from '@fortawesome/free-solid-svg-icons';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { pushInfo } from '../reducers/header';
import { pushMeet, removeMeet, updateMeet } from '../reducers/meeting';
import { setTurn, setCoords, restoreLife } from '../reducers/games';


function Map() {

  const dispatch = useDispatch();

  //data tuiles
  let dataPioche = useSelector((state) => state.games.game.tiles) // lecture de la DB via redux
  const [dataPiocheTemp, setDataPiocheTemp] = useState(dataPioche)
  let playedCoordsTemp = [];
  dataPiocheTemp.filter( e => { if(e.isPlayed !== null) playedCoordsTemp.push(e.isPlayed)  } )
  const [playedCoords, setPlayedCoords ] = useState(playedCoordsTemp);

  //states for tiles rotation
  const [isOpen, setIsOpen] = useState(false); 
  const [rotation, setRotation] = useState(0);
  const [isRotationValid, setIsRotationValid] = useState(false);

  //data players
  let player = useSelector((state) => state.games.game.players) // lecture de la DB via redux
  const playerNames_local = useSelector((state) => state.games.playerNames_local) // lecture de la DB via redux
  const playerActif = useSelector((state) => state.games.game.players.findIndex( e => e.turn ))
  const [mooves, setMooves] = useState(0);
  const [nbTours, setNbTours] = useState(1);

  //data meetings
  let meetingReducer = useSelector((state) => state.meeting.value.find(e => e.coords === player[playerActif].coords))
  let isMeetingResolved = useSelector((state) => state.meeting.value.find(e => e.coords === player[playerActif].coords)?.isResolved)
  let isMeetingSkiped = useSelector((state) => state.meeting.value.find(e => e.coords === player[playerActif].coords)?.isSkiped)
  let meeting = dataPiocheTemp[playedCoords.findIndex(coord => coord === player[playerActif].coords)].meeting

  //powers identification
  const isArgentus = (player[playerActif].type === 'Argentus');
  const isAderyn = (player[playerActif].type === 'Aderyn');
  
  if(mooves >= 4){
    //meeting
    if(meeting?.mob){
      dispatch(pushMeet(dataPiocheTemp[playedCoords.findIndex(coord => coord === player[playerActif].coords) +1].meeting))
    }else{
      if(playerActif < player.length -1){
        dispatch(setTurn(playerActif +1))
        setMooves(0); 
      }else{
        dispatch(setTurn(0))
        setNbTours(nbTours +1) 
        setMooves(0); 
      }
    }
    
    if(isMeetingSkiped && mooves === 4){
      if(playerActif < player.length -1){
        dispatch(setTurn(playerActif +1))
        setMooves(0); 
      }else{
        dispatch(setTurn(0))
        setNbTours(nbTours +1) 
        setMooves(0); 
      }
    }
  }

  // pushInfo in store for Header
  let msg = 'Cliques pour te déplacer';
  if(isOpen) msg = 'Tournes ta tuile'; 
  if(!isOpen && meeting && (!isAderyn || (isAderyn && mooves === 4))) msg = 'Combats en jettant les dés';
  if(!isOpen && meeting?.mob === 'closed_chest' && !isAderyn) msg = 'Ouvres le coffre ou continues d’avancer..';
  if(!isOpen && meeting && (isAderyn && mooves < 4)) msg = 'Combats ou continues d’avancer..';
  if(!isOpen && meeting?.mob === 'closed_chest' && isAderyn) msg = 'Ouvres le coffre ou continues d’avancer..';
  dispatch( pushInfo( {username: player[playerActif].username, type:player[playerActif].type, nbTours, mooves, msg} ) );

  useEffect(() => {  
    // dernière id, carte jouée par le joueur
    let playersTemp = JSON.parse(JSON.stringify(player))
    const previousCoords = playersTemp[playerActif].prevCoords.split(';');

    // avant-dernière id, carte jouée par le joueur
    const lastTileID = player[playerActif].coords; 
    const coords = lastTileID.split(';');
    const lastTileData = dataPiocheTemp[playedCoords.findIndex(coord => coord === player[playerActif].coords)].tile.data
    
    // logique rotation
    if( Number(coords[0] === previousCoords[0] && coords[1] < previousCoords[1]) ) setIsRotationValid(lastTileData[2] === 1)//gauche
    else if( Number(coords[0] < previousCoords[0] && coords[1] === previousCoords[1]) ) setIsRotationValid(lastTileData[3] === 1)//haut
    else if( Number(coords[0] === previousCoords[0] && coords[1] > previousCoords[1]) ) setIsRotationValid(lastTileData[0] === 1)//droite
    else if( Number(coords[0] > previousCoords[0] && coords[1] === previousCoords[1]) ) setIsRotationValid(lastTileData[1] === 1)//bas
  }, [playedCoords])

  useEffect(()=>{
    if(isMeetingResolved ){ //|| isMeetingSkiped
        dispatch(removeMeet(meetingReducer))
        let pioche = JSON.parse(JSON.stringify(dataPiocheTemp));
        let i = playedCoords.findIndex(coord => coord === player[playerActif].coords);
        pioche[i].meeting = null
        setDataPiocheTemp(pioche);
        setMooves(0)

        if(playerActif < player.length -1){
          dispatch(setTurn(playerActif +1))
          dispatch(updateMeet({...meetingReducer, isSkiped: false}))
        }else{
          dispatch(setTurn(0))
          setNbTours(nbTours +1)
          dispatch(updateMeet({...meetingReducer, isSkiped: false}))
        }

    }else if(isMeetingSkiped && meeting.mob !== 'closed_chest'){
        const id = player[playerActif].prevCoords
        dispatch(setCoords({playerActif, id}))
        setMooves(0)
        dispatch(updateMeet({...meetingReducer, isSkiped: false}))

        if(playerActif < player.length -1){
          dispatch(setTurn(playerActif +1))
        }else{
          dispatch(setTurn(0))
          setNbTours(nbTours +1)
        }

    }else if(isMeetingSkiped && meeting.mob === 'closed_chest'){
        dispatch(updateMeet({...meetingReducer, isSkiped: false}))
        setMooves(0)

        if(playerActif < player.length -1){
          dispatch(setTurn(playerActif +1))
        }else{
          dispatch(setTurn(0))
          setNbTours(nbTours +1)
        }
    }
  },[isMeetingResolved, isMeetingSkiped, player, playerActif])
  
  let modalValid;
  if(isRotationValid)
  modalValid = (
    <FontAwesomeIcon
      style={{width: '20px', height: '20px', padding: '5px', backgroundColor: 'white', opacity:.6, borderRadius: '50%', color : '#324E01', cursor: 'pointer'}}
      onClick={() => {
        setIsOpen(false);
        setRotation(0);
        setMooves(mooves +1)

        // cf. onTileClick
        if(!isMeetingSkiped || !isMeetingResolved){
          dispatch(pushMeet({meeting: dataPiocheTemp[playedCoords.findIndex(coord => coord === player[playerActif].coords)].meeting, coords: player[playerActif].coords, isResolved: isMeetingResolved, isSkiped: isMeetingSkiped}))
        }
      }} 
      icon={faCheck} />
  )
  
  let modalContent;
  if(isOpen){
    let placement = playedCoords[playedCoords.length-1].split(';')
    let top = Number(placement[0])*100
    let left = Number(placement[1])*100
    modalContent = (
      <div style={{position: 'absolute', padding: '2px', marginTop: `${top}px`, marginLeft: `${left}px`, width: '100px', height: '100px', display: 'flex', justifyContent: 'space-between', zIndex: 10}}>
        <div>
          <FontAwesomeIcon
            style={{width: '20px', height: '20px', padding: '5px', backgroundColor: 'white', opacity:.6, borderRadius: '50%', color : '#BC6900', cursor: 'pointer'}}
            onClick={() => {
              setRotation(rotation + 1);
              let pioche = JSON.parse(JSON.stringify(dataPiocheTemp))
              let i = playedCoords.length-1;
              pioche[i].rotation += 1;
              pioche[i].tile.data = shiftArray(pioche[i].tile.data);
              setDataPiocheTemp(pioche);
              setPlayedCoords([...playedCoords]);
            }} 
            icon={faRotate} />
        </div>
        <div>
          {modalValid}
        </div>
      </div>
    )
  }

  const shiftArray = (arr) => {
    let arrTemp = [...arr]
    arrTemp.unshift(arrTemp.pop())
    return arrTemp
  }
  
  const onTileClick = (id) => {
    //fonctionnalité dégradée life fountain
    if(playedCoords.includes(id) && dataPiocheTemp[playedCoords.findIndex(coord => coord === id)].tile.specificity === 'fountain'){
      dispatch(restoreLife(player[playerActif].type))
    }

    //meeting
    if(playedCoords.includes(id)) {
      dispatch(pushMeet(dataPiocheTemp[playedCoords.findIndex(coord => coord === player[playerActif].coords) +1].meeting))
    }
    
    if(isAderyn && playedCoords.includes(id) && dataPiocheTemp[playedCoords.findIndex(coord => coord === player[playerActif].coords && playedCoords.includes(id)) +1].meeting) {
      setMooves(mooves +1)
    }else if(playedCoords.includes(id)){
      setMooves(mooves +1)
    }
    
    //ajouter les coordonnées de la dernière carte jouée à l'ensemble des cartes jouées et ouvrir la modal de rotation
    if(!playedCoords.includes(id)) {
      setPlayedCoords([...playedCoords, id]);
      let pioche = JSON.parse(JSON.stringify(dataPiocheTemp))
      let i = playedCoords.length;
      pioche[i].isPlayed = id;
      setDataPiocheTemp(pioche);
      setIsOpen(true)
    }

    //attribuer les coordonnées de la dernière carte jouée par chaque joueur
    dispatch(setCoords({playerActif, id}))
  };

  const carte = []

  for (let i=0; i<41; i++){
    
    for (let j=0; j<41; j++){
      
      const dataEmpty = {type: 'empty', tile:{img: '/tiles/empty.png', data: [null,null,null,null]}}
      let card = dataEmpty
      let isPlayed = false
      let isPlayable = false
      
      for(let k=0; k<playedCoords.length; k++){
        if(playedCoords[k] === `${i};${j}`) {isPlayed = true}
        if(playedCoords[k] === `${i};${j}`) {
          card = dataPiocheTemp[k];
        }
        
        const portals = playedCoords.map((e,i)=> {return {isPortal: (dataPiocheTemp[i].tile.specificity === 'portal'), portalCoords: e }})
        const lastTile = dataPiocheTemp[playedCoords.findIndex(coord => coord === player[playerActif].coords)]
        const lastTileData = dataPiocheTemp[playedCoords.findIndex(coord => coord === player[playerActif].coords)].tile.data
        const lastTileID = player[playerActif].coords;
        const coords = lastTileID.split(';');
        const x = Number(coords[0])
        const y = Number(coords[1])
                
        if(!isOpen && playerNames_local.includes(player[playerActif].username)){
          if(!meeting || (meeting.mob === 'closed_chest' && mooves < 4)|| (isAderyn && mooves < 4)){
            if(playedCoords.length < dataPiocheTemp.length){
              isPlayable = (
                ((lastTileData[0] && ((playedCoords.includes(`${x};${y -1}`) && dataPiocheTemp[playedCoords.findIndex(coord => coord === `${x};${y -1}`)].tile.data[2]) || !playedCoords.includes(`${x};${y -1}`) ) || (isArgentus && playedCoords.includes(`${x};${y-1}`)) ) && x === i && y-1 === j) ||
                ((lastTileData[1] && ((playedCoords.includes(`${x -1};${y}`) && dataPiocheTemp[playedCoords.findIndex(coord => coord === `${x -1};${y}`)].tile.data[3]) || !playedCoords.includes(`${x -1};${y}`) ) || (isArgentus && playedCoords.includes(`${x-1};${y}`)) ) && x-1 === i && y === j) ||
                ((lastTileData[2] && ((playedCoords.includes(`${x};${y +1}`) && dataPiocheTemp[playedCoords.findIndex(coord => coord === `${x};${y +1}`)].tile.data[0]) || !playedCoords.includes(`${x};${y +1}`) ) || (isArgentus && playedCoords.includes(`${x};${y+1}`)) ) && x === i && y+1 === j) ||
                ((lastTileData[3] && ((playedCoords.includes(`${x +1};${y}`) && dataPiocheTemp[playedCoords.findIndex(coord => coord === `${x +1};${y}`)].tile.data[1]) || !playedCoords.includes(`${x +1};${y}`) ) || (isArgentus && playedCoords.includes(`${x+1};${y}`)) ) && x+1 === i && y === j) || 
                (lastTile.tile.specificity === 'portal' && portals.find(e => e.isPortal && e.portalCoords === `${i};${j}` && e.portalCoords !== `${x};${y}`))

              )            
            }else{   //après avoir joué toutes les tuiles
              isPlayable = ( 
                ((lastTileData[0] && (playedCoords.includes(`${x};${y -1}`) && dataPiocheTemp[playedCoords.findIndex(coord => coord === `${x};${y -1}`)].tile.data[2]) || (isArgentus && playedCoords.includes(`${x};${y-1}`)) ) && x === i && y-1 === j) ||
                ((lastTileData[1] && (playedCoords.includes(`${x -1};${y}`) && dataPiocheTemp[playedCoords.findIndex(coord => coord === `${x -1};${y}`)].tile.data[3]) || (isArgentus && playedCoords.includes(`${x-1};${y}`)) ) && x-1 === i && y === j) ||
                ((lastTileData[2] && (playedCoords.includes(`${x};${y +1}`) && dataPiocheTemp[playedCoords.findIndex(coord => coord === `${x};${y +1}`)].tile.data[0]) || (isArgentus && playedCoords.includes(`${x};${y+1}`)) ) && x === i && y+1 === j) ||
                ((lastTileData[3] && (playedCoords.includes(`${x +1};${y}`) && dataPiocheTemp[playedCoords.findIndex(coord => coord === `${x +1};${y}`)].tile.data[1]) || (isArgentus && playedCoords.includes(`${x+1};${y}`)) ) && x+1 === i && y === j) || 
                (lastTile.tile.specificity === 'portail' && portals.find(e => e.isPortal && e.portalCoords === `${i};${j}` && e.portalCoords !== `${x};${y}`))
              )  
            }
          }
        }       

      }
      
      carte.push(
        <Tile 
          key={`${i};${j}`} 
          id={`${i};${j}`} 
          onTileClick={(id) => onTileClick(id)} 
          isPlayable={isPlayable} 
          card={card}
          player={player}
          mob={meeting?.mob}
          isPlayed={isPlayed}
        />
      )
    }
  }  

  const map = {display: 'flex', width: `${41*100}px`, height: `${41*100}px`, flexDirection: 'row', flexWrap: 'wrap'}

  return (
    <TransformWrapper
      initialScale={.8}
      minScale={0.3}
      maxScale={1.5}
      limitToBounds={false}
      disablePadding={true}
      centerOnInit={false}
      initialPositionX={-2100 + 640}
      initialPositionY={-2100 + 720}
    >
      <TransformComponent>
        <main style={map}>
          {carte}
          {modalContent}
        </main>
      </TransformComponent>
    </TransformWrapper>
  );
}

export default Map;
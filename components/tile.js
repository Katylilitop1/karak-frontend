function Tile(props) {

  let mob;
  if(props.card.meeting){
    mob = (
      <img
      style={{position: 'absolute', margin: '30px',width: '42px'}}
      src={`/mobs/${props.card.meeting.mob}.png`}
      />
    )
  }

  let debug = false; 
  let debugInfo;
  if(debug) {
    if(props.card.meeting){
      console.log(props.id, props.card.meeting.mob)
    }

    debugInfo = (
      <div style={{position: 'absolute', width: '100px', height: '100px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
      <div style={{width: '100px'}}>&nbsp;&nbsp;{props.card.data[0]}</div>
      <div style={{width: '100px', justifyContent: 'space-between'}}>
        <p style={{textAlign: 'center'}}>{props.card.data[1]}</p><p style={{textAlign: 'center'}}>{props.id}</p><p style={{textAlign: 'center'}}>{props.card.data[3]}</p>
      </div>
      <div style={{width: '100px', textAlign: 'end'}}>{props.card.data[2]}&nbsp;&nbsp;</div>
      </div>
    )
  }

  let playable = (<div style={{position: 'absolute', zIndex: '2', width: '100px', height: '100px'}}></div>)
  if(props.isPlayable) playable = (<div style={{position: 'absolute', zIndex: '2', width: '100px', height: '100px', backgroundColor: 'green', opacity: '.2'}}></div>)
  
  let rotationStyle = `rotate(${props.card.rotation * 90}deg)`
  
  let player = [];
  for(let i=0; i<props.player.length; i++){
    if(props.player[i].coords === props.id) {
      player.push(
      <img
      key={i}
      src={`/pions/pion-${props.player[i].type}.png`}
      />
      )}
  }

  return (
    <div 
    style={{position: 'relative', width: '100px', height: '100px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} 
    onClick={() => props.isPlayable && props.onTileClick(props.id)}
    >
      <img
      style={{position: 'absolute', width: '100px', zIndex: -1, transform: rotationStyle}}
      src={`${props.card.tile.img}`}
      />
    {playable}
    {mob}
    <p style={{zIndex: 3}}>
      {player}
    </p>
    {debugInfo}
    </div>
  );
}

export default Tile;

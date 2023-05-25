import { useEffect, useState } from 'react';
import styles from '../styles/Inventory.module.css';
import Image from 'next/image';
import { useSelector } from 'react-redux';


function Inventory() {

  const type = useSelector((state) => state.header.value.type);
  const inventoryPlayersReducer = useSelector((state) => state.games.game.players);
  
  const [inventoryPlayers, setInventoryPlayers] = useState(inventoryPlayersReducer)
  const [inventoryPlayer, setInventoryPlayer] = useState(inventoryPlayersReducer.find(e => e.type === type))

  const shiftArray = (arr, player) => {
    const index = inventoryPlayersReducer.findIndex(e => e.type === player)
    let array1 = arr.slice(index, arr.length)
    let array2 = arr.slice(0,index)
    return array1.concat(array2)
  }

  useEffect(()=>{
    setInventoryPlayer(inventoryPlayersReducer.find(e => e.type === type))
    setInventoryPlayers(shiftArray(inventoryPlayersReducer, type)) 
  },[type,inventoryPlayersReducer])

  
  let players = [];
  for(let i=0; i<inventoryPlayers.length; i++){
    let isActive = 1;
    if(inventoryPlayer.type !== inventoryPlayers[i].type) isActive = .5;
    players.push(
      <div key={i} style={{width: '72px', height: '72px', borderTopLeftRadius: '15%', borderTopRightRadius: '15%', backgroundColor:'white'}}>
        <Image
          id={i}
          alt={inventoryPlayers[i].type} 
          width={100}
          height={100}
          style={{ borderTopLeftRadius: '15%', borderTopRightRadius: '15%', opacity: `${isActive}`}}
          src={`/heros/${inventoryPlayers[i].type}.png`}
          onMouseEnter={(e) => setInventoryPlayer(inventoryPlayers[e.target.id])}
          onMouseLeave={()=> setInventoryPlayer(inventoryPlayersReducer.find(e => e.type === type))}
        />
      </div>
    )
  }
  
//gestion de la pool de life
  let life = []; 
  for(let i=0; i<5; i++){
    if(i < 5 - inventoryPlayer.life){
      life.push(
        <img
          key={i}
          style={{width: '30px'}}
          src={`/inventory/death.png`}
        />
      )
    }else{
      life.push(
        <img
          key={i}
          style={{width: '30px'}}
          src={`/inventory/life.png`}
        />
      )
    }
    
  }

  //gestion des pouvoirs
  let powers = [];
    for(let i=0; i<2; i++){
      powers.push(
        <img
            key={i}
            style={{width: '35px', margin: '10%'}}
            src={`/inventory/pouvoirs/${inventoryPlayer.type}_${i +1}.png`}
        />
      )
    }

  const weaponsStyle = [{backgroundImage: 'url(/inventory/weapon.png)',backgroundSize: 'contain'},{backgroundImage: 'url(/inventory/weapon.png)',backgroundSize: 'contain'}];
  for(let i=0; i<inventoryPlayer.weapons.length; i++){
    if(inventoryPlayer.weapons[i]){
      weaponsStyle[i] = {backgroundImage: `url(/inventory/${inventoryPlayer.weapons[i]}.png)`,backgroundSize: 'contain'}
    }
  }

 
  let keyStyle = {backgroundImage: 'url(/inventory/key-background.png)', backgroundSize: 'contain'}
  if(inventoryPlayer.key){
    keyStyle = {backgroundImage: 'url(/inventory/key.png)', backgroundSize: 'contain'}
  }

  const scrollsStyle = [{backgroundImage: 'url(/inventory/scroll.png)',backgroundSize: 'contain'},{backgroundImage: 'url(/inventory/scroll.png)',backgroundSize: 'contain'}, {backgroundImage: 'url(/inventory/scroll.png)',backgroundSize: 'contain'}];
  for(let i=0; i<inventoryPlayer.scroll.length; i++){
    if(inventoryPlayer.scroll[i]){
      scrollsStyle[i] = {backgroundImage: `url(/inventory/${inventoryPlayer.scroll[i]}.png)`,backgroundSize: 'contain'}
    }
  }

  let scrolls = [];

  let inventory = (
    <div className={styles.inventory}>
        <div className={styles.life}>
          {life}
        </div>
        <div className={styles.objets}>
          <div className={styles.objetsrow}>
            <div className={styles.invWeapons} style={weaponsStyle[0]}></div>
            <div className={styles.invWeapons} style={weaponsStyle[1]}></div>
            <div className={styles.invKey} style={keyStyle}></div>
          </div>
          <div className={styles.objetsrow}>
            <div className={styles.invScroll} style={scrollsStyle[0]}></div>
            <div className={styles.invScroll} style={scrollsStyle[1]}></div>
            <div className={styles.invScroll} style={scrollsStyle[2]}></div>
          </div>
        </div>

        <div className={styles.pouvoirs}>
          {powers}
          <p className='treasure' style={{width: '35px', height: '35px', margin: '10%', backgroundColor: '#E6A840', borderRadius: '50%', textAlign: 'center', paddingTop:'5px',fontSize: '16px', fontFamily: 'Permanent Marker'}}>
            {inventoryPlayer.treasure}
          </p>
        </div>
      </div>
  );
  

  return (
    <div className={styles.inventoryContainer}>
      <div className={styles.players}>
        {players}
      </div>
      {inventory}     
    </div>
  );
}

export default Inventory;


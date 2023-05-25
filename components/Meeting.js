import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { useKey, updateInventory, looseLife } from '../reducers/games';
import { updateMeet } from '../reducers/meeting';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice, faDiceOne, faDiceTwo, faDiceThree, faDiceFour, faDiceFive, faDiceSix } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

function Meeting() {
    const router = useRouter();
    const dispatch = useDispatch();

    const meeting = useSelector((state) => state.meeting.value);
    const player = useSelector((state) => state.header.value.type);
    const mooves = useSelector((state) => state.header.value.mooves);
    const inventory = useSelector((state) => state.games.game.players);
    const inventoryPlayer = inventory[inventory.findIndex(e => e.type === player)];
    const position = useSelector((state) => state.position.value.position);
    const actualMeeting = meeting.find(e => e.coords === position);

    const [isModalCoffreOpen, setIsModalCoffreOpen] = useState(false);
    const [isModalCombatOpen, setIsModalCombatOpen] = useState(false);
    const [showLoot, setShowLoot] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const [showScoreBoard, setShowScoreBoard] = useState(false);
    const [firstDice, setFirstDice] =useState(null);
    const [secondDice, setSecondDice] =useState(null);
    const [totalCombatDice, setTotalCombatDice] = useState(null);
    const [totalStuffOnPlayer, setTotalStuffOnPlayer] = useState([null, null]);
    

    let modalStyle = {}
    if(isModalCoffreOpen || isModalCombatOpen || showLoot){
        modalStyle = {display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', backgroundColor: '#E8E7DD', width: '360px', height: '130px', padding: '20px', paddingTop: '30px', borderBottomRightRadius:' 20px',borderBottomLeftRadius: '20px'}
    }

    let modal;
    if(isModalCoffreOpen && inventoryPlayer.key){ 
        modal = (
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <div style={{width: '72px', height: '72px'}}>
                    <Image
                    alt='Coffre fermé'
                    src={`/mobs/closed_chest.png`}
                    width={100}
                    height={100}
                    />
                </div>
                <div style={{marginLeft: '20px'}}>
                    <button
                        type='button'
                        onClick={() => {
                            if(inventoryPlayer.key){
                                dispatch(useKey(player))
                                dispatch(updateInventory({loot: actualMeeting.meeting.loot, player}))
                                dispatch(updateMeet({...actualMeeting, isResolved: true}))
                                setIsModalCoffreOpen(false)
                            }
                        }}
                    >
                        Ouvrir ?
                    </button> 
                </div>
            </div>
        )
    }else if(isModalCoffreOpen && !inventoryPlayer.key){
        modal = (
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{width: '72px', height: '72px'}}>
                    <Image
                    alt='Coffre fermé'
                    src={`/mobs/closed_chest.png`}
                    width={100}
                    height={100}
                    />
                </div>
                <div style={{marginLeft: '20px'}}>
                    <p>Revenez avec une clef</p>
                    <button
                        type='button'
                        onClick={() => {
                            if(mooves === 4){
                                dispatch(updateMeet({...actualMeeting, isSkiped: true}))
                            }
                            setIsModalCoffreOpen(false)
                        }}
                    >
                        OK
                    </button> 
                </div>
            </div>
        )
    }

     const rollDice = () => {
            const dice1 = Math.floor(Math.random() * 6) + 1;
            const dice2 = Math.floor(Math.random() * 6) + 1;

            if(dice1 === 1) setFirstDice(<FontAwesomeIcon icon={faDiceOne} color='#324E01' size='2xl'/>);
            if(dice1 === 2) setFirstDice(<FontAwesomeIcon icon={faDiceTwo} color='#324E01' size='2xl'/>);
            if(dice1 === 3) setFirstDice(<FontAwesomeIcon icon={faDiceThree} color='#324E01' size='2xl'/>);
            if(dice1 === 4) setFirstDice(<FontAwesomeIcon icon={faDiceFour} color='#324E01' size='2xl'/>);
            if(dice1 === 5) setFirstDice(<FontAwesomeIcon icon={faDiceFive} color='#324E01' size='2xl'/>);
            if(dice1 === 6) setFirstDice(<FontAwesomeIcon icon={faDiceSix} color='#324E01' size='2xl'/>);

            if(dice2 === 1) setSecondDice(<FontAwesomeIcon icon={faDiceOne} color='#324E01' size='2xl'/>);
            if(dice2 === 2) setSecondDice(<FontAwesomeIcon icon={faDiceTwo} color='#324E01' size='2xl'/>);
            if(dice2 === 3) setSecondDice(<FontAwesomeIcon icon={faDiceThree} color='#324E01' size='2xl'/>);
            if(dice2 === 4) setSecondDice(<FontAwesomeIcon icon={faDiceFour} color='#324E01' size='2xl'/>);
            if(dice2 === 5) setSecondDice(<FontAwesomeIcon icon={faDiceFive} color='#324E01' size='2xl'/>);
            if(dice2 === 6) setSecondDice(<FontAwesomeIcon icon={faDiceSix} color='#324E01' size='2xl'/>);
            
            setTotalCombatDice(dice1 + dice2);

            if(inventoryPlayer.weapons[0] === 'daggers') {
                if(inventoryPlayer.weapons[1] === null) setTotalStuffOnPlayer([<FontAwesomeIcon icon={faDiceOne} color='#9F3329' size='2xl'/>, 1]);
                else if (inventoryPlayer.weapons[1] === 'daggers') setTotalStuffOnPlayer([<FontAwesomeIcon icon={faDiceTwo} color='#9F3329' size='2xl'/>, 2]);
                else if (inventoryPlayer.weapons[1] === 'sword') setTotalStuffOnPlayer([<FontAwesomeIcon icon={faDiceThree} color='#9F3329' size='2xl'/>, 3]);
                else if (inventoryPlayer.weapons[1] === 'axe') setTotalStuffOnPlayer([<FontAwesomeIcon icon={faDiceFour} color='#9F3329' size='2xl'/>, 4]);
            }
            else if(inventoryPlayer.weapons[0] === 'sword') {
                if(inventoryPlayer.weapons[1] === null) setTotalStuffOnPlayer([<FontAwesomeIcon icon={faDiceTwo} color='#9F3329' size='2xl'/>, 2]);
                else if (inventoryPlayer.weapons[1] === 'daggers') setTotalStuffOnPlayer([<FontAwesomeIcon icon={faDiceThree} color='#9F3329' size='2xl'/>, 3]);
                else if (inventoryPlayer.weapons[1] === 'sword') setTotalStuffOnPlayer([<FontAwesomeIcon icon={faDiceFour} color='#9F3329' size='2xl'/>, 4]);
                else if (inventoryPlayer.weapons[1] === 'axe') setTotalStuffOnPlayer([<FontAwesomeIcon icon={faDiceFive} color='#9F3329' size='2xl'/>, 5]);
            }
            else if(inventoryPlayer.weapons[0] === 'axe') {
                if(inventoryPlayer.weapons[1] === null) setTotalStuffOnPlayer([<FontAwesomeIcon icon={faDiceThree} color='#9F3329' size='2xl'/>, 3]);
                else if (inventoryPlayer.weapons[1] === 'daggers') setTotalStuffOnPlayer([<FontAwesomeIcon icon={faDiceFour} color='#9F3329' size='2xl'/>, 4]);
                else if (inventoryPlayer.weapons[1] === 'sword') setTotalStuffOnPlayer([<FontAwesomeIcon icon={faDiceFive} color='#9F3329' size='2xl'/>, 5]);
                else if (inventoryPlayer.weapons[1] === 'axe') setTotalStuffOnPlayer([<FontAwesomeIcon icon={faDiceSix} color='#9F3329' size='2xl'/>, 6]);
            }           

        }

       
    let modalCombat;
    if(isModalCombatOpen){ 
       
        modal = (
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <div style={{width: '72px', height: '72px'}}>
                    <Image
                    alt='monstre'
                    src={`/mobs/${actualMeeting?.meeting.mob}.png`}
                    width={100}
                    height={100}
                    />
                </div>
                <div style={{marginLeft: '20px'}}>
                
                    {showLoot ? (<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <div style={{width: '72px', height: '72px'}}>
                            <Image
                            alt='monstre'
                            src={`/inventory/${actualMeeting.meeting.loot}.png`}
                            width={100}
                            height={100}
                            />
                        </div>
                        <button
                            style={{marginLeft: '20px'}}
                            type='button'
                            onClick={() => { actualMeeting.meeting.mob === 'dragon' ? (dispatch(updateInventory({loot: actualMeeting.meeting.loot, player})), setShowScoreBoard(true)) :
                                (setShowLoot(false),
                                dispatch(updateMeet({...actualMeeting, isResolved: true})),
                                setIsModalCombatOpen(false),
                                dispatch(updateInventory({loot: actualMeeting.meeting.loot, player})),
                                setFirstDice(null),
                                setSecondDice(null),
                                setTotalCombatDice(null),
                                setTotalStuffOnPlayer([null, null]))
                            }}
                        >
                        Ramasse ton loot
                    </button></div>) : (<>
                        {showButton && <FontAwesomeIcon icon={faDice} shake color='#312F2C' size='2xl'
                        onClick={() =>{ rollDice(), setShowButton(!showButton)}}/>}
                    <div>
                    {firstDice}&nbsp;
                    {secondDice}&nbsp;
                    {totalStuffOnPlayer[0]}
                    {!showButton &&<>
                    <div>Résultat combat: {totalCombatDice + totalStuffOnPlayer[1]}</div>
                    <button onClick={ () => {
                        if((totalCombatDice + totalStuffOnPlayer[1]) > actualMeeting.meeting.strength){
                            (setShowLoot(true), setShowButton(!showButton), setFirstDice(null), setSecondDice(null), setTotalCombatDice(null), setTotalStuffOnPlayer([null, null]))
                        }else{
                            if((totalCombatDice + totalStuffOnPlayer[1]) < actualMeeting.meeting.strength){ dispatch(looseLife(player)) }
                            (dispatch(updateMeet({...actualMeeting, isSkiped: true})), setIsModalCombatOpen(false), setShowButton(!showButton), setFirstDice(null), setSecondDice(null), setTotalCombatDice(null), setTotalStuffOnPlayer([null,null]))
                        }
                    }}>OK</button></>}
                    </div></> )}             
                </div>
            </div>
        )
    }

    let playersScore = [];
    const inventoryTemp = [...inventory]
    const sortedScore = inventoryTemp.sort((a,b) =>  b.treasure - a.treasure)
    for(let i=0; i<sortedScore.length; i++){
        playersScore.push(
        <div style={{display: 'flex', width: '100%', marginLeft: '40px', marginTop: '0px', alignItems: 'center',}}>
            <Image 
                key={i}
                alt={sortedScore[i].type} 
                width={72}
                height={72}
                style={{ borderRadius: '15%' }}
                src={`/heros/${sortedScore[i].type}.png`}
            />
            <p style={{ marginLeft: '20px', marginTop: '10px', marginBottom: '10px', width: '100px', fontFamily: 'Permanent Marker', fontSize: '20px'}}>{sortedScore[i].username}</p>
            <p style={{ marginLeft: '20px', marginTop: '10px', marginBottom: '10px', width: '60px', height: '60px', backgroundColor: '#E6A840', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Permanent Marker', fontSize: '20px'}}>{sortedScore[i].treasure}</p>
        </div>
        )
    }

    let scoreBoard;
    if(showScoreBoard) {
        scoreBoard = (
            <div style={{ marginLeft: "-20px", top: '1px', position: 'absolute', backgroundColor: '#E8E7DD', height: '60vh', width: '100%', display: 'flex', borderBottomRightRadius:' 20px',borderBottomLeftRadius: '20px', flexDirection:'column', alignItems: 'center', justifyContent: 'center'}}>
                {playersScore}
                <button onClick={() => router.push('/')}>
                    Nouvelle partie
                </button>
            </div>
        );
    }
    

    useEffect(()=>{ 
        if(actualMeeting && actualMeeting.meeting.mob === 'closed_chest' && !actualMeeting.isSkiped && !actualMeeting.isResolved ){
            setIsModalCoffreOpen(true)
        }else if(actualMeeting && actualMeeting.meeting.mob !== 'closed_chest' && !actualMeeting.isSkiped && !actualMeeting.isResolved ){
            setIsModalCombatOpen(true)
        }else if(!actualMeeting){
            setIsModalCoffreOpen(false);
            setIsModalCombatOpen(false)
        }
    },[actualMeeting, player])
    
    return (
            <div style={modalStyle}>
                {modal}
                {modalCombat}
                {scoreBoard}
            </div>            
    )
};

export default Meeting;
import styles from '../styles/ConfigGame.module.css';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router';
import { setPlayerHeroeNames, setGame } from '../reducers/games';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Pusher from 'pusher-js';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

const pusher = new Pusher('2945f99e59578cb5c02a', { cluster: 'eu' });
const BACKEND_ADDRESS = BACKEND_URL;

function Gamelauncher() {
    const [nbJoueurs, setNbJoueurs] = useState(0)
    const router = useRouter()
    const gameId = useSelector((state) => state.games.id);
    // console.log('id game: ', gameId);
    const gamecreator = useSelector((state) => state.games.gamecreator);
    const playerHeroeNames = useSelector((state) => state.games.playerHeroeNames);
    const [intervalID, setIntervalID] = useState(null)
    // console.log('playerHeroeNames:', playerHeroeNames)
    const dispatch = useDispatch();

    function fetch_getPlayerHeroe() {
        // this function is launched by setInterval
        // console.log('Entry in fetch_getPlayerHeroe');
        fetch(BACKEND_URL + '/getPlayerHeroe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: gameId }),
        }).then(response => response.json())
            .then(data => {
                if (data.result === true) {
                    if (JSON.stringify(data.infos) !== JSON.stringify(playerHeroeNames)) {
                        // console.log('data.infos: ', data.infos);
                        // console.log('playerHeroeNames: ', playerHeroeNames);
                        dispatch(setPlayerHeroeNames(data.infos))
                    }
                    if (data.gameStarted) {
                        fetch(BACKEND_URL + '/getGame', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: gameId }),
                        })
                            .then(response => response.json())
                            .then(data_game => {
                                if (data_game.result === true) {
                                    console.log(data_game.game);
                                    dispatch(setGame(data_game.game))
                                    router.push(`/game/${gameId}`)
                                } else {
                                    alert('Bad luck : Cannot get the game');
                                }
                            });
                    }
                } else {
                    console.log('Cannot get player/heroe');
                }
            })
    }

    useEffect(() => {
        return;
        const local_intervalID = setInterval(fetch_getPlayerHeroe, 1000 * 5)
        // setIntervalID(local_intervalID)(on appelle la fonction tt les 5sc)
        console.log('set intervalID: ', local_intervalID)

        return () => {
            console.log('clear intervalID: ', local_intervalID)
            // clearInterval(intervalID);
            clearInterval(local_intervalID);
            console.log('clear intervalID: ', local_intervalID)
        }
    }, [])

    const playerHeroeNames_jsx = playerHeroeNames.map((couple, ii) => {
        return (
            <div key={ii}>
                {/* {couple.username + ' is ' + couple.heroe} */}
                {couple.username + ' has join the game'}
            </div>
        )
    })
    // console.log('joueurs_heroes jsx : ', playerHeroeNames_jsx);

    useEffect(() => {
        setNbJoueurs(playerHeroeNames.length)
    }, [playerHeroeNames])

    const handleStartGame = () => {
        fetch(BACKEND_URL + '/startGame', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: gameId }),
        })
            .then(response => response.json())
            .then(data_game => {
                if (data_game.result === true) {
                    console.log(data_game.game);
                    console.log('To restart game: \n',
                        FRONTEND_URL + '/kArAkRePlAy/' + gameId +
                        playerHeroeNames.reduce((acc, couple) => acc + `/${couple.username}_${couple.heroe.replaceAll(' ', '_')}`, ''))
                    dispatch(setGame(data_game.game))
                    //dispatch(initInventory(data_game.game.players))
                    router.push(`/game/${gameId}`)
                } else {
                    alert('Bad luck : Cannot get the game');
                }
            });

    };


    //copié-collé à travailler pour Pusher :

    //  export default function ChatScreen({ navigation, route: { params } }) {
    // const [messages, setMessages] = useState([]);
    // const [messageText, setMessageText] = useState('');
    const pusherUser = useSelector((state) => state.games.playerNames_local[0]);

    useEffect(() => {
        let channel_global 

        (async () => {
            fetch(`${BACKEND_ADDRESS}/users/${pusherUser}`, { method: 'PUT' });
            console.log('Pusher: Mount after fetch');

            const channel = await pusher.subscribe('karak-development');
            channel_global = channel
            channel.bind('pusher:subscription_succeeded', () => {
                channel.bind('message', handleReceiveMessage);
            });
            // channel.bind_global((a,b) => {
            //     console.log(a, '/yes/', b)
            //     channel.bind('message', handleReceiveMessage);
            //  } );
            // console.log('Pusher: Mount after fetch l136');

            pusher.log = (message) => {
                if (window.console && window.console.log) {
                    window.console.log('Pusher: it\'s a pusher.log: ', message);
                }
            };
        })();

        return () => {
            console.log('Pusher: leave');
            if (channel_global) channel_global.unbind('message');
            fetch(`${BACKEND_ADDRESS}/users/${pusherUser}`, { method: 'DELETE' });
        }
    }, [pusherUser]);

    const handleReceiveMessage = (data) => {
        console.log('Pusher: Entry in Gamelauncher/handleReceiveMessage, messages received:  ', data);
        // setMessages(messages => [...messages, data]);
    };

    const handleSendMessage = (message) => {
        if (!message) {
            return;
        }

        const payload = {
            text: message,
            username: pusherUser,
            createdAt: new Date(),
            id: Math.floor(Math.random() * 100000),
        };
        console.log('Pusher: Fetch/POST the message to backend, payload: ', payload);
        fetch(`${BACKEND_ADDRESS}/users/${pusherUser}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        // setMessageText('');
    };
    //Fin du copié-collé pour Pusher

    const karakCircularProgress = styled(CircularProgress)({ color: "#324E01" })

    const testPusher = false
    return (
        <div className={styles.container}>

            <div className={styles.headerContainer}>
                <span className={styles.logoLetter}>K</span>
                <p className={styles.headerText}>En attente des joueurs</p>
            </div>

            <div className={styles.subContainer}>

                <div className={styles.urlSection}>

                    <CircularProgress sx={{ color: '#324E01' }} />

                    <span className={styles.h2}>
                        {nbJoueurs} joueurs ont rejoint la partie
                    </span>

                    {gamecreator &&
                        (<div title="Démarrer la partie"  >
                            <button onClick={handleStartGame} className={styles.largeBtn}>
                                <span>Démarrer à {nbJoueurs}</span>
                            </button>
                        </div>)
                    }
                    <div>
                        {playerHeroeNames_jsx}
                    </div>
                    {testPusher &&
                        <div title="test pusher"  >
                            <button onClick={() => handleSendMessage('test pusher ' + gameId)} className={styles.largeBtn}>
                                <span>test send pusher</span>
                            </button>
                        </div>
                    }
                </div>

            </div>
        </div>)
};

export default Gamelauncher;

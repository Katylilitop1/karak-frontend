import '../styles/globals.css';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import games from '../reducers/games'
import header from '../reducers/header';
import meeting from '../reducers/meeting';
import inventory from '../reducers/inventory';
import position from '../reducers/position';

const store = configureStore({
  reducer: { games, header, meeting, inventory, position },
 });

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <title>Karak</title>
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
}

export default App;

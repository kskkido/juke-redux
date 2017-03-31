import store from '../store.js';
import React from 'react';
import {setLyrics} from '../action-creators/lyrics.js'

export default class LyricsContainer extends React.Component {
  constructor (props) {
    super(props);
    this.state = store.getState();
  }

  componentDidMount() {
      this.unsubscribeFromStore = store.subscribe(() => {
         this.setState(store.getState());
      });
  }

  componentWillUnmount() {
      this.unsubscribeFromStore();
  }

  updateLyrics () {
    store.dispatch(setLyrics());
  }

  render () {}
}


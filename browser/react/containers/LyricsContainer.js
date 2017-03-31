import store from '../store.js';
import React from 'react';
import {setLyrics, fetchLyrics} from '../action-creators/lyrics.js'
import Lyrics from '../components/Lyrics.js'
import axios from 'axios'

export default class LyricsContainer extends React.Component {
  constructor (props) {
    super(props);
    this.state = Object.assign({artistQuery: '', songQuery: ''}, store.getState());
    this.setArtist = this.setArtist.bind(this)
    this.setSong = this.setSong.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
      this.unsubscribeFromStore = store.subscribe(() => {
         this.setState(store.getState());
      });
  }

  componentWillUnmount() {
      this.unsubscribeFromStore();
  }

  updateLyrics (text) {
    store.dispatch(setLyrics(text));
  }

  setArtist (artist) {
    this.setState({
      artistQuery: artist
    })
  }

  setSong (song) {
    this.setState({
      songQuery: song
    })
  }

  // handleSubmit () {
  //   axios.get(`/api/lyrics/${this.state.artistQuery}/${this.state.songQuery}`)
  //   .then(lyrics => {
  //     console.log(lyrics.data.lyric)
  //     this.updateLyrics(lyrics.data.lyric)})
  // }

  handleSubmit() {
    if (this.state.artistQuery && this.state.songQuery) {
      store.dispatch(fetchLyrics(this.state.artistQuery, this.state.songQuery));
    }
  }


  render () {

    return (
            <div>
              <h1>asdf</h1>
              <Lyrics text = {this.state.text}
                setArtist = {this.setArtist}
                setSong = {this.setSong}
                artistQuery = {this.state.artistQuery}
                songQuery = {this.state.songQuery}
                handleSubmit = {this.handleSubmit}
                />
            </div>
            );
  }
}

// text: Possibly a string of lyrics to display, but could very well be null.
// setArtist: A function that should be invoked with the artist that will be searched.
// artistQuery: The current value of artist to be searched
// setSong: A function that should be invoked with the song that will be searched.
// songQuery: The current value of song to be searched
// handleSubmit: A function that should be invoked when ready to search.

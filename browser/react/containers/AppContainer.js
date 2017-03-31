import React, { Component } from 'react';
import axios from 'axios';
import { hashHistory } from 'react-router';

import initialState from '../initialState';
import AUDIO from '../audio';

import Albums from '../components/Albums.js';
import Album from '../components/Album';
import Sidebar from '../components/Sidebar';
import Player from '../components/Player';

import store from '../store.js'

import { convertAlbum, convertAlbums, convertSong, skip } from '../utils';
import {startPlaying, stopPlaying, setCurrentSong, setCurrentSongList} from '../action-creators/player-action.js'
import {play, pause, load, startSong, toggle, toggleOne, next, prev} from '../action-creators/player-action.js'

export default class AppContainer extends Component {

  constructor (props) {
    super(props);
    this.state = Object.assign(initialState, store.getState());

    this.selectAlbum = this.selectAlbum.bind(this);
    this.selectArtist = this.selectArtist.bind(this);
    this.addPlaylist = this.addPlaylist.bind(this);
    this.selectPlaylist = this.selectPlaylist.bind(this);
    this.loadSongs = this.loadSongs.bind(this);
    this.addSongToPlaylist = this.addSongToPlaylist.bind(this);
  }

  componentDidMount () {

    Promise
      .all([
        axios.get('/api/albums/'),
        axios.get('/api/artists/'),
        axios.get('/api/playlists')
      ])
      .then(res => res.map(r => r.data))
      .then(data => this.onLoad(...data));

    AUDIO.addEventListener('ended', () =>
      this.next());
    AUDIO.addEventListener('timeupdate', () =>
      this.setProgress(AUDIO.currentTime / AUDIO.duration));

      this.unsubscribeFromStore = store.subscribe(() => {
         this.setState(store.getState());
      });
  }



  onLoad (albums, artists, playlists) {
    this.setState({
      albums: convertAlbums(albums),
      artists: artists,
      playlists: playlists
    });
  }



  // play () {
  //   AUDIO.play();
  //   store.dispatch(startPlaying());
  // }
  //
  // pause () {
  //   AUDIO.pause();
  //   store.dispatch(stopPlaying());
  // }
  //
  // load (currentSong, currentSongList) {
  //   AUDIO.src = currentSong.audioUrl;
  //   AUDIO.load();
  //   store.dispatch(setCurrentSong(currentSong))
  //   store.dispatch(setCurrentSongList(currentSongList))
  //   // this.setState({
  //   //   currentSong: currentSong,
  //   //   currentSongList: currentSongList
  //   // });
  // }
  //
  play () {
    store.dispatch(play());
  }

  pause () {
    store.dispatch(pause());
  }

  load (currentSong, currentSongList) {
    store.dispatch(load(currentSong, currentSongList));
  }

  startSong (song, list) {
    store.dispatch(startSong(song, list));
  }

  toggleOne (selectedSong, selectedSongList) {
    store.dispatch(toggleOne(selectedSong, selectedSongList));
  }

  toggle () {
    store.dispatch(toggle());
  }

  next () {
    store.dispatch(next());
  }

  prev () {
    store.dispatch(prev());
  }

  setProgress (progress) {
    this.setState({ progress: progress });
  }

  selectAlbum (albumId) {
    axios.get(`/api/albums/${albumId}`)
      .then(res => res.data)
      .then(album => this.setState({
        selectedAlbum: convertAlbum(album)
      }));
  }

  selectArtist (artistId) {
    Promise
      .all([
        axios.get(`/api/artists/${artistId}`),
        axios.get(`/api/artists/${artistId}/albums`),
        axios.get(`/api/artists/${artistId}/songs`)
      ])
      .then(res => res.map(r => r.data))
      .then(data => this.onLoadArtist(...data));
  }

  onLoadArtist (artist, albums, songs) {
    songs = songs.map(convertSong);
    albums = convertAlbums(albums);
    artist.albums = albums;
    artist.songs = songs;

    this.setState({ selectedArtist: artist });
  }

  addPlaylist (playlistName) {
    axios.post('/api/playlists', { name: playlistName })
      .then(res => res.data)
      .then(playlist => {
        this.setState({
          playlists: [...this.state.playlists, playlist]
        }, () => {
          hashHistory.push(`/playlists/${playlist.id}`)
        });
      });
  }

  selectPlaylist (playlistId) {
    axios.get(`/api/playlists/${playlistId}`)
      .then(res => res.data)
      .then(playlist => {
        playlist.songs = playlist.songs.map(convertSong);
        this.setState({
          selectedPlaylist: playlist
        });
      });
  }

  loadSongs (songs) {
    axios.get('/api/songs')
      .then(res => res.data)
      .then(songs => {
        this.setState({
          songs: songs
        });
      });
  }

  addSongToPlaylist (playlistId, songId) {
    return axios.post(`/api/playlists/${playlistId}/songs`, {
      id: songId
    })
      .then(res => res.data)
      .then(song => {
        const selectedPlaylist = this.state.selectedPlaylist;
        const songs = this.state.selectedPlaylist.songs;
        const newSongs = [...songs, convertSong(song)];
        const newSelectedPlaylist = Object.assign({}, selectedPlaylist, {
          songs: newSongs
        });

        this.setState({
          selectedPlaylist: newSelectedPlaylist
        });
      });
  }

  render () {

    console.log(this.state)
    const props = Object.assign({}, this.state, {
      toggleOne: this.toggleOne,
      toggle: this.toggle,
      selectAlbum: this.selectAlbum,
      selectArtist: this.selectArtist,
      addPlaylist: this.addPlaylist,
      selectPlaylist: this.selectPlaylist,
      loadSongs: this.loadSongs,
      addSongToPlaylist: this.addSongToPlaylist
    });

    return (
      <div id="main" className="container-fluid">
        <div className="col-xs-2">
          <Sidebar playlists={this.state.playlists} />
        </div>
        <div className="col-xs-10">
        {
          this.props.children && React.cloneElement(this.props.children, props)
        }
        </div>
        <Player
          currentSong={this.state.player.currentSong}
          currentSongList={this.state.player.currentSongList}
          isPlaying={this.state.player.isPlaying}
          progress={this.state.player.progress}
          next={next}
          prev={prev}
          toggle={toggle}
        />

      </div>
    );
  }
}

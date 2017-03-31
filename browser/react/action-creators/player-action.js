import {START_PLAYING, STOP_PLAYING} from '../constants'

export const setPlay = function () {
  return {type: START_PLAYING, isPlaying: true}
}

export const setPause = function() {
  return {type: STOP_PLAYING, isPlaying: false}


export const setCurrentSong = (currentSong) => ({
    type: SET_CURRENT_SONG,
    currentSong
  });

export const setCurrentSongList = (currentSongList) => ({ 
    type: SET_LIST,
    currentSongList
  });

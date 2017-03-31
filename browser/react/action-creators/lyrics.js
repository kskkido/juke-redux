import {SET_LYRICS} from '../constants'
import axios from 'axios'
export const setLyrics = function (string) {
  return {type: SET_LYRICS, lyric: string}
}
export const fetchLyrics = function (artist, song) {
  return function (dispatch, getState) {
    axios.get(`/api/lyrics/${artist}/${song}`)
      .then(res => {
        dispatch(setLyrics(res.data.lyric));
      });
  };
};

import {SET_LYRICS} from '../constants'

export const setLyrics = function (string) {
  return {type: SET_LYRICS, lyric: string}
}

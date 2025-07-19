import { defineStore } from 'pinia';

export const useCounterStore = defineStore('auth', {
  state: () => ({
    auth: localStorage.getItem('Authorization') || null,
    userInfo: localStorage.getItem('userInfo') || null,
    dataSearch: [],
    keySearch: "",
    visiblePlayBtn: null,
    visiblePlayListBtn: null,
    isDropDown: false,
    isPlaying: false,
    songs: JSON.parse(localStorage.getItem('ListSong')) || null,
    currentIndex: Number(localStorage.getItem('CurrentIndex')),
    currentPlaylistId: Number(localStorage.getItem('CurrentPlaylistId')),
    volumne: 0,
    audioRef: null,
  }),
  getters: {
    isLogged: (state) => !!state.auth,
    getUser: (state) => state.userInfo,
    isVisible: (state) => state.visiblePlayBtn,
    isVisiblePlayList: (state) => state.visiblePlayListBtn,
    isPlayingSong: (state) => state.isPlaying,
    allSongs: (state) => state.songs,
    currentSong: (state) => Array.isArray(state.songs) && state.songs.length > 0 ? state.songs[state.currentIndex] : null,
    currentPlaylist: (state) => state.currentPlaylistId,
    isVolumne: (state) => state.volumne,
    playlistPlaying: (state) => (id) => {
      return state.arrayPlaylist.find(p => p.id === id)?.isPlaying || false
    },
    getAudioRef: (state) => state.audioRef,
    getDataSearch(state) {
      return state.dataSearch
    },
    getKeySearch(state) {
      return state.keySearch
    },
    getVisiblePlayBtn(state) {
      return state.visiblePlayBtn
    },
    getIsDropDown(state) {
      return state.isDropDown
    },
  },
  actions: {
    setToken(token) {
      this.token = token;
    },
    setUser(user) {
      this.userInfo = user;
    },
    setDataSearch(dataSearch) {
      this.dataSearch = dataSearch
    },
    setKeySearch(keySearch) {
      this.keySearch = keySearch
    },
    setVisiblePlayBtn(visible) {
      this.visiblePlayBtn = visible
    },
    setVisiblePlayListBtn(visible) {
      this.visiblePlayListBtn = visible
    },
    setIsDropDown(value) {
      this.isDropDown = value
    },
    play(value) {
      this.isPlaying = value
      localStorage.setItem('IsPlaying', value)
    },
    listSong(value) {
      this.songs = value
      localStorage.setItem('ListSong', JSON.stringify(value))
    },
    index(value) {
      this.currentIndex = value
      localStorage.setItem('CurrentIndex', value)
    },
    playlistId(value) {
      this.currentPlaylistId = value
      localStorage.setItem('CurrentPlaylistId', value)
    },
    setPlaylist(value) {
      this.arrayPlaylist = value
      localStorage.setItem('ArrayPlaylist', JSON.stringify(value))
    },
    next() {
      const currentIndex = this.currentIndex
      if(this.currentIndex < this.allSongs.length - 1) {
        this.index(currentIndex + 1)
      } else {
        this.index(0)
      } 
    },
    prev() {
      const currentIndex = this.currentIndex
      if(currentIndex == 0) {
        this.index(this.allSongs.length - 1)
      } else {
        this.index(currentIndex - 1)
      }
    },
    setAudioRef(el) {
      this.audioRef = el
    }
  }
});
import { defineStore } from 'pinia'

export const useAudioStore = defineStore('audio', {
  state: () => ({
    audioRef: null,
  }),
  getter: {
    getAudioRef: (state) => state.audioRef
  },
  action: {
    setAudioRef(el) {
      audioRef.value = el
    }
  }
})

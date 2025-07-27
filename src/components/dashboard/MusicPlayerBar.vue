<template>
  <div class="flex h-25 px-3 py-2">
    <div class="flex items-center gap-4 flex-1">
      <div class="w-19 h-19 bg-cover">
        <img :src="currentSong?.cover_url" alt="cover" class="rounded-sm" />
      </div>
      <div class="flex flex-col">
        <p class="font-semibold text-white text-lg">{{ currentSong?.song_name }}</p>
        <p class="font-semibold text-gray-500 text-lg">{{ currentSong?.author }}</p>
      </div>
    </div>

    <div class="flex flex-col gap-2 items-center justify-center flex-1">
      <div class="flex items-center justify-center gap-8">
        <i @click="prevSong" class="fa-solid fa-backward-step text-2xl text-gray-400 hover:text-white cursor-pointer"></i>
        <button @click="playSong" class="flex items-center justify-center rounded-full h-10 w-10 border-none bg-white cursor-pointer hover:scale-105">
          <i v-if="!isPlaying" class="fa-solid fa-play text-xl text-black"></i>
          <i v-else class="fa-solid fa-pause text-xl text-black"></i>
        </button>
        <i @click="nextSong" class="fa-solid fa-forward-step text-2xl text-gray-400 hover:text-white cursor-pointer"></i>
      </div>
      <input type="range" class="w-[500px] appearance-none custom-range" min="0" :max="duration" step="0.1" :value="progress" @input="seek" :style="trackStyle">
    </div>
    <div class="flex justify-end items-center gap-3 flex-1">
      <i class="fa-solid fa-volume-low"></i>
      <input type="range" min="0" max="1" step="0.1" :value="volume"  @input="setVolume" class="custom-range !w-[150px] cursor-pointer">
    </div>
    <audio ref="localAudioRef" :src="currentSong?.audio_url" preload="auto" style="display: none"></audio>
  </div>
</template>

<script setup>
import ngotImg from '@/assets/images/ngot.png'
import VueSound from 'vue-sound'
import "vue-sound/style.css"
import { useCounterStore } from '@/stores/authStore'
import { computed, nextTick, onMounted, onUpdated, ref, watch } from 'vue'
import { date } from 'yup'

const stores = useCounterStore()
const localAudioRef = ref(null)

const audio = computed(() => stores.getAudioRef)

let isPlaying = computed(() => stores.isPlayingSong)
let allSongs = computed(() => stores.allSongs)
let currentSong = computed(() => stores.currentSong)
let isVolumne = computed(() => stores.isVolumne)
const volume = ref(1)
const duration = ref(0)
const progress = ref(0)

// Change nhạc mới
watch(currentSong, (newSong) => {
  if(newSong?.audio_url && audio.value) {
    audio.value.load()
    audio.value.addEventListener('canplay', () => {
      audio.value.play();
    })
  }
})

// Gắn nhạc mới khi next bài tự động
watch(() => stores.currentSong, async (newCurrentSong) => {
  if(audio.value) {
    audio.value.pause()
    audio.value.src = newCurrentSong.audio_url
    await audio.value.play()
  }
})

// Điều chỉnh audio
const seek = (e) => {
  const value = parseFloat(e.target.value)
  if (audio.value && audio.value.readyState >= 1) {
    audio.value.currentTime = value
  } else {
    console.warn("Audio chưa sẵn sàng")
  }
}
// Điều chỉnh volumne
const setVolume = (e) => {
  const newVolume = parseFloat(e.target.value)
  volume.value = newVolume
  if (audio.value) {
    audio.value.volume = newVolume
  }
}
// Phát nhạc
const playSong = () => {
  const statePlay = !stores.isPlayingSong
  stores.play(statePlay)
  if(statePlay) {
    if(audio.value) {
      audio.value.play()
    }
  } else {
    if(audio.value) {
      audio.value.pause()
    }
  }
}

// Chạy bài trước
const prevSong = () => {
  stores.prev()
}
// Chạy bài sau
const nextSong = () => {
  stores.next()
}

// Xử lý tự chạy hết cm playlist
const handleEnded = () => {
  const currentIndex = stores.currentIndex
  if (currentIndex < allSongs.value.length - 1) {
    stores.index(currentIndex + 1)
  } else {
    stores.play(false)
  }
}

const trackStyle = computed(() => {
  const pct = duration.value ? (progress.value / duration.value) * 100 : 0;
  return {
    background: `linear-gradient(to right, #22c55e ${pct}%, #404040 ${pct}%)`
  }
})


onMounted(() => {
  nextTick(() => {
    stores.setAudioRef(localAudioRef.value)
    if(audio.value) {
      audio.value.volume = volume.value
      audio.value.addEventListener('loadedmetadata', () => {
        duration.value = audio.value.duration || 1
      })
      audio.value.addEventListener('timeupdate', () => {
        progress.value = audio.value.currentTime
      })
      audio.value.addEventListener('ended', handleEnded)
    }
  })
})
</script>

<style scoped>
.range-input {
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #404040;
}

.range-input::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  opacity: 0;
  transition: opacity 0.2s;
  margin-top: -4px; /* canh giữa */
}

.range-input:hover::-webkit-slider-thumb,
.range-input:active::-webkit-slider-thumb {
  opacity: 1;
}

.range-input::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  opacity: 0;
  transition: opacity 0.2s;
}
.range-input:hover::-moz-range-thumb,
.range-input:active::-moz-range-thumb {
  opacity: 1;
}

</style>

<template>
  <div class="flex h-25 px-3 py-2">
    <div class="flex  items-center gap-4 flex-1">
      <div class="w-19 h-19 bg-cover">
        <img :src="currentSong?.cover_url" alt="cover" class="rounded-sm" />
      </div>
      <div class="flex flex-col">
        <p class="font-semibold text-white text-lg">{{ currentSong?.song_name }}</p>
        <p class="font-semibold text-gray-500 text-lg">{{ currentSong?.author }}</p>
      </div>
      <button class="flex items-center justify-center w-7 h-7 rounded-full border border-neutral-800 border-3 cursor-pointer"><i class="fa-solid fa-plus text-sm"></i></button>
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
      <input type="range" class="w-[500px]" min="0" :max="duration" step="0.1" :value="progress" @input="seek">
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
const duration = ref(null)
const progress = ref(null)

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
  console.log(e.target.value);
  
  const value = parseFloat(e.target.value)
  console.log(audio.value, audio.value.readyState);
  
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

onMounted(() => {
  nextTick(() => {
    stores.setAudioRef(localAudioRef.value)
    if(audio.value) {
      audio.value.volume = volume.value
      audio.value.addEventListener('loadedmetadata', () => {
        duration.value = audio.value.duration
      })
      audio.value.addEventListener('timeupdate', () => {
        progress.value = audio.value.currentTime
      })
      audio.value.addEventListener('ended', handleEnded)
    }
  })
})
</script>

<template>
  <div @click="handleClickSong" class="flex flex-col gap-2 p-4 hover:rounded-xl hover:bg-neutral-800 max-h-[290px] relative">
    <div class="w-40 h-40 bg-cover">
      <img :src="songData.cover_url" alt="cover" class="rounded-lg" />
    </div>
    <p class="font-medium text-lg text-white whitespace-nowrap overflow-hidden overflow-ellipsis">{{ songData.song_name }}</p>
    <p class="font-medium text-lg text-gray-500">{{ songData.author }}</p>
    <button v-show="isVisible === songData.id" class="rounded-full w-13 h-13 p-2 bg-green-500 absolute left-30 top-30 hover:scale-105 hover:bg-green-400 cursor-pointer"><i class="fa-solid fa-play text-xl text-black"></i></button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { useCounterStore } from '@/stores/authStore'

const props = defineProps({
  songData: {
    type: Object,
    required: true
  }
})
const stores = useCounterStore()
const isVisible = computed(() => stores.isVisible)

const emit = defineEmits(['ClickSong'])
const handleClickSong = () => {
  emit('ClickSong', props.songData.id)
}
</script>
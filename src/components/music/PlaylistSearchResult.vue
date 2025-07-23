<template>
  <div class="flex flex-col gap-0" v-for="(data, index) of data.dataSearch" :key="data.id">
    <div class="flex px-2 mt-7">
      <div class="flex items-center gap-2 flex-2">
        <div class="w-13 h-13 bg-cover">
          <img :src="data.cover_url" class="rounded-lg" />
        </div>
        <div class="flex flex-col">
          <p class="font-semibold text-white text-lg" >{{ data.song_name }}</p>
          <p class="font-semibold text-gray-500 text-lg">{{ data.author }}</p>
        </div>
      </div>
      <div class="flex flex-1 justify-start items-center">
        <p class="font-semibold text-gray-500 text-lg">{{ data.song_name }}</p>
      </div>
      <div class="flex flex-1 justify-end items-center">
        <button @click="addPlaylist(data.id)" class="flex justify-center items-center rounded-full h-[40px] w-[90px] border-gray-500 border-1 font-semibold text-white text-lg cursor-pointer hover:scale-107">Thêm</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import axios from '@/utils/axios'
import { computed, nextTick, onBeforeMount, onMounted, onUpdated, ref, watch } from 'vue'
import { useCounterStore } from '@/stores/authStore'
import { useNotify } from '@/utils/useNotify'

const route = useRoute()
const { notify } = useNotify()
const stores = useCounterStore()

const data = ref({
  dataSearch: [],
  listSong: []
})
const props = defineProps({
  playlistData: {
    type: Object,
    required: true
  },
})

data.value.dataSearch = [...stores.getDataSearch]

watch(() => stores.getDataSearch, (newDataSearch) => {
  data.value.dataSearch = [...newDataSearch]
})

// const inPlaylist = computed(() => props.playlistData.song_id.includes(data.id))

const emit = defineEmits()
const addPlaylist = async (id) => {
  const playList = await axios.get(`/play-list/${route.params.idMyPlaylist}`)
  console.log("playlist",playList);
  
  if(playList) {
    if(!playList.data.song_id.includes(id)) {
      const newSongid = playList.data.song_id
      newSongid.push(id)
      console.log("newSongid",newSongid);
      const response = await axios.patch(`/play-list/${route.params.idMyPlaylist}`, {
        song_id: newSongid
      })
      if(response.status == 200) {
        notify(`Đã thêm vào ${props.playlistData.name}`, 'success')
        emit('callApi')
      }
    }
  }
}

// const getSongs = async (songsId) => {
//   const response = await axios.get('/songs')
//   if(response) {
//     data.value.listSong = response.data
//   }
// }

// onMounted(() => {
//   getSongs()
// })
</script>

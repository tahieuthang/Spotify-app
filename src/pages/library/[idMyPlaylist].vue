<template>
  <div v-loading="loadingState" class="flex flex-col gap-12 bg-[#111111] rounded-xl px-8 py-9">
    <div @click="openEdit" class="flex gap-8 cursor-pointer">
      <div v-if="data.playListInfo.cover_url" class="bg-cover">
        <img :src="data.playListInfo.cover_url" alt="ngot" class="rounded-sm w-[280px] h-[280px]" />
      </div>
      <div v-else class="flex items-center justify-center w-[280px] h-[280px] bg-neutral-700 rounded-sm">
        <i class="fa-solid fa-music text-7xl"></i>
      </div>
      <div class="flex flex-col justify-end items-start gap-4">
        <p class="font-bold text-lg">Danh sách phát công khai</p>
        <p class="font-extrabold text-7xl leading-[1.5] max-w-[800px] whitespace-nowrap overflow-hidden overflow-ellipsis">{{ data.playListInfo.name }}</p>
        <div class="flex gap-3 items-center">
          <p class="font-bold text-gray-500"><span class="font-bold text-lg text-white">{{ userLogin.name }}</span> &bull; {{ data.playListInfo.song_id?.length || 0 }} bài hát</p>
        </div>
      </div>
    </div>
    <!-- <div class="flex justify-center items-center">
      <hr class="border-neutral-700 w-full">
    </div> -->
    <div @click="closeEdit" v-if="isOpen" id="overlay" class="fixed inset-0 bg-black opacity-70"></div>
    <EditModal v-if="isOpen" :playlistData="data.playListInfo" @callApi="getPlayListData"/>

    <div class="flex gap-4 items-center mb-1">
      <button @click="playPlayList" :disabled="data.listSong == ''" class="flex justify-center items-center rounded-full w-15 h-15 bg-green-500 hover:scale-105 hover:bg-green-400 cursor-pointer">
        <i v-if="isPlaying && currentPlaylist === data.playListInfo.id" class="fa-solid fa-pause text-2xl text-black"></i>
        <i v-else class="fa-solid fa-play text-2xl text-black"></i>
      </button>
    </div>
    <table v-if="data.listSong != ''">
      <thead>
        <tr class="border-b border-gray-700">
          <th class="font-semibold text-gray-500 text-xl text-center">#</th>
          <th class="font-semibold text-gray-500 text-lg">Tiêu đề</th>
          <th></th>
          <th class="text-center"><i class="fa-regular fa-clock font-semibold text-gray-500 text-lg"></i></th>
          <th></th>
        </tr>
      </thead>
      <draggable v-model="data.listSong" item-key="id" tag="tbody" :ghost-class="'ghost-row'" @start="onDragStart" @end="onDragEnd">
        <template #item="{ element, index }">
          <tr :key="element.id" class="hover:bg-neutral-800 cursor-pointer" @mouseenter="() => showSaveBtn(element.id)" @mouseleave="() => hiddenSaveBtn()" @click="playSong(index, data.listSong)">
            <td class="font-semibold text-gray-500 text-2xl p-2 text-center pr-6" :class="{ '!text-green-500': currentSong.id == element.id && data.playListInfo.id == currentPlaylist }">{{ index + 1 }}</td>
            <td class="p-2">
              <div class="flex gap-2 items-center">
                <div class="w-13 h-13 bg-cover">
                  <img :src="element.cover_url" class="rounded-lg" />
                </div>
                <div class="flex flex-col">
                  <p class="font-semibold text-white text-lg" :class="{ '!text-green-500': currentSong.id == element.id && data.playListInfo.id == currentPlaylist }">{{ element.song_name }}</p>
                  <p class="font-semibold text-gray-500 text-lg">{{ element.author }}</p>
                </div>
              </div>
            </td>
            <td></td>
            <td class="font-semibold text-gray-500 text-lg p-2 text-center">{{ element.time }}</td>
            <td class="w-[40px]"><button @click="(event) => { event.stopPropagation(); removePlaylist(element.id) }" v-show="visibleSave == element.id" class="border-none cursor-pointer"><i class="fa-solid fa-minus"></i></button></td>
          </tr>
        </template>
      </draggable>
    </table>

    <div class="flex justify-center items-center mt-3 mb-[-35px] w-full">
      <hr class="border-neutral-700 w-full">
    </div>
    <div class="flex flex-col gap-3">
      <p class="font-bold text-3xl">Hãy cùng tìm nội dung cho danh sách phát của bạn</p>
      <div class="flex items-center bg-neutral-800 text-white rounded-sm px-6 py-2 w-[725px] h-12">
        <button @click="handleClickSearch" class="border-none">
          <i class="fas fa-search text-neutral-400 text-xl mr-4 cursor-pointer hover:text-white transition"></i>
        </button>
        <input
          type="text"
          placeholder="Tìm kiếm bài hát"
          class="bg-transparent outline-none placeholder-neutral-400 text-xl flex-1"
          @keyup.enter="handleClickSearch"
          v-model="data.keySearch"
        />
      </div>
      <PlaylistSearchResult v-if="isSearch" :playlistData="data.playListInfo" @callApi="getPlayListData"/>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import ngotImage from '@/assets/images/ngot.png'
import PlaylistSearchResult from '@/components/music/PlaylistSearchResult.vue'
import EditModal from '@/components/music/EditModal.vue'
import { useRoute } from 'vue-router'
import Footer from '@/components/dashboard/Footer.vue'
import axios from '@/utils/axios'
import { computed, nextTick, onBeforeMount, onMounted, onUpdated, ref } from 'vue'
import { useCounterStore } from '@/stores/authStore'
import { useNotify } from '@/utils/useNotify'
import { eventBus } from '@/utils/eventBus'
import draggable from 'vuedraggable'

const data = ref({
  playListInfo: {},
  listSong: [],
  keySearch: "",
  dataSearch: []
})

const route = useRoute()
const idPlayList = route.params.idMyPlaylist
const loadingState = ref(false)
const stores = useCounterStore()
const userLogin = computed(() => stores.getUser)
const { notify } = useNotify

let visibleSave = computed(() => stores.isVisible)
let isPlaying = computed(() => stores.isPlayingSong)
let currentSong = computed(() => stores.currentSong)

let storeSong = computed(() => stores.allSongs)
const audio = computed(() => stores.getAudioRef)
const isOpen = computed(() => stores.isOpen)
const isSearch = computed(() => stores.isSearch)

const getPlayListData = async () => {
  const response = await axios.get(`/play-list/${idPlayList}`)
  if(response) {
    data.value.playListInfo = response.data
    getSongs(data.value.playListInfo.song_id)
  }
}

const getSongs = async (songsId) => {
  const response = await axios.get('/songs')
  if(response) {
    let songArray = []
    for(const id of songsId) {
      songArray.push(response.data.find((res) => res.id == id))
    }
    data.value.listSong = [...songArray]
  }
}

const showSaveBtn = (id) => {
  stores.setVisiblePlayBtn(id)
}
const hiddenSaveBtn = () => {
  stores.setVisiblePlayBtn(null)
}

const onDragEnd = async () => {
  stores.listSong(data.value.listSong)
  await axios.patch(`/play-list/${idPlayList}`, {
    song_id: data.value.listSong.map(song => song.id)
  })
  getPlayListData()
}

const playSong = (index, listSong) => {
  stores.play(true)
  stores.index(index)
  stores.listSong(listSong)
  stores.playlistId(data.value.playListInfo.id)
}

onMounted(async() => {
  loadingState.value = true
  await new Promise(resolve => setTimeout(resolve, 400))
  getPlayListData()
  loadingState.value = false
})

const currentPlaylist = computed(() => stores.currentPlaylist)

// Phát cả playlist, dmm mãi mới xong cl này
const playPlayList = () => {
  const isSamePlaylist = currentPlaylist.value === data.value.playListInfo.id
  if (!isSamePlaylist) {
    // Phát playlist mới (auto chạy)
    stores.playlistId(data.value.playListInfo.id)
    playSong(0, data.value.listSong)
    nextTick(() => {
      stores.play(true)
      audio.value.play()
    })
  } else {
    // Chỉ toggle play/pause
    const toggle = !stores.isPlayingSong
    stores.play(toggle)
    if (toggle) {
      audio.value.play()
    } else {
      audio.value.pause()
    }
  }
}

const handleClickSearch = async () => {
  await handleSearch(data.value.keySearch)
}

const handleSearch = async (keySearch) => {
  try {
    if(typeof keySearch === 'string' && keySearch.trim()) {
      stores.setisSearch(true)
      stores.setKeySearch(keySearch)
      const response = await axios.get('/songs')
      if(response) {
        const songArray = response.data
        let keyArray = keySearch.replace(/\s+/g, '').toLowerCase().split('')
        for(const song of songArray) {
          let songName = song.song_name.replace(/\s+/g, '').toLowerCase().split('')
          let found = false
          for(let i = 0; i < keyArray.length; i++) {
            if(songName.includes(keyArray[i])) {
              found = true
              break
            }
          }
          if(found) {
            data.value.dataSearch.push(song)
          }
        }
        if(data.value.dataSearch.length > 0) {
          stores.setDataSearch(data.value.dataSearch)
        } else {
          stores.setDataSearch([])
        }
      }
      data.value.dataSearch = []
    }
    if(keySearch == '') {
      stores.setDataSearch([])
    }
  } catch (e) {
    console.log(e)
  }
}

const removePlaylist = async (songId) => {
  const newSongs = data.value.playListInfo.song_id.filter(item => item != songId)
  const response = await axios.patch(`/play-list/${idPlayList}`, {
    song_id: newSongs
  })
  if(response.status == 200) {
    getPlayListData()
  }
}

const openEdit = () => {
  stores.setisOpen(true)
}
</script>

<style scoped>
/* CSS để hiển thị hàng đang kéo */
.ghost-row {
  opacity: 0.5;
  background-color: #171717;
}
button:disabled {
  background-color: #38a169;
  cursor: not-allowed;
}
</style>



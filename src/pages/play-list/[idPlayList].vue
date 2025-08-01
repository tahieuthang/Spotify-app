<template>
  <div v-loading="loadingState" class="flex flex-col gap-15 bg-[#111111] rounded-xl px-7 py-8">
    <div class="flex gap-8">
      <div v-if="data.playListInfo.cover_url != ''" class="bg-cover">
        <img :src="data.playListInfo.cover_url" alt="ngot" class="rounded-sm w-[280px] h-[280px]" />
      </div>
      <div v-else class="flex items-center justify-center w-[280px] h-[280px] bg-neutral-700 rounded-sm">
        <i class="fa-solid fa-music text-7xl"></i>
      </div>
      <div class="flex flex-col justify-end items-start gap-3">
        <p class="font-bold text-lg">Danh sách phát công khai</p>
        <p class="font-extrabold text-7xl leading-[1.5] whitespace-nowrap overflow-hidden overflow-ellipsis">{{ data.playListInfo.name }}</p>
        <p class="font-bold text-gray-500">Của {{ data.ownerInfor.name }}</p>
        <div class="flex gap-3 items-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" alt="Spotify" class="w-6 h-6" />
          <p class="font-bold text-gray-500"><span class="font-bold text-lg text-white">Spotify</span> &bull; 2230 lượt lưu &bull; {{ data.playListInfo.song_id?.length || 0 }} bài hát</p>
        </div>
      </div>
      <div id="notification" class="hidden flex flex-col justify-start gap-2 bg-[#4cb3ff] rounded-xl p-5 h-32 w-100 fixed right-5 top-25 z-50">
        <div class="flex justify-between items-center">
          <p class="font-bold text-black text-xl">Bạn đã đăng xuất</p>
          <button @click="closeX" class="border-none cursor-pointer"><i class="fa-solid fa-xmark text-black text-2xl"></i></button>
        </div>
        <p class="font-semibold text-black text-lg">Đăng nhập để thêm bài hát vào Bài hát đã thích của bạn.</p>
      </div>
    </div>
    <div class="flex gap-4 items-center mb-1">
      <button @click="playPlayList" class="flex justify-center items-center rounded-full w-15 h-15 bg-green-500 hover:scale-105 hover:bg-green-400 cursor-pointer">
        <i v-if="isPlaying && currentPlaylist === data.playListInfo.id" class="fa-solid fa-pause text-2xl text-black"></i>
        <i v-else class="fa-solid fa-play text-2xl text-black"></i>
      </button>
      <!-- <button @click="savePlaylist" v-show="!isMyPlaylist" class="border-none cursor-pointer">
        <i v-if="existSave(data.playListInfo.id)" class="fa-solid fa-bookmark text-3xl hover:scale-110"></i>
        <i v-else class="fa-regular fa-bookmark text-3xl hover:scale-110"></i>
      </button> -->
    </div>

    <table>
      <thead>
          <tr class="border-b border-gray-700">
            <th class="font-semibold text-gray-500 text-xl text-center">#</th>
            <th class="font-semibold text-gray-500 text-lg">Tiêu đề</th>
            <th></th>
            <th class="text-center"><i class="fa-regular fa-clock font-semibold text-gray-500 text-lg"></i></th>
          </tr>
      </thead>
      <tbody>
          <tr v-for="(song, index) in data.listSong" :key="song.id" class="hover:bg-neutral-800 cursor-pointer"
           @mouseenter="() => showSaveBtn(song.id)" @mouseleave="() => hiddenSaveBtn()" @click="playSong(index, data.listSong)">
            <td class="font-semibold text-gray-500 text-2xl p-2 text-center pr-6" :class="{ '!text-green-500': currentSong.id == song.id && data.playListInfo.id == currentPlaylist }">{{ index + 1 }}</td>
            <td class="p-2">
              <div class="flex gap-2 items-center">
                <div class="w-13 h-13 bg-cover">
                  <img :src="song.cover_url" class="rounded-lg" />
                </div>
                <div class="flex flex-col">
                  <p class="font-semibold text-white text-lg" :class="{ '!text-green-500': currentSong.id == song.id && data.playListInfo.id == currentPlaylist }">{{ song.song_name }}</p>
                  <p class="font-semibold text-gray-500 text-lg">{{ song.author }}</p>
                </div>
              </div>
            </td>
            <td class="w-[40px]">
              <button v-if="existFav(song.id)" class="flex items-center justify-center w-5 h-5 rounded-full border-none bg-green-500 cursor-pointer"><i class="fa-solid fa-check text-xs text-black"></i></button>
              <button v-else v-show="visibleSave == song.id" @click.stop="addFavSong(song.id)" class="flex items-center justify-center w-5 h-5 rounded-full border border-neutral-800 border-2 cursor-pointer"><i class="fa-solid fa-plus text-xs"></i></button>
            </td>
            <td class="font-semibold text-gray-500 text-lg p-2 text-center">{{ song.time }}</td>
          </tr>
      </tbody>
    </table>
    <Footer />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Footer from '@/components/dashboard/Footer.vue'
import axios from '@/utils/axios'
import { computed, nextTick, onBeforeMount, onMounted, onUpdated, ref } from 'vue'
import { useCounterStore } from '@/stores/authStore'
import { useNotify } from '@/utils/useNotify'

const route = useRoute()
const stores = useCounterStore()
const userLogin = computed(() => stores.getUser)
const audio = computed(() => stores.getAudioRef)
const isAuthenticated = computed(() => stores.isLogged)
const loadingState = ref(false)

const data = ref({
  playListInfo: {},
  ownerInfor: {},
  listSong: [],
  privatePlaylist: []
})

const getPlayListData = async () => {
  const response = await axios.get('/play-list')
  if(response) {
    data.value.playListInfo = response.data.find((res) => res.id == route.params.idPlayList)
    getOwner(data.value.playListInfo.owner_id)
    getSongs(data.value.playListInfo.song_id)
  }
}

const getMyPlaylist = async () => {
  const response = await axios.get('/play-list', {
    params: {
      owner_id: userLogin.value?.id
    }
  })
  if(response) {
    data.value.privatePlaylist = response.data.map(res => res.id)
  }
}

const isMyPlaylist = computed(() => data.value.privatePlaylist.includes(data.value.playListInfo.id))

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

const getOwner = async (id) => {
  const response = await axios.get('/users')
  if(response) {
    data.value.ownerInfor = response.data.find((res) => res.id == id)
  }
}

let visibleSave = computed(() => stores.isVisible)
let isPlaying = computed(() => stores.isPlayingSong)
let currentSong = computed(() => stores.currentSong)
let storeSong = computed(() => stores.allSongs)

const showSaveBtn = (id) => {
  stores.setVisiblePlayBtn(id)
}
const hiddenSaveBtn = () => {
  stores.setVisiblePlayBtn(null)
}

const playSong = (index, listSong) => {
  stores.play(true)
  stores.index(index)
  stores.listSong(listSong)
}

onMounted(async() => {
  loadingState.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  getPlayListData()
  if(isAuthenticated.value) {
    getMyPlaylist()
  }
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

// Yêu thích bài hát
const { notify } = useNotify()
const addFavSong = async (songId) => {
  if(isAuthenticated.value) { 
    if(!userLogin.value.favourite_song.includes(songId)) {
      userLogin.value.favourite_song.push(songId)
    }
    console.log(userLogin.value.favourite_song);
    try {
      const response = await axios.patch(`/users/${userLogin.value.id}`, {
        favourite_song: userLogin.value.favourite_song,
      })
      console.log(response);
      
      if(response.status == 200) {
        notify('Đã thêm vào bài hát yêu thích', 'success')
        const newInfoUser = {
          id: userLogin.value.id,
          name: userLogin.value.name,
          password: userLogin.value.password,
          favourite_song: userLogin.value.favourite_song,
          save_playlist: userLogin.value.save_playlist
        }
        stores.setUser(newInfoUser)
      }
    } catch(e) {
      console.log(e)
    }
  } else {
    document.getElementById('notification').classList.remove('hidden')
  }
}

const existFav = (id) => {
  if(isAuthenticated.value) {
    if(userLogin.value?.favourite_song.includes(id)) {
      return true
    }
  } else {
    return false
  }
}

// const existSave = (playlistId) => {
//   if(isAuthenticated.value) {
//     console.log(userLogin.value.save_playlist);
    
//     if(userLogin.value?.save_playlist.includes(playlistId)) {
//       return true
//     } else {
//       return false
//     }
//   }
// }

// const savePlaylist = async () => {
//   if(isAuthenticated.value) {
//     if(!existSave(data.value.playListInfo.id)) {
//       const newSaves = userLogin.value?.save_playlist.push(data.value.playListInfo.id)
//       const response = await axios.patch(`/users/${userLogin.value.id}`, {
//         save_playlist: newSaves
//       })
//       if(response.status == 200) {
//         notify('Đã thêm danh sách phát yêu thích', 'success')
//         const newInfoUser = {
//           id: userLogin.value.id,
//           name: userLogin.value.name,
//           password: userLogin.value.password,
//           favourite_song: userLogin.value.favourite_song,
//           save_playlist: userLogin.value.save_playlist
//         }
//         stores.setUser(newInfoUser)
//       }
//     } else {
//       const newSaves = userLogin.value?.save_playlist.filter(item => item.id != data.value.playListInfo.id)
//       const response = await axios.patch(`/users/${userLogin.value.id}`, {
//         save_playlist: newSaves
//       })
//       if(response.status == 200) {
//         notify('Xóa danh sách phát yêu thích', 'success')
//         const newInfoUser = {
//           id: userLogin.id,
//           name: userLogin.name,
//           password: userLogin.password,
//           favourite_song: userLogin.favourite_song,
//           save_playlist: userLogin.save_playlist
//         }
//         stores.setUser(newInfoUser)
//       }
//     }
//   }
// }

const closeX = () => {
  const state = !stores.isClose
  stores.setIsClose(state)
  if(state) {
    document.getElementById('notification').classList.add('hidden')
  }
}
</script>
<template>
  <div class="flex items-center justify-between px-[18px]">
    <div class="flex items-center">
      <div class="mr-6 cursor-pointer">
        <img src="https://img.icons8.com/ios-filled/50/ffffff/spotify--v1.png" alt="spotify" class="mr-2 h-11 w-11" />
      </div>
      <div class="mr-3">
        <button @click="goHome" class="cursor-pointer rounded-full w-16 h-16 bg-neutral-800 p-2 hover:bg-neutral-600 transition">
          <i class="fa-solid fa-house text-white text-2xl"></i>
        </button>
      </div>
      <div class="flex items-center bg-neutral-800 text-white rounded-full px-6 py-2 w-[500px] h-16">
        <!-- Icon search -->
        <button @click="handleClickSearch" class="border-none">
          <i class="fas fa-search text-neutral-400 text-3xl mr-4 cursor-pointer hover:text-white transition"></i>
        </button>
        <!-- Input -->
        <input
          type="text"
          placeholder="Bạn muốn phát nội dung gì?"
          class="bg-transparent outline-none placeholder-neutral-400 text-xl flex-1"
          @keyup.enter="handleClickSearch"
          v-model="data.keySearch"
        />
        <!-- Divider -->
        <div class="w-px h-5 bg-neutral-700 mx-5"></div>
        <!-- Icon clear/delete -->
        <button>
          <i class="fa-solid fa-filter text-neutral-400 hover:text-white transition cursor-pointer text-2xl"></i>
        </button>
      </div>
    </div>

    <div class="flex justify-center items-center gap-4">
      <button class="flex justify-center items-center rounded-full p-4 bg-white w-[200px] h-[38px] ml-[300px] cursor-pointer transform hover:scale-102">
        <span class="text-black font-bold text-lg">Khám phá premium</span>
      </button>
      
      <button class="border-none cursor-pointer text-neutral-400 font-medium text-lg transform hover:scale-102 hover:text-white">
        <span>Cài đặt ứng dụng</span>
      </button>

      <!-- Khi đã đăng nhập -->
     <div class="flex justify-center items-center gap-4" v-if="isAuthenticated">
        <i class="fa-solid fa-bell text-white text-xl cursor-pointer"></i>

        <!-- Group hover wrapper -->
        <div class="relative group">
          <div class="flex items-center justify-center cursor-pointer rounded-full w-16 h-16 bg-neutral-800">
            <div class="flex items-center justify-center rounded-full w-11 h-11 bg-amber-900 p-2">
              <i class="fa-solid fa-user text-white text-lg"></i>
            </div>
          </div>

          <!-- Dropdown menu -->
          <div class="hidden group-hover:flex flex-col w-[200px] h-[100px] bg-neutral-800 rounded-sm p-3 absolute top-[72px] right-0 z-50">
            <ul class="w-full">
              <router-link to="/profile">
                <li class="font-bold text-white mb-5 hover:text-green-500 cursor-pointer">Tài khoản</li>
              </router-link>
              <li @click="logout" class="font-bold text-white hover:text-red-400 cursor-pointer">
                <button class="border-none bg-transparent">Đăng xuất</button>
              </li>
            </ul>
          </div>
        </div>
      </div>


      <!-- Khi chưa đăng nhập -->
      <div class="flex justify-center items-center gap-4" v-else>
        <router-link to="/register">
          <button class="border-none cursor-pointer text-neutral-400 font-medium text-xl transform hover:scale-102 hover:text-white">
            <span>Đăng ký</span>
          </button>
        </router-link>
        <router-link to="/login">
          <button to="/login" class="flex justify-center items-center rounded-full p-4 bg-white w-[150px] h-16 cursor-pointer transform hover:scale-102">
            <span class="text-black font-bold text-lg">Đăng nhập</span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from '@/utils/axios'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotify } from '@/utils/useNotify'
import { useCounterStore } from '@/stores/authStore'

const data = ref({
  playListInfo: {},
  listSong: [],
  keySearch: "",
  dataSearch: []
})
const stores = useCounterStore()
const isAuthenticated = computed(() => stores.isLogged)
const router = useRouter()

const logout = () => {
  const authToken = stores.isLogged
  if(authToken) {
    localStorage.removeItem('Authorization')
    localStorage.removeItem('userInfo')
  }
  location.reload()
  router.push('/')
}

const goHome = () => {
  router.push('/')
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
        searchSong(response, keySearch)
      }
      router.push('/search')
      data.value.dataSearch = []
      data.value.keySearch = ''
    }
    if(keySearch == '') {
      stores.setDataSearch([])
    }
  } catch (e) {
    console.log(e)
  }
}

const searchSong = (response, keySearch) => {
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
      stores.setKeySearch(keySearch)
      searchPlaylist(data.value.dataSearch[0].id)
    } else {
      stores.setDataSearch([])
      stores.setKeySearch(keySearch)
    }
}

const searchPlaylist = async (songId) => {
  const response = await axios.get('/play-list')
  if(response) {
    const relatedSearch = response.data.filter(res => res.song_id.includes(songId))
    if(relatedSearch.length > 0) {
      stores.setPlaylistSearch(relatedSearch)
    } else {
      stores.setPlaylistSearch([])
    }
  }
}
</script>

<template>
  <div v-loading="loadingState" class="flex flex-col gap-16 bg-[#111111] rounded-xl px-8 py-9">
    <div v-if="data.dataSearch != ''" class="flex gap-5">
      <div class="w-2/5">
        <p class="font-bold text-[30px] mb-3 max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis">Kết quả hàng đầu cho "{{ data.keySearch }}"</p>
        <div @mouseenter="() => showPlayBtn(data.dataSearch[0]?.id)" @mouseleave="() => hiddenPlayBtn()" class="relative flex flex-col bg-neutral-900 p-7 rounded-lg justify-start gap-4 h-80 transition-colors duration-300 hover:bg-neutral-800">
          <div class="bg-cover">
            <img :src="data.dataSearch[0]?.cover_url" alt="ngot" class="rounded-sm w-[120px] h-[120px]" />
          </div>
          <p class="font-bold text-4xl mt-2">{{ data.dataSearch[0]?.song_name }}</p>
          <div class="flex gap-3 items-center">
            <p class="font-bold text-white"><span class="font-bold text-lg text-gray-500">Bài hát</span> &bull; {{ data.dataSearch[0]?.author }}</p>
          </div>
          <button v-show="isVisiblePlay === data.dataSearch[0]?.id" class="rounded-full w-16 h-16 p-2 bg-green-500 absolute right-6 top-58 hover:scale-105 hover:bg-green-400 cursor-pointer">
            <i class="fa-solid fa-play text-3xl text-black"></i>
          </button>
        </div>
      </div>
      <div class="w-3/5">
        <p class="font-bold text-[30px] mb-3">Bài hát</p>
        <ul v-for="data in data.dataSearch" :key="data.id" class="mr-8">
          <li @mouseenter="() => showSaveBtn(data.id)" @mouseleave="() => hiddenSaveBtn()" class="flex justify-between hover:bg-neutral-800 hover:rounded-lg cursor-pointer p-3">
            <div class="flex gap-2">
              <div class="w-13 h-13 bg-cover">
                <img :src="data.cover_url" class="rounded-lg" />
              </div>
              <div class="flex flex-col">
                <p class="font-semibold text-white text-lg">{{ data.song_name }}</p>
                <p class="font-semibold text-gray-500 text-lg">{{ data.author }}</p>
              </div>
            </div>
            <div class="flex items-center justify-center gap-7">
              <button v-if="existFav(data.id)" class="flex items-center justify-center w-5 h-5 rounded-full border-none bg-green-500 cursor-pointer">
                <i class="fa-solid fa-check text-xs text-black"></i>
              </button>
              <button v-else @click.stop="addFavSong(data.id)" v-show="isVisibleSave == data.id" class="flex items-center justify-center w-5 h-5 rounded-full border border-neutral-800 border-2 cursor-pointer">
                <i class="fa-solid fa-plus text-xs"></i>
              </button>
              <span class="font-semibold text-gray-500 text-lg p-2 text-center">{{ data.time }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="flex justify-center items-center mt-10 font-bold text-neutral-600 text-[30px] mb-3">
      <i class="fas fa-search text-neutral-600 text-3xl mr-4 hover:text-white transition"></i>
      Không có kết quả nào với từ khóa "{{ data.keySearch }}"
    </div>
    
    <div class="flex flex-col gap-5">
      <p class="text-3xl font-bold">Playlist có sự xuất hiện của "{{ data.dataSearch[0]?.song_name }}"</p>
      <div class="relative">
        <template v-if="data.relatedPlaylist.length > 6">
          <Swiper
            :modules="[Navigation]"
            :slides-per-view="6"
            :space-between="10"
            :loop="true"
            :navigation="navigationOptions"
            class="mySwiper flex gap-3"
          >
            <SwiperSlide v-for="(playList, index) in data.relatedPlaylist" :key="playList.id">
              <ItemPlayList :playListData="playList" @clickCard="handleClickCard" />
            </SwiperSlide>
          </Swiper>
          <div ref="prevEl" class="swiper-button-prev custom-nav"></div>
          <div ref="nextEl" class="swiper-button-next custom-nav"></div>
        </template>
        <template v-else>
          <div class="flex gap-3">
            <ItemPlayList v-for="(playList, index) in data.relatedPlaylist" :key="playList.id" :playListData="playList" @clickCard="handleClickCard" @mouseenter="() => showPlayListBtn(playList.id)" @mouseleave="() => hiddenPlayListBtn()" />
          </div>
        </template>
      </div>
    </div>

    <Footer />
  </div>
  <div id="notification" class="hidden flex flex-col justify-start gap-2 bg-[#4cb3ff] rounded-xl p-5 h-32 w-100 fixed right-5 top-25 z-50">
    <div class="flex justify-between items-center">
      <p class="font-bold text-black text-xl">Bạn đã đăng xuất</p>
      <button @click="closeX" class="border-none cursor-pointer"><i class="fa-solid fa-xmark text-black text-2xl"></i></button>
    </div>
    <p class="font-semibold text-black text-lg">Đăng nhập để thêm bài hát vào Bài hát đã thích của bạn.</p>
  </div>
</template>

<script setup>
import Footer from '@/components/dashboard/Footer.vue'
import ItemPlayList from '@/components/music/ItemPlayList.vue'
import axios from '@/utils/axios'
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useNotify } from '@/utils/useNotify'
import { useCounterStore } from '@/stores/authStore'

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const stores = useCounterStore()
const isAuthenticated = computed(() => stores.isLogged)
const data = ref({
  dataSearch: [],
  keySearch: "",
  relatedPlaylist: []
})
const loadingState = ref(false)
const isVisiblePlay = computed(() => stores.isVisible)
const isVisibleSave = computed(() => stores.isVisiblePlayList)

onMounted(async() => {
  loadingState.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  data.value.dataSearch = [...stores.getDataSearch].slice(0, 4)
  data.value.relatedPlaylist = [...stores.getPlaylistSearch]
  const keyCopy = stores.getKeySearch
  data.value.keySearch = keyCopy
  loadingState.value = false
})

watch([() => stores.getDataSearch, () => stores.getPlaylistSearch, () => stores.getKeySearch], async ([newData, newPlaylist, newKey]) => {
  loadingState.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  data.value.dataSearch = [...newData].slice(0, 4)
  data.value.relatedPlaylist = [...newPlaylist]
  data.value.keySearch = newKey
  loadingState.value = false
})

// Ẩn nút play icon
const showPlayBtn = (id) => {
  stores.setVisiblePlayBtn(id)
}
const hiddenPlayBtn = (id) => {
  stores.setVisiblePlayBtn(null)
}

const showSaveBtn = (id) => {
  stores.setVisiblePlayListBtn(id)
}
const hiddenSaveBtn = () => {
  stores.setVisiblePlayListBtn(null)
}

const userLogin = computed(() => stores.getUser)
const existFav = (id) => {
  if(isAuthenticated.value) {
    if(userLogin.value?.favourite_song.includes(id)) {
      return true
    }
  } else {
    return false
  }
}

const { notify } = useNotify()
const addFavSong = async (songId) => {
  if(isAuthenticated.value) { 
    const userLogin = stores.getUser
    if(!userLogin.favourite_song.includes(songId)) {
      userLogin.favourite_song.push(songId)
    }
    const response = await axios.patch(`/users/${userLogin.id}`, {
      favourite_song: userLogin.favourite_song,
    })
    if(response.status == 200) {
      notify('Đã thêm vào bài hát yêu thích', 'success')
      const newInfoUser = {
        id: userLogin.id,
        name: userLogin.name,
        password: userLogin.password,
        favourite_song: userLogin.favourite_song,
        save_playlist: userLogin.save_playlist
      }
      stores.setUser(newInfoUser)
    }
  } else {
    document.getElementById('notification').classList.remove('hidden')
  }
}

const closeX = () => {
  const state = !stores.isClose
  stores.setIsClose(state)
  if(state) {
    document.getElementById('notification').classList.add('hidden')
  }
}
</script>

<template>
  <!-- Sidebar trước khi login or chưa tạo playlist nào -->
  <div v-if="!isAuthenticated" class="flex flex-col gap-15 bg-[#111111] rounded-xl px-3 py-7">
    <div class="flex justify-between mx-7">
      <p class="font-bold text-xl">Thư viện</p>
      <i class="fa-solid fa-plus text-2xl text-gray-500"></i>
    </div>
    <div class="flex flex-col justify-start bg-neutral-800 rounded-xl px-6 py-5 gap-2">
      <p class="font-bold text-xl">Tạo danh sách đầu tiên của bạn</p>
      <p class="font-bold text-sm mb-4">Rất dễ! Chúng tôi sẽ giúp bạn</p>
      <button @click="openNotification" class="flex justify-center items-center rounded-full p-4 bg-white w-[200px] h-[38px] cursor-pointer transform hover:scale-102">
        <span class="text-black font-bold text-lg">Tạo danh sách phát</span>
      </button>
    </div>

    <div class="flex flex-col justify-start bg-neutral-800 rounded-xl px-6 py-5 gap-2 mt-[-30px]">
      <p class="font-bold text-xl">Hãy cùng tìm và theo dõi một số podcast</p>
      <p class="font-bold text-sm mb-4">Chúng tôi sẽ cập nhật  cho bạn thông tin về tập mới</p>
      <button class="flex justify-center items-center rounded-full p-4 bg-white w-[200px] h-[38px] cursor-pointer transform hover:scale-102">
        <span class="text-black font-bold text-lg">Duyệt xem podcast</span>
      </button>
    </div>
    <div id="creatplaylist" class="hidden flex flex-col justify-start gap-2 bg-[#4cb3ff] rounded-xl p-5 h-32 w-100 fixed right-5 top-25 z-50">
      <div class="flex justify-between items-center">
        <p class="font-bold text-black text-xl">Bạn đã đăng xuất</p>
        <button @click="closeX" class="border-none cursor-pointer"><i class="fa-solid fa-xmark text-black text-2xl"></i></button>
      </div>
      <p class="font-semibold text-black text-lg">Đăng nhập để tạo danh sách phát của riêng bạn.</p>
    </div>
  </div>

  <!-- Sidebar sau khi login or đã tạo playlist -->
  <div v-else class="flex flex-col gap-1 bg-[#111111] rounded-xl px-3 py-7">
    <div class="flex justify-between mx-2 mb-8">
      <p class="font-bold text-xl">Thư viện</p>
    </div>
    <div class="flex justify-between mx-2 mb-8">
      <div class="flex justify-center items-center rounded-full p-4 bg-neutral-800 w-[100px] h-[38px]">
        <span class="font-medium text-lg text-white">Playlist</span>
      </div>
      <button @click="createPlaylist" class="border-none cursor-pointer hover:rounded-full hover:bg-neutral-800 w-10 h-10">
        <i class="fa-solid fa-plus text-2xl text-gray-500"></i>
      </button>
    </div>
    <div class="flex flex-col cursor-pointer" v-for="(playlist, index) in playlistData" :key="playlist?.id" @click="openPlaylist(playlist.id)">
      <div class="flex gap-3 items-center hover:bg-neutral-800 p-3 hover:rounded-xl" :class="{ 'bg-neutral-800 rounded-xl': playlist.id == route.params.idMyPlaylist }">
        <div v-if="playlist.cover_url" class="bg-cover">
          <img :src="playlist?.cover_url" alt="ngot" class="rounded-lg w-16 h-16" />
        </div>
        <div v-else class="flex items-center justify-center w-16 h-16 bg-cover bg-neutral-700">
          <i class="fa-solid fa-music text-white text-2xl"></i>
        </div>
        <div class="flex flex-col">
          <p class="font-medium text-lg text-white" :class="{ '!text-green-500': playlist.id == currentPlaylist }">{{ playlist?.name }}</p>
          <p class="font-medium text-lg text-gray-500">Danh sách phát &bull; Spotify</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ngotImage from '@/assets/images/ngot.png';
import axios from '@/utils/axios'
import { ref, computed, onMounted, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotify } from '@/utils/useNotify'
import { useCounterStore } from '@/stores/authStore'
import { eventBus } from '@/utils/eventBus'

const stores = useCounterStore()
const userLogin = computed(() => stores.getUser)
const isAuthenticated = computed(() => stores.isLogged)
const currentPlaylist = computed(() => stores.currentPlaylist)
const router = useRouter()
const route = useRoute()
const playlistData = ref([])

const createPlaylist = async () => {
  const response = await axios.post('/play-list', {
    name: `Danh sách phát`,
    cover_url: "",
    owner_id: userLogin.value.id,
    song_id: [],
    saved_by: []
  })
  
  if(response.status == 201) {
    router.push(`/library/${response.data.id}`)
    getPlayListData()
  }
}

const getPlayListData = async () => {
  const response = await axios.get('/play-list', {
    params: {
      owner_id: userLogin.value?.id
    }
  })
  if(response) {
    playlistData.value = response.data
  }
}

const eventHandlers = {
  callApi: () => getPlayListData()
}

onMounted(() => {
  if(isAuthenticated.value) {
    getPlayListData()
  }
  for (const [eventName, handler] of Object.entries(eventHandlers)) {
    eventBus.on(eventName, handler)
  }
})

onBeforeMount(() => {
  for (const [eventName, handler] of Object.entries(eventHandlers)) {
    eventBus.off(eventName, handler)
  }
});

const openPlaylist = (id) => {
  router.push(`/library/${id}`)
}

const isOpen = ref(false)

const openNotification = () => {
  document.getElementById('creatplaylist').classList.remove('hidden')
}

const closeX = () => {
  const state = !isOpen.value
  if(state) {
    document.getElementById('creatplaylist').classList.add('hidden')
  }
}
</script>

<template>
  <div class="flex flex-col gap-15 bg-neutral-900 rounded-xl px-12 py-10">
    <div class="flex flex-col gap-5">
      <p class="text-3xl font-bold">Những bài hát thịnh hành</p>
      <div class="relative">
        <Swiper
          :modules="[Navigation]"
          :slides-per-view="5"
          :space-between="10"
          :loop="true"
          :navigation="navigationOptions"
          class="mySwiper flex gap-3"
        >
          <SwiperSlide v-for="(song, index) in data.songsData" :key="song.id">
            <ItemSong :songData="song" @clickSong="handleClickSong" @mouseenter="() => showPlayBtn(song.id)" @mouseleave="() => hiddenPlayBtn()" />
          </SwiperSlide>
        </Swiper>
        <div ref="prevEl" class="swiper-button-prev custom-nav"></div>
        <div ref="nextEl" class="swiper-button-next custom-nav"></div>
      </div>
    </div>

    <div class="flex flex-col gap-5">
      <p class="text-3xl font-bold">Album và đĩa đơn nổi tiếng</p>
      <div class="relative">
        <Swiper
          :modules="[Navigation]"
          :slides-per-view="5"
          :space-between="10"
          :loop="true"
          :navigation="navigationOptions"
          class="mySwiper flex gap-3"
        >
          <SwiperSlide v-for="(playList, index) in data.playListData" :key="playList.id">
            <ItemPlayList :playListData="playList" @clickCard="handleClickCard" @mouseenter="() => showPlayListBtn(playList.id)" @mouseleave="() => hiddenPlayListBtn()" />
          </SwiperSlide>
        </Swiper>
        <div ref="prevEl" class="swiper-button-prev custom-nav"></div>
        <div ref="nextEl" class="swiper-button-next custom-nav"></div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import ItemSong from '@/components/music/ItemSong.vue'
import ItemPlayList from '@/components/music/ItemPlayList.vue'
import Footer from '@/components/dashboard/Footer.vue'
import axios from '@/utils/axios'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotify } from '@/utils/useNotify'
import { useCounterStore } from '@/stores/authStore'

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const data = ref({
  songsData: [],
  playListData: []
})
const stores = useCounterStore()

const getSongData = async () => {
  const response = await axios.get('/songs')
  if(response) {
    data.value.songsData = response.data
  }
}

const getPlayListData = async () => {
  const response = await axios.get('/play-list')
  if(response) {
    data.value.playListData = response.data
  }
}

const prevEl = ref(null)
const nextEl = ref(null)
const navigationOptions = ref({})

onMounted(async() => {
  getSongData()
  getPlayListData()
  navigationOptions.value = {
    prevEl: prevEl.value,
    nextEl: nextEl.value,
  }
})

// Ẩn nút play icon
const showPlayBtn = (id) => {
  stores.setVisiblePlayBtn(id)
}
const showPlayListBtn = (id) => {
  stores.setVisiblePlayListBtn(id)
}

const hiddenPlayBtn = () => {
  stores.setVisiblePlayBtn(null)
}
const hiddenPlayListBtn = () => {
  stores.setVisiblePlayListBtn(null)
}

const router = useRouter()
const handleClickCard = (playListId) => {
  router.push(`/play-list/${playListId}`)
}

const playSong = (index, listSong) => {
  stores.play(true)
  stores.index(index)
  stores.listSong(listSong)
  data.value.currentSong = listSong[index]
}

const handleClickSong = async (songId) => {
  const indexSong = data.value.songsData.findIndex(song => song.id == songId)
  playSong(indexSong, data.value.songsData)
}
</script>

<style scoped>
.custom-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background-color: #1F2937;
  width: 40px;
  height: 40px;
  color: white;
}

.swiper-button-prev::after,
.swiper-button-next::after {
  font-size: 16px;
}
</style>

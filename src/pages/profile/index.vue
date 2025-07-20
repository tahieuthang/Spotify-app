<template>
  <div class="flex flex-col gap-15 bg-gradient-to-b from-neutral-600 to-black rounded-xl px-7 py-8 ">
    <div class="flex gap-8">
      <div class="w-[250px] h-[250px] bg-cover">
        <img :src="ngotImg" alt="ngot" class="rounded-full" />
      </div>
      <div class="flex flex-col justify-end items-start gap-5">
        <p class="font-bold text-lg">Hồ sơ</p>
        <p class="font-extrabold text-8xl">{{ userinfo.name }}</p>
        <div class="flex gap-3 items-center">
          <p class="font-bold text-gray-500"><span class="font-bold text-lg text-white">2 danh sách phát công khai</span> &bull; {{ userinfo.favourite_song.length }} bài hát yêu thích</p>
        </div>
      </div>
    </div>

    <table>
      <thead>
          <tr class="border-b border-gray-700">
            <th class="font-semibold text-gray-500 text-xl text-center">#</th>
            <th class="font-semibold text-gray-500 text-lg">Tiêu đề</th>
            <th class="text-center"><i class="fa-regular fa-clock font-semibold text-gray-500 text-lg"></i></th>
            <th></th>
          </tr>
      </thead>
      <tbody>
          <tr v-for="(song, index) in favSongs" :key="song.id" class="hover:bg-neutral-800 cursor-pointer"
           @mouseenter="() => showSaveBtn(song.id)" @mouseleave="() => hiddenSaveBtn()" @click="playSong(index, favSongs)">
            <td class="font-semibold text-gray-500 text-2xl p-2 text-center pr-6" :class="{ '!text-green-500': currentSong.id == song.id }">{{ index + 1 }}</td>
            <td class="p-2">
              <div class="flex gap-2 items-center">
                <div class="w-13 h-13 bg-cover">
                  <img :src="song.cover_url" class="rounded-lg" />
                </div>
                <div class="flex flex-col">
                  <p class="font-semibold text-white text-lg" :class="{ '!text-green-500': currentSong.id == song.id }">{{ song.song_name }}</p>
                  <p class="font-semibold text-gray-500 text-lg">{{ song.author }}</p>
                </div>
              </div>
            </td>
            <td class="font-semibold text-gray-500 text-lg p-2 text-center">{{ song.time }}</td>
            <td><i @click="(event) => { event.stopPropagation(); addFavSong(song.id); }" class="fa-solid fa-ellipsis cursor-pointer"></i></td>
          </tr>
      </tbody>
    </table>
    <Footer />
  </div>
</template>

<script setup>
import ngotImg from '@/assets/images/ngot.png'
import Footer from '@/components/dashboard/Footer.vue'
import axios from '@/utils/axios'
import { computed, nextTick, onBeforeMount, onMounted, onUpdated, ref } from 'vue'
import { useCounterStore } from '@/stores/authStore'

const stores = useCounterStore()
const userinfo = computed(() => stores.getUser)
const songsId = userinfo.value.favourite_song
const favSongs = ref([])

const getFavSongs = async () => {
  const response = await axios.get('/songs')
  if(response) {
    let songArray = []
    console.log(songsId);
    for(const id of songsId) {
      songArray.push(response.data.find((res) => res.id == id))
    }
    favSongs.value = [...songArray]
    console.log();
    
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

onMounted(() => {
  getFavSongs()
})
</script>

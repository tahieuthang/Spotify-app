<template>
  <!-- Sidebar trước khi login or chưa tạo playlist nào -->
  <div v-if="!isAuthenticated" class="flex flex-col gap-15 bg-neutral-900 rounded-xl px-3 py-7">
    <div class="flex justify-between mx-7">
      <p class="font-bold text-xl">Thư viện</p>
      <i class="fa-solid fa-plus text-2xl text-gray-500"></i>
    </div>
    <div class="flex flex-col justify-start bg-neutral-800 rounded-xl px-6 py-5 gap-2">
      <p class="font-bold text-xl">Tạo danh sách đầu tiên của bạn</p>
      <p class="font-bold text-sm mb-4">Rất dễ! Chúng tôi sẽ giúp bạn</p>
      <button class="flex justify-center items-center rounded-full p-4 bg-white w-[200px] h-[38px] cursor-pointer transform hover:scale-102">
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
  </div>

  <!-- Sidebar sau khi login or đã tạo playlist -->
  <div v-else class="flex flex-col gap-8 bg-neutral-900 rounded-xl px-3 py-7">
    <div class="flex justify-between mx-2">
      <p class="font-bold text-xl">Thư viện</p>
    </div>
    <div class="flex justify-between mx-2">
      <div class="flex justify-center items-center rounded-full p-4 bg-neutral-800 w-[100px] h-[38px]">
        <span class="font-medium text-lg text-white">Playlist</span>
      </div>
      <button class="border-none cursor-pointer hover:rounded-full hover:bg-neutral-800 w-10 h-10">
        <i class="fa-solid fa-plus text-2xl text-gray-500"></i>
      </button>
    </div>
    <div class="flex flex-col">
      <div class="flex gap-3 hover:bg-neutral-800 p-3 hover:rounded-xl">
        <div class="w-16 h-16 bg-cover">
          <img :src="ngotImage" alt="ngot" class="rounded-lg" />
        </div>
        <div class="flex flex-col">
          <p class="font-medium text-lg text-white">Cái đầu tiên</p>
          <p class="font-medium text-lg text-gray-500">Danh sách phát &bull; Spotify</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ngotImage from '@/assets/images/ngot.png';
import axios from '@/utils/axios'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotify } from '@/utils/useNotify'
import { useCounterStore } from '@/stores/authStore'

const stores = useCounterStore()
const isAuthenticated = computed(() => stores.isLogged)

</script>

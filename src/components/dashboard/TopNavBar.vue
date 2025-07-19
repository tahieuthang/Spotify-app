<template>
  <div class="flex items-center justify-between px-[18px]">
    <div class="flex items-center">
      <div class="mr-6 cursor-pointer">
        <img src="https://img.icons8.com/ios-filled/50/ffffff/spotify--v1.png" alt="spotify" class="mr-2 h-11 w-11" />
      </div>
      <div class="mr-3">
        <button class="cursor-pointer rounded-full w-16 h-16 bg-neutral-800 p-2 hover:bg-neutral-600 transition">
          <i class="fa-solid fa-house text-white text-2xl"></i>
        </button>
      </div>
      <div class="flex items-center bg-neutral-800 text-white rounded-full px-6 py-2 w-[500px] h-16">
        <!-- Icon search -->
        <i class="fas fa-search text-neutral-400 text-3xl mr-4 cursor-pointer hover:text-white transition"></i>
        <!-- Input -->
        <input
          type="text"
          placeholder="Bạn muốn phát nội dung gì?"
          class="bg-transparent outline-none placeholder-neutral-400 text-xl flex-1"
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
      <div class="flex justify-center items-center gap-4 relative" v-if="isAuthenticated">
        <i class="fa-solid fa-bell text-white text-xl"></i>
        <div @click="dropdown" class="flex items-center justify-center cursor-pointer rounded-full w-16 h-16 bg-neutral-800">
          <div class="flex items-center justify-center rounded-full w-11 h-11 bg-amber-900 p-2">
            <i class="fa-solid fa-user text-white text-lg"></i>
          </div>
        </div>
        <div id="profile" class="w-[200px] h-[100px] bg-neutral-800 rounded-sm p-3 absolute top-18 right-0">
          <ul class="w-full">
            <router-link><li class="font-bold text-white mb-5">Tài khoản</li></router-link>
            <li @click="logout" class="font-bold text-white"><button class="border-none">Đăng xuất</button></li>
          </ul>
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

const stores = useCounterStore()
const isAuthenticated = computed(() => stores.isLogged)

const dropdown = () => {
  const isOpen = !stores.getIsDropDown
  stores.setIsDropDown(isOpen)
  const profileElement = document.getElementById('profile');
  if (isOpen) {
    profileElement.classList.remove('hidden');
  } else {
    profileElement.classList.add('hidden');
  }
}

const logout = () => {
  const authToken = localStorage.getItem('Authorization')
  if(authToken) {
    localStorage.removeItem('Authorization')
    localStorage.removeItem('userInfo')
    stores.setUser(null)
  }
  location.reload()
}
</script>

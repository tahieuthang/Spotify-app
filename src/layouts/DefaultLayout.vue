<template>
  <div class="flex flex-col gap-4 h-screen w-full bg-black p-3 overflow-hidden">
    <TopNavbar />
    <div class="h-screen flex gap-3 overflow-hidden">
      <SideBar class="w-1/4 overflow-y-auto" />
      <div class="w-3/4 flex flex-col overflow-y-auto">
        <router-view :key="$route.fullPath"/>
      </div>
    </div>
    <MusicPlayerBar/>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TopNavbar from '@/components/dashboard/TopNavbar.vue'
import Footer from '@/components/dashboard/Footer.vue'
import SideBar from '@/components/dashboard/SideBar.vue'
import MusicPlayerBar from '@/components/dashboard/MusicPlayerBar.vue'

</script>

<style scoped>
::-webkit-scrollbar {
    width: 5px;
    height: 1px;
  }

  ::-webkit-scrollbar-track {
    background: black;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style>
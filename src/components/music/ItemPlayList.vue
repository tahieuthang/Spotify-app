<template>
  <div @click="handleClickCard" class="flex flex-col gap-2 p-4 hover:rounded-xl hover:bg-neutral-800 max-h-[290px] relative">
    <div class="w-40 h-40 bg-cover">
      <img :src="playListData.cover_url" alt="cover" class="rounded-lg" />
    </div>
    <p class="font-medium text-lg text-white whitespace-nowrap overflow-hidden overflow-ellipsis">{{ playListData.name }}</p>
    <p class="font-medium text-lg text-gray-500">Của {{ ownerData.name }}</p>
    <button v-show="isVisible === playListData.id" class="rounded-full w-13 h-13 p-2 bg-green-500 absolute left-30 top-30 hover:scale-105 hover:bg-green-400 cursor-pointer"><i class="fa-solid fa-play text-xl text-black"></i></button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useCounterStore } from '@/stores/authStore'
import axios from '@/utils/axios'
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  playListData: {
    type: Object,
    required: true
  }
})
const ownerData = ref({})
const stores = useCounterStore()
const isVisible = computed(() => stores.isVisiblePlayList)
const getOwnerData = async () => {
  const response = await axios.get('/users')
  if(response) {
    const obj = response.data.find((res) => res.id == props.playListData.owner_id)
    ownerData.value = obj || null
  }
}

onMounted(() => {
  getOwnerData()
})

const emit = defineEmits(['ClickCard'])
const handleClickCard = () => {
  emit('ClickCard', props.playListData.id)
}
</script>
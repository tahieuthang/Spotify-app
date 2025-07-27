<template>
  <div class="fixed inset-0 flex items-center justify-center">
    <div class="flex flex-col gap-4 px-8 py-7 w-[630px] h-[430px] bg-neutral-800 rounded-xl">
      <div class="flex justify-between items-center">
        <h2 class="font-bold text-3xl">Sửa thông tin chi tiết</h2>
        <button @click="closeEdit" class="border-none rounded-full hover:bg-neutral-500 w-10 h-10 px-2 py-2"><i class="fa-solid fa-xmark text-white text-2xl"></i></button>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="flex gap-3">
          <div v-if="previewImage || playlistClone.cover_url" @click="triggerInput" @mouseenter="showSquare" @mouseleave="hiddenSquare" class="relative bg-cover">
            <button type="button" @click.stop="removeImage" class="border-none bg-neutral-900 bg-opacity-70 rounded-full w-[65px] h-[30px] absolute right-0 top-1 z-40 text-sm font-bold cursor-pointer">Xóa ảnh</button>
            <img :src="previewImage != '' ? previewImage : playlistClone.cover_url" alt="ngot" class="rounded-sm w-[200px] h-[200px]" />
            <div class="absolute inset-0 bg-black opacity-0 transition-opacity duration-10 ease-in-out hover:opacity-70 z-30"></div>
          </div>
          <div v-else @click="triggerInput" @mouseenter="showSquare" @mouseleave="hiddenSquare" class="flex items-center justify-center w-[200px] h-[200px] bg-neutral-700 rounded-sm">
            <div v-if="hoverItem" class="flex flex-col items-center justify-center">
              <i class="fa-solid fa-pen-to-square text-5xl"></i>
              <p class="font-bold text-sm text-white text-xl">Chọn ảnh</p>
            </div>
            <i v-else class="fa-solid fa-music text-5xl text-white"></i>
          </div>
          <input ref="fileInput" type="file" class="hidden" @change="handlerFileChange" accept="image/png, image/jpeg" >
          <div class="flex flex-grow flex-col gap-2">
            <input class="h-13 p-3 rounded-sm border-1 border-gray-500 font-bold placeholder:font-bold bg-neutral-800 focus:outline-none focus:bg-neutral-700" type="text" v-model="playlistClone.name" placeholder="Thêm tên">
            <input class="flex justify-start items-start px-1 py-2 h-full rounded-sm border-1 border-gray-500 placeholder:font-bold focus:outline-none focus:bg-neutral-700 bg-transparent" type="text" placeholder="Thêm mô tả không bắt buộc">
          </div>
        </div>
        <div class="flex justify-end mt-2">
          <button v-if="!loadingStates" type="submit" :disabled="loadingStates" class="w-[115px] h-[60px] border-none bg-white text-black font-bold text-xl rounded-full cursor-pointer hover:scale-104">lưu</button>
          <button v-else="loadingStates" class="flex justify-center items-center w-[115px] h-[60px] border-none bg-white text-black font-bold text-xl rounded-full cursor-pointer hover:scale-104">
            <svg class="animate-spin h-5 w-5 text-gray" viewBox="0 0 24 24">
              <!-- spinner icon -->
              <circle cx="12" cy="12" r="10" stroke="gray" stroke-width="4" fill="none"/>
            </svg>
          </button>
        </div>
      </form>
      <div class="flex justify-end mt-">
        <p class="font-bold text-sm text-white">Bằng cách tiếp tục, bạn đồng ý cho phép Spotify truy cập vào hình ảnh bạn đã chọn để tải lên. Vui lòng đảm bảo bạn có quyền tải lên hình ảnh.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/authStore'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import axios from '@/utils/axios'
import { eventBus } from '@/utils/eventBus'

const emit = defineEmits()
const props = defineProps({
  playlistData: {
    type: Object,
    required: true
  }
})

const stores = useCounterStore()
const hoverItem = ref(false)
const loadingStates = ref(false)
const closeEdit = () => {
  stores.setisOpen(false)
}
const playlistClone = ref(JSON.parse(JSON.stringify(props.playlistData)))

console.log(playlistClone.value);


const showSquare = () => {
  hoverItem.value = true
}
const hiddenSquare = () => {
  hoverItem.value = false
}

const fileInput = ref(null)
const previewImage = ref('')
const triggerInput = () => {
  if(fileInput.value.value) {
    fileInput.value.value = null
    fileInput.value.click()
  } else {
    fileInput.value?.click()
  }
}
const handlerFileChange = (e) => {
  const file = e.target.files[0]
  if(!file) return
  
  const maxSize = 2 * 1024 * 1024
  if(file.size > maxSize) {
    return
  }
  const reader = new FileReader()

  reader.onload = () => {
    previewImage.value = reader.result
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  console.log('Trước: ', playlistClone.value.cover_url, fileInput.value.value, previewImage.value);
  
  if (fileInput.value) {
    console.log(1);
    
    playlistClone.value.cover_url = ''
    fileInput.value.value = null
    previewImage.value = ''
    console.log('Sau: ', playlistClone.cover_url, fileInput.value.value, previewImage.value);
  }
}

const handleSubmit  = async () => {
  loadingStates.value = true
  try {
    const response = await axios.patch(`/play-list/${props.playlistData.id}`, {
      name: playlistClone.value.name,
      cover_url: previewImage.value != '' ? previewImage.value : playlistClone.value.cover_url
    })
    if(response.status == 200) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      stores.setisOpen(false)
      emit('callApi')
      eventBus.emit('callApi')
    }
  } finally {
    loadingStates.value = false
  }
}
</script>

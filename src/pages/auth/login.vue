<template>
  <div class="space-y-2">
    <div class="flex justify-center">
      <img src="https://img.icons8.com/ios-filled/50/ffffff/spotify--v1.png" alt="spotify" class="mr-2" />
    </div>
    <div class="text-3xl text-white font-bold text-center w-full mb-10">Đăng nhập vào Spotify</div>
    <button class="w-full flex justify-center items-center border-2 border-gray-500 text-white py-[14px] px-[50px] bg-transparent font-bold rounded-full">
      <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="google" class="mr-2" />
      <div class="flex-grow text-center">
        <span>Tiếp tục bằng Google</span>
      </div>
    </button>
    <button class="w-full flex justify-center items-center border-2 border-gray-500 text-white py-[14px] px-[50px] bg-transparent font-bold rounded-full">
      <img src="https://img.icons8.com/fluency/24/000000/facebook-new.png" alt="facebook" class="mr-2" />
      <div class="flex-grow text-center">
        <span>Tiếp tục bằng Facebook</span>
      </div>
    </button>
    <button class="w-full flex justify-center items-center border-2 border-gray-500 text-white py-[14px] px-[50px] bg-transparent font-bold rounded-full">
      <img src="https://img.icons8.com/ios-filled/50/ffffff/mac-os.png" alt="facebook" class="mr-2 w-6 h-6" />
      <div class="flex-grow text-center">
        <span>Tiếp tục bằng Apple</span>
      </div>
    </button>

    <div class="flex justify-center items-center mt-10">
      <hr class="border-gray-600 w-[calc(100%+200px)] mx-[-100px]">
    </div>

    <form @submit.prevent="onSubmit">
      <div class="mt-10 flex flex-col gap-4">
        <label for="username" class="font-bold mb-[-10px]">Nhập tên người dùng</label>
        <input type="text" v-model="name" placeholder="Nhập tên người dùng" aria-describedby="nameHelp" id="name" :class="['rounded h-13 p-4 font-bold', nameError ? 'border border-red-500' : 'border border-gray-500']">
        <p v-if="nameError" class="text-red-500 text-sm mt-1">{{ nameError }}</p>

        <label for="password" class="font-bold mb-[-10px]">Nhập mật khẩu</label>
        <input type="password" v-model="password" placeholder="Nhập mật khẩu" aria-describedby="passwordHelp" id="password" :class="['rounded h-13 p-4 font-bold', passwordError ? 'border border-red-500' : 'border border-gray-500']">
        <p v-if="passwordError" class="text-red-500 text-sm mt-1">{{ passwordError }}</p>

        <button type="submit" class="w-full flex justify-center items-center text-black py-[14px] px-[50px] mt-3 bg-green-500 font-bold rounded-full transform hover:scale-105 hover:bg-green-400">
          <div class="flex-grow text-center">
            <span>Đăng nhập</span>
          </div>
        </button>
      </div>
    </form>

    <div class="mt-5 text-center font-bold text-gray-500">Bạn chưa có tài khoản?<router-link to="/register" class="ml-4"><strong class="underline text-white">Đăng ký Spotify</strong></router-link></div>
  </div>
</template>

<script setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import axios from '@/utils/axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotify } from '@/utils/useNotify'
import { useCounterStore } from '@/stores/authStore'

const schema = yup.object({
  name: yup.string().required('Vui lòng nhập tên người dùng'),
  password: yup.string().required('Vui lòng nhập mật khẩu').min(6, 'Mật khẩu phải ít nhất 6 ký tự'),
})

const { handleSubmit } = useForm({
  validationSchema: schema,
})

const { value: name, errorMessage: nameError } = useField('name')
const { value: password, errorMessage: passwordError } = useField('password')

const loadingState = ref(false)
const router = useRouter()
const { notify } = useNotify()
const stores = useCounterStore()

const onSubmit = handleSubmit(async (values) => {
  loadingState.value = true
  try {
    const response = await axios.get('/users')
    console.log("all", response);
    
    if(response) {
      const user = response.data.find((res) => res.name === values.name && res.password === values.password)
      console.log(user);
      
      if(user) {
        router.push('/')
        notify('Đăng ký thành công', 'success')
        stores.setAuth(true)
        stores.setUser(user)
      }
    }
  } finally {
    setTimeout(() => {
      loadingState.value = false
    }, 4000)
  }
})
</script>

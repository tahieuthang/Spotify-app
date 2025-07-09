// src/utils/axios.js
import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://686e1a0ec9090c4953884654.mockapi.io',
  timeout: 5000, // tuỳ chọn
  headers: {
    'Content-Type': 'application/json'
  }
})

export default instance
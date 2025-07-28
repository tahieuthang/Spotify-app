// src/utils/axios.js
import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://spotify-api-c05y.onrender.com',
  timeout: 5000, // tuỳ chọn
  headers: {
    'Content-Type': 'application/json'
  }
})

export default instance
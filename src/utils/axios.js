// src/utils/axios.js
import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 5000, // tuỳ chọn
  headers: {
    'Content-Type': 'application/json'
  }
})

export default instance
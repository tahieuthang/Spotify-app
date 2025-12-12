# 🎵 Spotify App

Ứng dụng web nghe nhạc được xây dựng với Vue 3, mô phỏng giao diện và trải nghiệm của Spotify.

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Cài đặt và chạy dự án](#cài-đặt-và-chạy-dự-án)
- [Cấu trúc API](#cấu-trúc-api)

## 🎯 Giới thiệu

Spotify App là một ứng dụng web nghe nhạc được phát triển với Vue 3, cung cấp các tính năng cơ bản như:
- Nghe nhạc trực tuyến
- Quản lý playlist cá nhân
- Tìm kiếm bài hát và playlist
- Quản lý thư viện nhạc yêu thích
- Giao diện hiện đại, thân thiện với người dùng

## ✨ Tính năng

### 🔐 Xác thực người dùng
- Đăng ký tài khoản mới
- Đăng nhập/Đăng xuất
- Quản lý thông tin cá nhân

### 🎵 Nghe nhạc
- Phát nhạc với thanh điều khiển đầy đủ (play, pause, next, previous)
- Điều chỉnh âm lượng
- Hiển thị tiến trình phát nhạc
- Tự động phát bài tiếp theo trong playlist

### 📚 Quản lý Playlist
- Tạo playlist mới
- Chỉnh sửa thông tin playlist (tên, ảnh bìa)
- Thêm/Xóa bài hát khỏi playlist
- Kéo thả để sắp xếp thứ tự bài hát
- Xem playlist công khai của người dùng khác

### 🔍 Tìm kiếm
- Tìm kiếm bài hát theo tên
- Tìm kiếm fuzzy (gần đúng) với thuật toán Levenshtein
- Hiển thị kết quả tìm kiếm và playlist liên quan

### ❤️ Yêu thích
- Thêm/Xóa bài hát yêu thích
- Xem danh sách bài hát yêu thích trong profile

## 🛠️ Công nghệ sử dụng

### Frontend Framework & Libraries
- **Vue 3** (^3.5.17) - Progressive JavaScript framework
- **Vite** (^7.0.0) - Build tool và dev server
- **Vue Router** (^4.5.1) - Routing cho SPA
- **Pinia** (^3.0.3) - State management

### UI & Styling
- **Tailwind CSS** (^4.1.11) - Utility-first CSS framework
- **Swiper** (^10.3.1) - Touch slider/carousel
- **Font Awesome** (^6.7.2) - Icon library
- **Vue Toastification** (^2.0.0-rc.5) - Toast notifications

### HTTP & Validation
- **Axios** (^1.10.0) - HTTP client
- **Vee-Validate** (^4.15.1) - Form validation
- **Yup** (^1.6.1) - Schema validation

### Utilities
- **Vue Draggable** (^4.1.0) - Drag and drop functionality
- **js-levenshtein** (^1.1.6) - Fuzzy search algorithm
- **remove-accents** (^0.5.0) - Text normalization

## 📁 Cấu trúc dự án

```
spotify-app/
├── public/                 # Static files
│   ├── _redirects
│   └── vite.svg
├── src/
│   ├── assets/             # Images, fonts, etc.
│   │   ├── images/
│   │   └── vue.svg
│   ├── components/         # Vue components
│   │   ├── dashboard/      # Dashboard components
│   │   │   ├── Content.vue
│   │   │   ├── Footer.vue
│   │   │   ├── MusicPlayerBar.vue
│   │   │   ├── SideBar.vue
│   │   │   └── TopNavBar.vue
│   │   └── music/          # Music-related components
│   │       ├── EditModal.vue
│   │       ├── ItemPlayList.vue
│   │       ├── ItemSong.vue
│   │       └── PlaylistSearchResult.vue
│   ├── layouts/            # Layout components
│   │   ├── AuthLayout.vue
│   │   └── DefaultLayout.vue
│   ├── pages/              # Page components
│   │   ├── auth/           # Authentication pages
│   │   │   ├── login.vue
│   │   │   └── register.vue
│   │   ├── library/        # User library
│   │   │   └── [idMyPlaylist].vue
│   │   ├── play-list/      # Public playlists
│   │   │   └── [idPlayList].vue
│   │   ├── profile/        # User profile
│   │   │   └── index.vue
│   │   └── search/         # Search page
│   │       └── index.vue
│   ├── plugins/            # Vue plugins
│   │   └── loadingState.js
│   ├── router/             # Vue Router configuration
│   │   └── index.js
│   ├── stores/             # Pinia stores
│   │   ├── audio.js        # Audio player state
│   │   └── authStore.js    # Authentication state
│   ├── utils/              # Utility functions
│   │   ├── axios.js        # Axios instance
│   │   ├── eventBus.js     # Event bus
│   │   ├── replaceUrlImage.js
│   │   └── useNotify.js    # Notification helper
│   ├── App.vue             # Root component
│   ├── main.js             # Application entry point
│   └── style.css           # Global styles
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js >= 16.x
- npm hoặc yarn

### Các bước cài đặt

1. **Clone repository** (nếu có) hoặc mở thư mục dự án:
```bash
cd Spotify-app
```

2. **Cài đặt dependencies:**
```bash
npm install
```

3. **Cấu hình API endpoint:**
   - Mở file `src/utils/axios.js`
   - Cập nhật `baseURL` với URL của API backend:
   ```javascript
   baseURL: 'https://your-api-url.com'
   ```

4. **Chạy development server:**
```bash
npm run dev
```

5. **Mở trình duyệt:**
   - Truy cập `http://localhost:5173` (hoặc port được Vite hiển thị)

### Build cho production

```bash
npm run build
```

Sau khi build, các file sẽ được tạo trong thư mục `dist/`.

### Preview production build

```bash
npm run preview
```

## 🔌 Cấu trúc API

Dự án sử dụng RESTful API với các endpoint chính:

### Base URL
```
https://spotify-api-c05y.onrender.com
```

### Các endpoint chính:

#### Authentication
- `POST /users` - Đăng ký tài khoản mới
- `GET /users` - Lấy danh sách người dùng
- `PATCH /users/:id` - Cập nhật thông tin người dùng

#### Songs
- `GET /songs` - Lấy danh sách tất cả bài hát

#### Playlists
- `GET /play-list` - Lấy danh sách playlist
- `GET /play-list/:id` - Lấy chi tiết playlist
- `POST /play-list` - Tạo playlist mới
- `PATCH /play-list/:id` - Cập nhật playlist

### Authentication
API sử dụng JWT token được lưu trong `localStorage` với key `Authorization`.

## 📝 Ghi chú

- Dự án sử dụng Vue 3 Composition API với `<script setup>` syntax
- State management được quản lý bằng Pinia
- Routing được bảo vệ với route guards
- Giao diện responsive, hỗ trợ nhiều kích thước màn hình

## 👨‍💻 Phát triển

### Cấu trúc component
- Components được tổ chức theo chức năng
- Sử dụng Composition API cho logic tái sử dụng
- Props và emits được định nghĩa rõ ràng

### State Management
- `authStore.js`: Quản lý authentication và user state
- `audio.js`: Quản lý audio player state

### Styling
- Sử dụng Tailwind CSS utility classes
- Custom styles trong `<style scoped>` khi cần
- Responsive design với Tailwind breakpoints

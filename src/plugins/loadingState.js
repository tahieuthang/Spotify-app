const elLoading = `
  <div class="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>`;

export default {
  mounted(el, binding) {
    // Khi binding.value là true, hiển thị loading
    if (binding.value && !el.querySelector('#getting')) {
      el.classList.add('relative');
      el.insertAdjacentHTML('beforeend', elLoading);
    }
  },
  
  updated(el, binding) {
    // Kiểm tra khi giá trị binding thay đổi
    if (binding.value === binding.oldValue) return;

    // Nếu binding.value là true, thêm loading, ngược lại thì xóa
    const loadingEl = el.querySelector('#getting');
    
    if (binding.value && !loadingEl) {
      el.classList.add('relative');
      el.insertAdjacentHTML('beforeend', elLoading);
    } else if (!binding.value && loadingEl) {
      el.removeChild(loadingEl);
    }
  },

  // Tùy chỉnh cho SSR (Server-side rendering) nếu cần
  getSSRProps(binding, vnode) {
    console.log(binding, vnode);
    return {};
  }
};

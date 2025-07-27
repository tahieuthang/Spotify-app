const elLoading = `
  <div id="getting" class="absolute inset-0 z-70 flex items-center justify-center bg-black bg-opacity-60">
    <div class="flex space-x-2">
      <div class="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div class="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div class="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce"></div>
    </div>
  </div>
`;
export default {
  mounted(el, binding) {
    if (binding.value && !el.querySelector('#getting')) {
      el.classList.add('relative');
      el.insertAdjacentHTML('beforeend', elLoading);
    }
  },
  
  updated(el, binding) {
    if (binding.value === binding.oldValue) return;

    const loadingEl = el.querySelector('#getting');

    if (binding.value && !loadingEl) {
      el.classList.add('relative');
      el.insertAdjacentHTML('beforeend', elLoading);
    } else if (!binding.value && loadingEl) {
      el.removeChild(loadingEl);
    }
  },

  getSSRProps(binding, vnode) {
    return {};
  }
};

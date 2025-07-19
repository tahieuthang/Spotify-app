<template>
  <div id="app">
    <AuthLayout v-if="isAuthLayout"/>
    <DefaultLayout v-else />
  </div>
</template>
<script setup>
import AuthLayout from './layouts/AuthLayout.vue';
import DefaultLayout from './layouts/DefaultLayout.vue';
import { computed, onMounted } from "vue";
import { useRoute } from 'vue-router';
import axios from '@/utils/axios'

const route = useRoute()
const isAuthLayout = computed(() => {
  return ['login', 'register'].includes(route.name);
})
</script>
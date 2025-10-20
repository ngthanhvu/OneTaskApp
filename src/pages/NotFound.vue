<template>
    <div class="hero min-h-screen bg-base-200">
        <div class="hero-content text-center">
            <div class="max-w-md">
                <h1 class="text-5xl font-bold">404 - Không tìm thấy trang</h1>
                <p class="py-6">
                    Rất tiếc, trang bạn đang tìm kiếm không tồn tại. Có thể bạn đã nhập sai địa chỉ hoặc trang đã bị xóa.
                </p>
                <router-link to="/" class="btn btn-primary">Quay về trang chủ</router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'

useHead({
    title: '404 Not Found | Task Wan',
    meta: [
        { name: 'description', content: 'Trang không tìm thấy' },
    ],
})
</script>

<style scoped></style>

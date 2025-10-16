<template>
    <!-- <h1 class="font-bold text-3xl"> Home Page</h1> -->
    <div class="hero bg-base-200 flex flex-col flex-grow justify-center items-center min-h-screen">
        <div class="hero-content text-center">
            <div class="max-w-md">
                <h1 class="text-5xl font-bold">Hello there</h1>
                <p class="py-6">
                    Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                    quasi. In deleniti eaque aut repudiandae et a id nisi.
                </p>
                <button class="btn btn-primary">Get Started</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head';

useHead({
    title: 'Home Page',
    meta: [
        { name: 'description', content: 'Welcome to the Home Page' },
    ],
});
</script>

<style scoped></style>
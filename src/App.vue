<template>
  <Notivue v-slot="item">
    <Notification :item="item" />
  </Notivue>
  <router-view />
</template>

<script lang="ts" setup>
import { watchEffect } from 'vue'
import { Notivue, Notification } from 'notivue'

watchEffect(() => {
  const theme = document.documentElement.getAttribute('data-theme')
  const metaThemeColor = document.querySelector('#meta-theme-color')
  const metaStatusBar = document.querySelector('#meta-status-bar')

  if (theme === 'dark') {
    metaThemeColor?.setAttribute('content', '#0f172a') // màu dark background
    metaStatusBar?.setAttribute('content', 'black') // status bar chữ trắng
    document.body.style.backgroundColor = '#0f172a'
  } else {
    metaThemeColor?.setAttribute('content', '#ffffff') // màu light background
    metaStatusBar?.setAttribute('content', 'default')
    document.body.style.backgroundColor = '#ffffff'
  }
})

</script>

<style lang="scss" scoped></style>
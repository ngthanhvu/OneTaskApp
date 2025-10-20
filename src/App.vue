<template>
  <Notivue v-slot="item">
    <Notification :item="item" />
  </Notivue>
  <SplashScreen v-if="loading" />
  <router-view />
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { Notivue, Notification } from 'notivue'
import SplashScreen from './components/SplashScreen.vue'

function applyMetaForTheme(theme: string | null) {
  const metaThemeColor = document.querySelector<HTMLMetaElement>('#meta-theme-color')
  const metaStatusBar = document.querySelector<HTMLMetaElement>('#meta-status-bar')

  if (theme === 'dark') {
    metaThemeColor?.setAttribute('content', '#1D232A')
    metaStatusBar?.setAttribute('content', 'black')
  } else {
    metaThemeColor?.setAttribute('content', '#ffffff')
    metaStatusBar?.setAttribute('content', 'white')
  }
}

const loading = ref(true)

let themeObserver: MutationObserver | null = null

onMounted(() => {
  applyMetaForTheme(document.documentElement.getAttribute('data-theme'))

  themeObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes') {
        const currentTheme = document.documentElement.getAttribute('data-theme')
        applyMetaForTheme(currentTheme)
      }
    }
  })

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  })
  setTimeout(() => {
    loading.value = false
  }, 1500)
})

onBeforeUnmount(() => {
  themeObserver?.disconnect()
  themeObserver = null
})

</script>

<style lang="scss" scoped></style>
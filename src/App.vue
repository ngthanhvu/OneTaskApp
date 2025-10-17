<template>
  <Notivue v-slot="item">
    <Notification :item="item" />
  </Notivue>
  <router-view />
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { Notivue, Notification } from 'notivue'

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

let themeObserver: MutationObserver | null = null

onMounted(() => {
  // Initialize once
  applyMetaForTheme(document.documentElement.getAttribute('data-theme'))

  // Observe changes to data-theme
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
})

onBeforeUnmount(() => {
  themeObserver?.disconnect()
  themeObserver = null
})

</script>

<style lang="scss" scoped></style>
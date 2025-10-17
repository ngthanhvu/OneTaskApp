<template>
  <Notivue v-slot="item">
    <Notification :item="item" />
  </Notivue>
  <router-view />
</template>

<script lang="ts" setup>
import { Notivue, Notification } from 'notivue'
</script>

<style lang="scss" scoped></style>
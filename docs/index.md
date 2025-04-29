---
layout: home

hero:
  name: AI Robotics
  text: Docs, kinda
  tagline: You probably learned nothing from your past...
  image:
    src: https://placehold.co/10x10
    alt: placeholder
  actions:
    - theme: brand
      text: Get Started
      link: /guide/what-is-vitepress
    - theme: alt
      text: View on GitHub
      link: https://github.com/parker-int64/kp-blog
---

<script setup>
import { ref, onMounted, h, render } from 'vue'
import { Vue3Lottie } from 'vue3-lottie'
import Assistant from '/src/assistant-animation.json'

const placeholder = ref(null)

onMounted(() => {
  const target = document.querySelector('.image-container')
  if (target && target.parentNode) {
    const parent = target.parentNode

    // create node
    const mountDiv = document.createElement('div')
    parent.replaceChild(mountDiv, target)

    // create vnode
    const vnode = h(Vue3Lottie, {
      animationData: Assistant,
      height: 200,
      width: 200
    })

    render(vnode, mountDiv)
  }
})
</script>

<template>
  <div ref="placeholder" class="w-48 h-48" style="display: none;"></div>
</template>



# Hello world

Check here for my first blog:


[Install TensorFlow Lite on Raspberry Pi](./Instsall-TensorFlow-Lite-On-RPi.md)
<!-- [Install LiteRT on Raspberry Pi](./Install-LiteRT-On-RPi.md)  -->

[Jetson Naming Conventions](./Jetson-Naming-Conventions.md)

[Jetson Backup and Restore](./Jetson-Backup-and-Restore.md)

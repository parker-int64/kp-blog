---
ssr: false
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


<div class="image-container"></div>

<script setup>
import { ref, onMounted, h, render } from 'vue'

onMounted(async () => {
  const { Vue3Lottie } = await import('vue3-lottie')
  const Assistant = await import('/src/assistant-animation.json')

  const target = document.querySelector('.image-container')
  if (target && target.parentNode) {
    const parent = target.parentNode

    const mountDiv = document.createElement('div')
    parent.replaceChild(mountDiv, target)

    const vnode = h(Vue3Lottie, {
      animationData: Assistant.default,
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


[Install TensorFlow Lite on Raspberry Pi](./Install-TensorFlow-Lite-on-RPi.md)

[Install LiteRT on Raspberry Pi](./Install-LiteRT-on-RPi.md) 

[Jetson Naming Conventions](./Jetson-Naming-Conventions.md)

[Jetson Backup and Restore](./Jetson-Backup-and-Restore.md)

[Flash JetPack with WSL2](./Flash-Jetpack-wsl2.md)

[Jetson Build PyTorch](./Jetson-Build-Pytorch.md)

[Jetson Build Torchvision](./Jetson-Build-Torchvision.md)

[Jetson Build Open3D](./Jetson-Build-Open3D.md)

[Jetson Build PCL (Point Cloud Library)](./Jetson-Build-PCL.md)

[Jetson Build Librealsense](./Jetson-Build-Librealsense.md)

[Jetson安装中文语言包和中文输入法](./Jetson安装中文输入法.md)
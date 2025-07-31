<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/parker-int64.png',
    name: 'Kane@Work',
    title: 'Creator, Maintainer',
    links: [
      { icon: 'github', link: 'https://github.com/parker-int64' },
    ]
  },
  {
    avatar: 'https://github.com/yuyoujiang.png',
    name: 'yuyoujiang',
    title: 'Co-create, Maintainer',
    links: [
      { icon: 'github', link: 'https://github.com/yuyoujiang' },
      { icon: 'youtube', link: 'https://www.youtube.com/channel/UCrqhS8_COo22Y0jj67E3xoQ' }
    ]
  },
  {
    avatar: 'https://github.com/ZhuYaoHui1998.png',
    name: 'ZhuYaoHui1998',
    title: 'Co-create, Maintainer',
    links: [
      { icon: 'github', link: 'https://github.com/ZhuYaoHui1998' },
      { icon: 'bilibili', link: 'https://space.bilibili.com/628398326'}
    ]
  },

  {
    avatar: 'https://github.com/grilliiiiii.png',
    name: 'grilliiiiii',
    title: 'Co-create, Maintainer',
    links: [
      { icon: 'github', link: 'https://github.com/grilliiiiii' },
    ]
  },
]
</script>

# Our Team

Say hello to our awesome team.

<VPTeamMembers size="small" :members />
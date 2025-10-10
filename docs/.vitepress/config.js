// .vitepress/config.js
export default {
    // site level configurations
    title: 'Personal Log',
    description: 'Share something useful.',

    themeConfig: {
        // theme configurations
        siteTitle: 'Blog',
        nav: [
            { text: 'Get Started', link: '/index' },
            { text: 'About', link: '/about/teampage' },
        ],
        sidebar: [
            {
                text: 'Guide',
                items: [
                    { text: "Getting Started", link: '/guide/getting-started' },
                ],
            },
            {
                text: 'Espressif',
                items: [
                    { text: "ESPHome Migration", link: '/espressif/esphome-migration-guide' }
                ]
            },
            {
                text: 'Raspberry Pi',
                items: [
                    { text: "LiteRT on Raspberry Pi", link: '/rpi/install-litert-on-rpi' },
                    { text: "Tensorflow Lite on Raspberry Pi", link: '/rpi/install-tensorflow-lite-on-rpi' },
                ]
            },
            {
                text: 'NVIDIA Jetson',
                items: [
                    { text: 'Flash JetPack on Windows (WSL2)', link: '/jetson/flash-jetpack-on-wsl2' },
                    { text: 'Build Librealsense', link: '/jetson/build-librealsense' },
                    { text: 'Build Open3D', link: '/jetson/build-open3d' },
                    { text: 'Build PCL', link: '/jetson/build-pcl' },
                    { text: 'Build Pytorch', link: '/jetson/build-pytorch' },
                    { text: 'Build Torchvision', link: '/jetson/build-torchvision' },
                    { text: 'Backup and Restore', link: '/jetson/backup-and-restore' },
                ]
            },
            {
                text: 'Miscellaneous',
                items: [
                    { text: 'IMX219/477 on Seeed reComputer', link: '/misc/configure-recomputer-imx219-imx477' },
                    { text: 'Jetson Naming Conventions', link: '/misc/jetson-naming-conventions' },
                    { text: 'Jetson安装中文输入法（搜狗拼音）', link: '/misc/jetson安装中文输入法' },
                    { text: 'SDK Manager适配', link: '/misc/SDKManager适配' }
                ]
            }
        ],

        editLink: {
            pattern: 'https://github.com/parker-int64/kp-blog/edit/main/docs/:path',
            text: 'Edit this page on GitHub'
        },
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2019-present Kane/Kevin/parker-int64'
        }
    },
    ignoreDeadLinks: true,

    markdown: {
        image: {
            lazyLoading: true,    // enable lazy loading 
        }
    }
}
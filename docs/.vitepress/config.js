// .vitepress/config.js
export default {
    // site level configurations
    title: 'K.P\'s Personal Blog',
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
                    // { text: "LiteRT on Raspberry Pi", link: '/Install-LiteRT-on-RPi' },
                    // { text: "TensorFlow Lite on Raspberry Pi", link: '/Install-TensorFlow-Lite-on-RPi'}
                ]
            }
        ]
    },
    ignoreDeadLinks: true,

    markdown: {
        image: {
            lazyLoading: true,    // enable lazy loading 
        }
    }
}
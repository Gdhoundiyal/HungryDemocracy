require('./config');
require('dotenv').config();
import colors from 'vuetify/es5/util/colors'
process.env.PORT = process.env.PORT || process.env.LEANCLOUD_APP_PORT
const testingAnalytics = false
export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  // dev: true,
  head: {
    titleTemplate: '%s - Hungry Democracy',
    title: 'Globalizing home cooked recipes',
    htmlAttrs: {
      lang: 'en'
    },
    robots: {
      UserAgent: '*',
      Disallow: ''
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'HungryDemocracy is an Indian recipe platform where you can find recipes from around the country.' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      // { rel: "preconnect", href: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Roboto:wght@400;700&display=swap' },
      // { rel: "preload", type: "stylesheet", href: 'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      {
        src: "https://www.googletagmanager.com/gtag/js?id=G-GYYPWPSB7Y",
        async: true,
      },
      {
        src: "/js/ga.js", 
      },
      { type: "text/javascript", src: "https://apiv2.popupsmart.com/api/Bundle/382789", async: true },
      { src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1655212948982275", crossorigin: "anonymous", async: true }
    ],
  },

  //loading screen
  loading: '~/components/LoadingScreen.vue',


  // Global CSS: https://go.nuxtjs.dev/config-css
  // css: [
  //   // SCSS file in the project
  //   '~/assets/variables.scss'
  // ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/vue-awesome-swiper', mode: 'client' },
    '~/plugins/vuex-persistedstate.client.ts',
    '~/plugins/fireauth.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // target: 'static',

  image: {
    cloudinary: {
      baseUrl: 'https://firebasestorage.googleapis.com/'
    }
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@aceforth/nuxt-optimized-images',
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxt/image'
  ],
  optimizedImages: {
    optimizeImages: true
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,

    theme: {
      light: true,  //you don't actually need this line as it's for default
      themes: {
        light: {
          primary: '#42CC8C',
          accent: colors.shades.black,
          error: colors.red.accent3
        },
        dark: {
          primary: colors.blue.lighten3
        }
      }
    },
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxt/content',
    '@nuxt/image',
    [
      // '@nuxt/image',
      '@nuxtjs/robots',
      '@nuxtjs/firebase',
      {
        firebase:{
          config: {
            apiKey: process.env.NUXT_ENV_FIREBASE_API_KEY,
            authDomain: process.env.NUXT_ENV_FIREBASE_AUTHDOMAIN,
            projectId: process.env.NUXT_ENV_FIREBASE_PROJECTID,
            storageBucket: process.env.NUXT_ENV_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NUXT_ENV_FIREBASE_MESSAGE_SENDERID,
            appId: process.env.NUXT_ENV_GOOGLE_APPID,
            measurementId: process.env.NUXT_ENV_MEASUREMENTID
          },
        },
        services: {
          analytics: true,
          auth: {
            persistence: 'local', // default
            initialize: {
              onAuthStateChangedAction: 'userStore/onAuthStateChanged',
              subscribeManually: false
            },
            ssr: true, // default
          }
        },
      }
    ],
  ],

  content: {
    dir: 'content'
  },

  // server middleware for 301 redirect
  serverMiddleware: [
    // Server-side redirects
    '~/serverMiddleware/redirects',
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: true,
    // analyze: true,
    html: {
      minify:{
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true,
        removeComments: true,
        preserveLineBreaks: false,
        collapseWhitespace: true
      }
    },
    loaders: {
      sass: {
        implementation: require('sass'),
      },
    }
  },
}

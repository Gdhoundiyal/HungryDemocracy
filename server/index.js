const express = require('express')
const consola = require('consola')
const { loadNuxt } = require('nuxt-start')
const app = express()

process.env.PORT = process.env.PORT || process.env.LEANCLOUD_APP_PORT

async function start () {
  const nuxt = await loadNuxt(isDev ? 'dev' : 'start')
  await nuxt.listen(process.env.PORT, process.env.HOST)
}

start()
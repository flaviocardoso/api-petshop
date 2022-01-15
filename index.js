const express = require('./config/express')
const config = require('config')

const app = express()

app.listen(config.get('api.port'), () => console.log(`A API está rodando na porta %d!`, config.get('api.port')))
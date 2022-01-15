const express = require('express')
const cors = require('cors')
const erros = require('./errors')
const formats = require('./formats')

const router = express.Router()
// versão 1
const controllerFornecedorV1 = require('../api/controllers/fornecedores')
const controllerProdutoV1 = require('../api/controllers/produtos')
// versão 2
const controllerFornecedorV2 = require('../api/controllers/fornecedores/index.v2')
const controllerProdutoV2 = require('../api/controllers/produtos.v2')

module.exports = () => {
    const app = express()
    // app.use(cors())
    formats(app)

    app.use(express.urlencoded({extended: true}))
    app.use(express.json())
    app.use(express.raw({ type: 'application/xml' }))

    // controller requisição v1
    controllerFornecedorV1(router)
    controllerProdutoV1(router)
    // controller requisição v2
    controllerFornecedorV2(router)
    controllerProdutoV2(router)

    app.use('/api', router) // parte central

    erros(app)

    app.get('*', function(req, res) {
        res.status(404).send({ message: `Url '${req.url}' não foi encontrada`})
    })

    return app
}
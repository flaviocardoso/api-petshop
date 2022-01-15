
const formatosAceitos = require('../formats').formatos_aceitos

module.exports = app => {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*') // CORS, aqui permite a todos ao acesso a API
        next()
    })

    app.use((req, res, next) => { 
        res.set('x-powered-by', 'Flavio Cardoso') // dando nome a API
        next()
    })

    app.use((req, res, next) => {
        let formatAccept = req.header('Accept')

        if (formatAccept === '*/*') {
            formatAccept = 'application/json'
        }

        if (formatosAceitos.indexOf(formatAccept) === -1) {
            res.status(406).end()
            return
        }
        
        res.setHeader('Content-Type', formatAccept)
        next()
    })
}
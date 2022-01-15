const { NaoEncontrado, CampoInvalido, FormatoNaoCompativel, FormatoNaoSuportado, Vazio } = require('../errors')
const FormatsErro = require('../formats/erro')

module.exports = app => {

    app.use((erro, req, res, next) => {
        let status = 500
        if (erro instanceof NaoEncontrado) {
            status = 404
        }

        if (erro instanceof FormatoNaoSuportado) {
            status = 406
        }
        
        if (erro[0] instanceof CampoInvalido 
            || erro instanceof FormatoNaoCompativel
            || erro instanceof SyntaxError
            || erro instanceof Vazio
            ) {
            status = 400
        }

        res.status(status)
        // let contentTypeEntrada = req.header('Content-Type')
        let contentType = res.getHeader('Content-Type')
        const formato = new FormatsErro(
            contentType
        )
        res.send( formato.saida(erro) )
        
    })
}
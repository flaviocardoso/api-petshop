
const Fornecedor = require('../../models/fornecedores')
const { FormatsFornecedor } = require('../../../formats')

const fornecedores = require('express').Router()
const produtos = require('./produtos')

module.exports = router => {
    router.use('/fornecedores', fornecedores) // agrupamento de fornecedores
    produtos(fornecedores) // store produtos de fornecedores

    fornecedores.options('', (req, res) => {
        res.header('Acces')
    })
    
    // fornecedores
    fornecedores.get('', (req, res, next) => {
        let contentType= res.getHeader('Content-Type')
        // let contentTypeEntrada = req.header('Content-Type')
        const formato = new FormatsFornecedor(contentType)

        Fornecedor
            .lista()
            .then( fornecedores => res.send(formato.saida(fornecedores)))
            .catch((e) => next(e))
    })

    fornecedores.get('/:id', (req, res, next) => {
        const id = parseInt( req.params.id )

        let contentType = res.getHeader('Content-Type')
        // let contentTypeEntrada = req.header('Content-Type')
        const formato = new FormatsFornecedor(
            contentType,
            'email', 
            'dataDeCriacao',
            'dataDeAtualizacao',
            'versao'
        )
        
        Fornecedor
            .dados({ id })
            .buscaPorId()
            .then((fornecedor) => res.send(formato.saida(fornecedor)))
            .catch((e) => next(e))
    })

    fornecedores.post('', (req, res, next) => {
        let contentType = res.getHeader('Content-Type')
        // let contentTypeEntrada = req.header('Content-Type')
        const formato = new FormatsFornecedor(contentType)

        let dados = formato.entrada(req.body)

        Fornecedor
            .dados(dados)
            .criar()
            .then((fornecedor) => {
                const contentType = res.getHeader('Content-Type')
                const formato = new FormatsFornecedor(contentType)
                
                res.status(201)
                res.send(
                    formato.saida(fornecedor)
                )
            } )
            .catch((e) => next(e))
        
    })

    fornecedores.put('/:id', (req, res, next) => {

        let contentType = res.getHeader('Content-Type')
        // let contentTypeEntrada = req.header('Content-Type')
        const formato = new FormatsFornecedor(contentType)

        const id = parseInt(req.params.id)
        let dados = formato.entrada(req.body)
        
        dados = { id, ...dados }

        Fornecedor
            .dados(dados)
            .altera()
            .then((fornecedor) => {
                
                res.send(
                    formato.saida(fornecedor)
                )
            })
            .catch((e) => next(e))
    })

    fornecedores.delete('/:id', (req, res, next) => {
        const id = parseInt(req.params.id)
        
        Fornecedor
            .dados({ id })
            .deleta()
            .then(() => res.status(204).end())
            .catch((e) => next(e))
    })
}
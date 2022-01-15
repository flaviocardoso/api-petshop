
const produtos = require('express').Router({ mergeParams: true })
const { FormatsProduto } = require('../../../formats')
const Produto = require('../../models/fornecedores/produtos')

module.exports = fornecedores => {
    fornecedores.use('/:idFornecedor/produtos', produtos) // agrupamentde de fornedores por produtos

    // começo - as autorização
    produtos.options('', (req, res) => {
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
        res.header('Access-Control-Allow-Headers', 'Content-Type')
        res.status(204).end()
    })
    
    // end - as autorização
    
    // produtos de fornecedores
    produtos.get('', (req, res, next) => {
        const idFornecedor = parseInt(req.params.idFornecedor)
        
        const contentType = res.getHeader('Content-Type')
        const formato = new FormatsProduto(contentType)
        
        Produto.dados({ idFornecedor })
        .lista()
        .then(produtos => res.send(formato.saida(produtos)))
        .catch(error => next(error))
    })
    
    produtos.post('', async (req, res, next) => {
        const contentType = res.getHeader('Content-Type')
        
        try {
            const idFornecedor = parseInt(req.params.idFornecedor)
            
            const formato = new FormatsProduto(contentType)
            const entrada = formato.entrada(req.body)
            
            delete entrada.idFornecedor
            delete entrada.id
            
            const dados = { idFornecedor, ...entrada }
            
            await Produto.dados(dados).criar()
            
            const timestamp = (new Date(Produto.dataAtualizacao)).getTime()
            const fullUrl = req.protocol + '://' + req.get('Host') + req.originalUrl
            
            res.set('ETag', Produto.versao)
            res.set('Last-Modified', timestamp)
            res.set('Location', `${fullUrl}/${Produto.id}`)
            
            res.status(201).send(formato.saida(Produto))
        } catch (error) {
            next(error)
        }
    })

    produtos.options('/:id', (req, res) => {
        res.header('Access-Control-Allow-Methods', 'HEAD, GET, PUT, DETELE')
        res.header('Access-Control-Allow-Headers', 'Content-Type')
        res.status(204).end()
    })

    produtos.head('/:id', async (req, res, next) => { // reconhecendo uma rota
        const contentType = res.getHeader('Content-Type')

        try {
            const id = parseInt(req.params.id)
            const idFornecedor = parseInt(req.params.idFornecedor)

            const formato = new FormatsProduto(contentType, 'dataCriacao', 'dataAtualizacao', 'versao')

            await Produto.dados({ id, idFornecedor }).buscarPorId()

            const timestamp = (new Date(Produto.dataAtualizacao)).getTime()

            res.set('ETag', Produto.versao)
            res.set('Last-Modified', timestamp)
                
            res.end()
        } catch (error) {
            next(error)
        }
    })

    produtos.get('/:id', async (req, res, next) => {
        const contentType = res.getHeader('Content-Type')

        try {
            const id = parseInt(req.params.id)
            const idFornecedor = parseInt(req.params.idFornecedor)

            const formato = new FormatsProduto(contentType, 'dataCriacao', 'dataAtualizacao', 'versao')

            await Produto.dados({ id, idFornecedor }).buscarPorId()

            const timestamp = (new Date(Produto.dataAtualizacao)).getTime()

            res.set('ETag', Produto.versao)
            res.set('Last-Modified', timestamp)
                
            res.send(formato.saida(Produto))
        } catch (error) {
            next(error)
        }
    })

    produtos.put('/:id', async (req, res, next) => {
        const contentType = res.getHeader('Content-Type')

        try {
            const idFornecedor = parseInt(req.params.idFornecedor)
            const id = parseInt(req.params.id)

            const formato = new FormatsProduto(contentType)

            const entradaDados = formato.entrada(req.body)

            delete entradaDados.idFornecedor
            delete entradaDados.id
            
            const dados = { id, idFornecedor, ...entradaDados}

            Produto.dados(dados)
            await Produto.altera()
            await Produto.buscarPorId()

            const timestamp = (new Date(Produto.dataAtualizacao)).getTime()

            res.set('ETag', Produto.versao)
            res.set('Last-Modified', timestamp)
            
            res.status(204).end()
        } catch (error) {
            next(error)
        }
    }) 

    produtos.delete('/:id', (req, res, next) => {
        const idFornecedor = parseInt(req.params.idFornecedor)
        const id = parseInt(req.params.id)

        Produto.dados({ id, idFornecedor })
            .deleta()
            .then(() => res.status(204).end())
            .catch(error => next(error))
    })

    produtos.options('/:id/estoque/increment', (req, res) => {
        res.header('Access-Control-Allow-Methods', 'POST')
        res.header('Access-Control-Allow-Headers', 'Content-Type')
        res.status(204).end()
    })

    produtos.post('/:id/estoque/increment', async (req, res, next) => {
        try {
            const idFornecedor = parseInt(req.params.idFornecedor)
            const id = parseInt(req.params.id)

            Produto.dados({ id, idFornecedor })
            await Produto.buscarPorId()
            await Produto.controles().estoqueToggle(Produto.INCREMENT)
            await Produto.buscarPorId()

            const timestamp = (new Date(Produto.dataAtualizacao)).getTime()

            res.set('ETag', Produto.versao)
            res.set('Last-Modified', timestamp)

            res.status(204).end()
        } catch (e) {
            next(e)
        }
    })

    produtos.options('/:id/estoque/increment/:qtd', (req, res) => {
        res.header('Access-Control-Allow-Methods', 'POST')
        res.header('Access-Control-Allow-Headers', 'Content-Type')
        res.status(204).end()
    })

    produtos.post('/:id/estoque/increment/:qtd', async (req, res, next) => {
        try {
            const idFornecedor = parseInt(req.params.idFornecedor)
            const id = parseInt(req.params.id)
            const qtd = parseInt(req.params.qtd)

            Produto.dados({ id, idFornecedor })
            await Produto.buscarPorId()
            await Produto.controles().estoqueToggle(Produto.INCREMENT, qtd)
            await Produto.buscarPorId()

            const timestamp = (new Date(Produto.dataAtualizacao)).getTime()

            res.set('ETag', Produto.versao)
            res.set('Last-Modified', timestamp)

            res.status(204).end()
        } catch (e) {
            next(e)
        }
    })

    produtos.options('/:id/estoque/decrement', (req, res) => {
        res.header('Access-Control-Allow-Methods', 'POST')
        res.header('Access-Control-Allow-Headers', 'Content-Type')
        res.status(204).end()
    })

    produtos.post('/:id/estoque/decrement', async (req, res, next) => {
        try {
            const idFornecedor = parseInt(req.params.idFornecedor)
            const id = parseInt(req.params.id)

            Produto.dados({ id, idFornecedor })
            await Produto.buscarPorId()
            await Produto.controles().estoqueToggle(Produto.DECREMENT)
            await Produto.buscarPorId()

            const timestamp = (new Date(Produto.dataAtualizacao)).getTime()

            res.set('ETag', Produto.versao)
            res.set('Last-Modified', timestamp)

            res.status(204).end()
        } catch (e) {
            next(e)
        }
    })

    produtos.options('/:id/estoque/decrement/:qtd', (req, res) => {
        res.header('Access-Control-Allow-Methods', 'POST')
        res.header('Access-Control-Allow-Headers', 'Content-Type')
        res.status(204).end()
    })

    produtos.post('/:id/estoque/decrement/:qtd', async (req, res, next) => {
        try {
            const idFornecedor = parseInt(req.params.idFornecedor)
            const id = parseInt(req.params.id)
            const qtd = parseInt(req.params.qtd)

            Produto.dados({ id, idFornecedor })
            await Produto.buscarPorId()
            await Produto.controles().estoqueToggle(Produto.DECREMENT, qtd)
            await Produto.buscarPorId()

            const timestamp = (new Date(Produto.dataAtualizacao)).getTime()

            res.set('ETag', Produto.versao)
            res.set('Last-Modified', timestamp)

            res.status(204).end()
        } catch (e) {
            next(e)
        }
    })
}
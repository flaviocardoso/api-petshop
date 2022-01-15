
const produtos = require('express').Router()
const { FormatsProduto } = require('../../formats')
const Produto = require('../../api/models/produtos.v2')

module.exports = router => {
    router.use('/v2/produtos', produtos) // agrupamentos de produtos

    // começo - as autorização
    produtos.options('', (req, res) => {
        res.set('Access-Control-Allow-Methods', 'GET')
        res.set('Access-Control-Allow-Headers', 'Content-Type')
        res.status(204).end()
    })

    produtos.options('/:id', (req, res) => {
        res.set('Access-Control-Allow-Methods', 'GET, PUT, DETELE, HEAD')
        res.set('Access-Control-Allow-Headers', 'Content-Type')
        res.status(204).end()
    })

    produtos.options('/:id/estoque/increment', (req, res) => {
        res.set('Access-Control-Allow-Methods', 'POST')
        res.set('Access-Control-Allow-Headers', 'Content-Type')
        res.status(204).end()
    })

    produtos.options('/:id/estoque/increment/:qtd', (req, res) => {
        res.set('Access-Control-Allow-Methods', 'POST')
        res.set('Access-Control-Allow-Headers', 'Content-Type')
        res.status(204).end()
    })

    produtos.options('/:id/estoque/decrement', (req, res) => {
        res.set('Access-Control-Allow-Methods', 'POST')
        res.set('Access-Control-Allow-Headers', 'Content-Type')
        res.status(204).end()
    })

    produtos.options('/:id/estoque/decrement/:qtd', (req, res) => {
        res.set('Access-Control-Allow-Methods', 'POST')
        res.set('Access-Control-Allow-Headers', 'Content-Type')
        res.status(204).end()
    })

    // produtos de fornecedores
    produtos.get('', (req, res, next) => {
        const contentType = res.getHeader('Content-Type')
        const formato = new FormatsProduto(contentType)
        
        Produto
            .lista()
            .then(produtos => res.send(formato.saida(produtos)))
            .catch(error => next(error))
    })

    produtos.get('/:id', async (req, res, next) => {
        const contentType = res.getHeader('Content-Type')

        try {
            const id = parseInt(req.params.id)

            const formato = new FormatsProduto(contentType, 'dataCriacao', 'dataAtualizacao', 'versao')

            await Produto.dados({ id }).buscarPorId()

            const timestamp = (new Date(Produto.dataAtualizacao)).getTime()

            res.set('ETag', Produto.versao)
            res.set('Last-Modified', timestamp)
                
            res.send(formato.saida(Produto))
        } catch (error) {
            next(error)
        }
    })

    produtos.head('/:id', async (req, res, next) => { // reconhecendo uma rota
        const contentType = res.getHeader('Content-Type')

        try {
            const id = parseInt(req.params.id)

            const formato = new FormatsProduto(contentType, 'dataCriacao', 'dataAtualizacao', 'versao')

            await Produto.dados({ id }).buscarPorId()

            const timestamp = (new Date(Produto.dataAtualizacao)).getTime()

            res.set('ETag', Produto.versao)
            res.set('Last-Modified', timestamp)
                
            res.end()
        } catch (error) {
            next(error)
        }
    })

    produtos.post('', (req, res) => {
        res.status(405).end()
    })

    produtos.put('/:id', async (req, res, next) => {
        const contentType = res.getHeader('Content-Type')

        try {
            const id = parseInt(req.params.id)

            const formato = new FormatsProduto(contentType)

            const entradaDados = formato.entrada(req.body)

            delete entradaDados.idFornecedor
            delete entradaDados.id
            
            const dados = { id, ...entradaDados}
            
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
        const id = parseInt(req.params.id)

        Produto.dados({ id })
            .deleta()
            .then(() => res.status(204).end())
            .catch(error => next(error))
    })

    produtos.post('/:id/estoque/increment', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            
            Produto.dados({ id })
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

    produtos.post('/:id/estoque/increment/:qtd', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            const qtd = parseInt(req.params.qtd)

            Produto.dados({ id })
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

    produtos.post('/:id/estoque/decrement', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)

            Produto.dados({ id })
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

    produtos.post('/:id/estoque/decrement/:qtd', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            const qtd = parseInt(req.params.qtd)

            Produto.dados({ id })
            await Produto.buscarPorId()
            await Produto.controles().estoqueToggle(Produto.DECREMENT, qtd)
            await Produto.buscarPorId()

            const timestamp = (new Date(Produto.dataAtualizacao)).getTime()

            res.set('ETag', Produto.versao)
            res.set('Last-Modified', timestamp)

            res.end()
        } catch (e) {
            next(e)
        }
    })
}
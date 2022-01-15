const CampoInvalido = require('../../errors/campoInvalido')
const Vazio = require('../../errors/vazio')
const Repository = require('../../infraestrutura/repositorios/produtos')

class Produto {
    INCREMENT = 'increment'
    DECREMENT = 'decrement'

    constructor () {
        this.vericacaoTipo = ['criacao', 'atualizacao']

        this.allowedActions = ['increment', 'decrement']
        this.allowedfields = ['titulo', 'preco', 'estoque']
        this.prohibitedfields = ['idFornecedor']

        this._ehValido_titulo = (titulo) => typeof titulo === 'string' && titulo.length > 0
        this._ehValido_preco = (preco) => typeof preco === 'number' && preco > 0
        this._ehValido_estoque = (estoque) => typeof estoque === 'number' && estoque > 0

        this._validaAtualizacao = params => Object.keys(params).reduce((acc, key) => {
            if (this.allowedfields.indexOf(key) !== -1 && !this[`_ehValido_${key}`](params[key])) {
                acc.push(new CampoInvalido(key))
            }
            return acc
        }, [])
    }

    // entrada de dados
    dados ({ id, titulo, preco, estoque, idFornecedor, dataCriacao, dataAtualizacao, versao }) {
        this.id = id
        this.titulo = titulo
        this.preco = preco
        this.estoque = estoque
        this.idFornecedor = idFornecedor
        this.dataCriacao = dataCriacao
        this.dataAtualizacao = dataAtualizacao
        this.versao = versao

        return this
    }
    // mapea dados de saida
    _mapa ({ id, titulo, preco, estoque, idFornecedor, dataCriacao, dataAtualizacao, versao }) {
        this.dados({ id, titulo, preco, estoque, idFornecedor, dataCriacao, dataAtualizacao, versao })
        return { id, titulo, preco, estoque, idFornecedor, dataCriacao, dataAtualizacao, versao }
    }

    _dadosDeVerificacao () {
        const titulo = this.titulo ? { titulo: this.titulo } : ''
        const preco = this.preco ? { preco: this.preco } : ''
        const estoque = this.estoque ? { estoque: this.estoque } : ''
        return { ...titulo, ...preco, ...estoque }
    }

    _verificaDadosAtualizacao () {
        if (!Object.keys(this._dadosDeVerificacao()).length) {
            throw new Vazio() // novo erro criado
        }

        const errorValida = this._validaAtualizacao(this._dadosDeVerificacao())
        const existError = errorValida.length
        if (existError) {
            throw errorValida
        }
    }

    lista () {
        return Repository.lista()
    }

    async buscarPorId () {
        const produto = await Repository.buscarPorId(this.id)
        return this._mapa(produto)
    }

    async altera () {
        const id = this.id
        await Repository.buscarPorId(id)
        this._verificaDadosAtualizacao()
        await Repository.altera(id, this._dadosDeVerificacao())
    }

    async deleta () {
        await Repository.buscarPorId(this.id)
        await Repository.deleta(this.id)
    }

    controles () {
        
        this.estoqueToggle = (action, qtd = 1) => {

            if (!this.allowedActions.indexOf(action) === -1) {
                throw new Error('Ação não permitida!')
            }

            if (action === 'increment') {
                this.estoque = this.estoque + qtd
            }

            if (action === 'decrement') {
                if (qtd > this.estoque) {
                    throw new Error(`Estoque atual é ${this.estoque} e não pode ser diminuido menos que isso!`)
                }
                this.estoque = this.estoque - qtd
            }

            return Repository.toggle('estoque', this.id, this.estoque)
        }
        return this
    }

}

module.exports = new Produto()
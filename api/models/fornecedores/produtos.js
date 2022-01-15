const CampoInvalido = require('../../../errors/campoInvalido')
const Vazio = require('../../../errors/vazio')
const Repository = require('../../../infraestrutura/repositorios/fornecedores/produtos')

class Produto {
    INCREMENT = 'increment'
    DECREMENT = 'decrement'
    
    constructor () {
        this.vericacaoTipo = ['criacao', 'atualizacao']
        this.allowedfields = ['titulo', 'preco', 'estoque']
        this.allowedActions = ['increment', 'decrement']

        this._ehValido_titulo = (titulo) => typeof titulo === 'string' && titulo.length > 0
        this._ehValido_preco = (preco) => typeof preco === 'number' && preco > 0
        this._ehValido_estoque = (estoque) => typeof estoque === 'number' && estoque > 0

        this._validaCriacao = params => this._validacoes.filter(field => {
            const { name } = field
            const param = params[name]
            return !field.valido(param)
        })

        this._validaAtualizacao = params => Object.keys(params).reduce((acc, key) => {
            if (this.allowedfields.indexOf(key) !== -1) {
                if (!this[`_ehValido_${key}`](params[key])) {
                    acc.push(new CampoInvalido(key))
                }
            }
            return acc
        }, [])

        this._validacoes = [
            {
                name: 'titulo',
                valido: this._ehValido_titulo,
                message: 'Valor titulo não é válido'
            },
            {
                name: 'preco',
                valido: this._ehValido_preco,
                message: 'Valor preco não é válido'
            },
            {
                name: 'estoque',
                valido: this._ehValido_estoque,
                message: 'Valor estoque não é válido!'
            }
        ]
    }

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

    _mapa ({ id, titulo, preco, estoque, idFornecedor, dataCriacao, dataAtualizacao, versao }) {
        this.id = id
        this.titulo = titulo
        this.preco = preco
        this.estoque = estoque
        this.idFornecedor = idFornecedor
        this.dataCriacao = dataCriacao
        this.dataAtualizacao = dataAtualizacao
        this.versao = versao

        return { id, titulo, preco, estoque, idFornecedor, dataCriacao, dataAtualizacao, versao }
    }
    
    _dadosForamEnviados() {
        return this.titulo || this.preco || this.estoque
    }

    _dadosDeVerificacao() {
        const titulo = this.titulo ? { titulo: this.titulo } : ''
        const preco = this.preco ? { preco: this.preco } : ''
        const estoque = this.estoque ? { estoque: this.estoque } : ''
        return { ...titulo, ...preco, ...estoque }
    }

    // verificaçao de dados
    _verificaDados(tipo) {
        if (!this.vericacaoTipo.indexOf(tipo) === -1) {
            throw new Error('Tipo de verificação de dados não permitida')
        }
        if (!Object.keys(this._dadosDeVerificacao()).length) {
            throw new Vazio() // novo erro criado
        }
        
        if (tipo === 'criacao') {
            this._verificaDadosCriacao(this._dadosDeVerificacao())
        }

        if (tipo === 'atualizacao') {
            this._verificaDadosAtualizacao(this._dadosDeVerificacao())
        }

    }

    _verificaDadosCriacao(dados) {
        const errorValida = this._validaCriacao(dados)
        const existError = errorValida.length
        
        if (existError) {
            let errors = []
            errorValida.forEach(error => {
                errors.push(new CampoInvalido(error.name))
            })
            throw errors
        }
    }

    _verificaDadosAtualizacao(dados) {
        if (typeof dados !== 'object') {
            throw new Error('Erro de formaro de dados!')
        }
        
        const errorValida = this._validaAtualizacao(dados)
        const existError = errorValida.length
        if (existError) {
            throw errorValida
        }
    }

    // funções do modelo
    lista () {
        return Repository.lista(this.idFornecedor)
    }

    async criar () {
        const idFornecedor = this.idFornecedor
        this._verificaDados('criacao')
        const produto = await Repository.criar({ idFornecedor, ...this._dadosDeVerificacao()})
        return this._mapa(produto)
    }

    async buscarPorId() {
        const produto = await Repository.buscarPorId(this.idFornecedor, this.id)
        return this._mapa(produto)
    }

    async altera () {
        const id = this.id
        const idFornecedor = this.idFornecedor
        this._verificaDados('atualizacao')
        await Repository.buscarPorId(idFornecedor, id)
        await Repository.altera(idFornecedor, id, this._dadosDeVerificacao())
    }

    async deleta () {
        const id = this.id
        const idFornecedor = this.idFornecedor
        await Repository.buscarPorId(idFornecedor, id)
        await Repository.deleta(idFornecedor, id)
    }

    // controles do modelo
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

            return Repository.toggle('estoque', this.idFornecedor, this.id, this.estoque)
        }
        return this
    }

}

module.exports = new Produto()
const Repository = require('../../../infraestrutura/repositorios/fornecedores')
const CampoInvalido = require('../../../errors/campoInvalido')

class Fornecedor {
    constructor () {
        this._ehValido = (valor) => typeof valor === 'string' && valor.length > 0

        this._valida = params => this._validacoes.filter(field => {
            const { name } = field
            const param = params[name]
            return !field.valido(param)
        }) 

        this._validacoes = [
            {
                name: 'empresa',
                valido: this._ehValido,
                message: 'Valor empresa não pode ser vazio'
            },
            {
                name: 'email',
                valido: this._ehValido,
                message: 'Valor email não pode ser vazio'
            },
            {
                name: 'categoria',
                valido: this._ehValido,
                message: 'Valor categoria não pode ser vazio'
            }
        ]
    }

    dados ({ id, empresa, email, categoria, dataDeCriacao, dataDeAtualizacao, versao }) {
        this.id = id
        this.empresa = empresa
        this.email = email
        this.categoria = categoria,
        this.dataDeCriacao = dataDeCriacao
        this.dataDeAtualizacao = dataDeAtualizacao
        this.versao = versao

        return this
    }

    _mapa ({ id, empresa, email, categoria, dataDeCriacao, dataDeAtualizacao, versao }) {
        return { id, empresa, email, categoria, dataDeCriacao, dataDeAtualizacao, versao }
    }

    _verificaDados() {
        const dados = { empresa: this.empresa, email: this.email, categoria: this.categoria }
        const errorValida = this._valida(dados)
        const existError = errorValida.length

        if (existError) {
            let errors = []
            errorValida.forEach(error => {
                errors.push(new CampoInvalido(error.name))
            })
            throw errors
        }

        return dados
    }

    lista () {
        return Repository.lista()
    }

    async criar () { 
        const dados = this._verificaDados()

        const fornecedor = await Repository.criar(dados)

        return this._mapa(fornecedor)
    }

    async buscaPorId () {
        const fornecedor = await Repository.buscarPorId(this.id)

        return this._mapa(fornecedor)
    }

    async altera () {
        const id = this.id
        await Repository.buscarPorId(id)

        const dados = this._verificaDados()

        await Repository.altera(id, dados)
        return { id, ...dados }
    }

    async deleta () {
        const id  = this.id
        await Repository.buscarPorId(id)
        await Repository.deleta(id)
    }
}

module.exports = new Fornecedor()
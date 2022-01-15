const NaoEncontrado = require('../../errors/naoencontrado')
const Model = require('../tabelas/produtos/model')
const conexao = require('../../infraestrutura/conexao')

module.exports = {
    lista () {
        return Model.findAll({ raw: true })
    },
    async buscarPorId (id) {
        const produto = await Model.findOne({ where: { id }, raw: true })

        if (!produto) {
            throw new NaoEncontrado('produto')
        }

        return produto
    },
    altera (id, dados) {
        return Model.update(dados, { where: { id } })
    },
    deleta (id) {
        return Model.destroy({ where: { id } })
    },
    toggle(campo, id, qtdAtual) {
        return conexao.transaction( async (t) => {
            const produto = await Model.findOne({ where: { id } })
            produto[campo] = qtdAtual
            await produto.save()
            return produto
        })
    }
}
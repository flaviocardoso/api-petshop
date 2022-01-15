const NaoEncontrado = require('../../../errors/naoencontrado')
const Model = require('../../tabelas/produtos/model')
const conexao = require('../../../infraestrutura/conexao')

module.exports = {
    criar (dados) {
        return Model.create(dados)
    },
    lista (idFornecedor) {
        return Model.findAll({ where: { idFornecedor }, raw: true })
    },
    async buscarPorId(idFornecedor, id) {
        const produto = await Model.findOne({ where: { id, idFornecedor } })

        if (!produto) {
            throw new NaoEncontrado('produto')
        }

        return produto
    },
    altera (idFornecedor, id, dados) {
        return Model.update(dados, { where: { id, idFornecedor } })
    },
    deleta (idFornecedor, id) {
        return Model.destroy({ where: { id, idFornecedor } })
    },
    toggle(campo, idFornecedor, id, qtdAtual) {
        return conexao.transaction( async (t) => {
            const produto = await Model.findOne({ where: { id, idFornecedor } })
            produto[campo] = qtdAtual
            await produto.save()
            return produto
        })
    }
}
const Model = require('../../tabelas/fornecedores/model')
const NaoEncontrado = require('../../../errors/naoencontrado')

module.exports = {
    criar (dados) {
        return Model.create(dados)
    },
    lista () {
        return Model.findAll({ raw: true })
    },
    async buscarPorId (id) {
        const fornecedor = await Model.findOne({ where: { id } })

        if (!fornecedor) {
            throw new NaoEncontrado('fornecedor')  
        }

        return fornecedor
    },
    altera (id, dados) {
        return Model.update( dados, { where : { id } } )
    },
    deleta (id) {
        return Model.destroy( { where : { id } } )
    }
}
const Sequelise = require('sequelize')
const conexao = require('../../conexao')

const columns = {
    empresa: {
        type: Sequelise.STRING,
        allowNull: false
    },
    email: {
        type: Sequelise.STRING,
        allowNull: false
    },
    categoria: {
        type: Sequelise.ENUM('ração', 'brinquedores'),
        allowNull: false
    }
}

const option = {
    freezeTableName: true,
    tableName: 'fornecedores',
    timestamps: true,
    createdAt: 'dataDeCriacao',
    updatedAt: 'dataDeAtualizacao',
    version: 'versao'
}

module.exports = conexao.define('fornecedor', columns, option)
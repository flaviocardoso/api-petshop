const Sequelize = require('sequelize')
const conexao = require('../../conexao')

const columns = {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    preco: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    estoque: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    idFornecedor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: require('../fornecedores/model'),
            key: 'id'
        }
    }
}

const options = {
    freezeTableName: true,
    tableName: 'produtos',
    timestamps: true,
    createdAt: 'dataCriacao',
    updatedAt: 'dataAtualizacao',
    version: 'versao'
}

module.exports = conexao.define('produto', columns, options)
const models = [
    require('./fornecedores/model'),
    require('./produtos/model')
]

async function createTables () {
    for (let count = 0; count < models.length; count++) {
        const model = models[count]
        await model.sync()
    }
}

createTables()
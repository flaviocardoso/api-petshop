
class Vazio extends Error {
    constructor () {
        super('Não foram enviado dados!')
        this.name = 'Vazio'
        this.id = 4
    }
}

module.exports = Vazio
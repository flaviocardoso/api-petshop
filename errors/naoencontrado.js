
class NaoEncontrado extends Error {
    constructor (quem) {
        super(`Não foi encontrado: ${quem}`)
        this.name = 'NaoEncontrado'
        this.id = 1
    }
}

module.exports = NaoEncontrado
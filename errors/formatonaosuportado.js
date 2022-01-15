
class FormatoNaoSuportado extends Error {
    constructor (contentType) {
        super(`O tipo de conteúdo ${contentType} não é suportado`)
        this.name = 'FormatoNaosuportado'
        this.id = 0
    }
}

module.exports = FormatoNaoSuportado
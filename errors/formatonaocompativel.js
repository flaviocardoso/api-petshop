class FormatoNaoCompativel extends SyntaxError {
    constructor (contentType) {
        super(`O tipo de conteúdo não é compativel com ${contentType} `)
        this.name = 'FormatoNaoCompativel'
        this.id = 3
    }
}

module.exports = FormatoNaoCompativel
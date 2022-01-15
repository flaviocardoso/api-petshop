const Formats = require('./index').Formats

class FormatsFornecedor extends Formats {
    constructor (contentType, ...extras) {
        super()
        this.contentType = contentType
        this.campos = ['id', 'empresa', 'categoria', ...extras]
        this.sigle = 'fornecedor'
        this.many = 'fornecedores'
    }
}

module.exports = FormatsFornecedor
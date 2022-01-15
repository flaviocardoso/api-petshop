const Formats = require('./index').Formats

class FormatsErro extends Formats {
    constructor(contentType) {
        super()
        this.contentType = contentType
        this.campos = ['id', 'message', 'field']
        this.sigle = 'error'
        this.many = 'errors'
    }
}

module.exports = FormatsErro
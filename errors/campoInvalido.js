
class CampoInvalido extends Error {
    constructor (field) {
        const message = `Valor ${field} não é válido`
        super(message)
        this.name = 'CampoInvalido'
        this.field = field
    }
}

module.exports = CampoInvalido
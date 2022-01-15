const { Formats } = require(".");

class FormatsProduto extends Formats{
    constructor (contentType, ...extras) {
        super()
        this.contentType = contentType
        this.campos = ['id', 'titulo', 'preco', 'estoque', ...extras]
        this.sigle = 'produto'
        this.plural = 'produtos'
    }
}
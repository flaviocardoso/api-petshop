const jsontoxml = require('jsontoxml')
const xml2json = require('xml2json')

const FormatoNaoSuportado = require("../errors/formatonaosuportado")
const FormatoNaoCompativel = require("../errors/formatonaocompativel")

const formatosAceitos = ['application/json', 'application/xml']


class Formats {
    _json (dados) {
        return JSON.stringify(dados)
    }

    _json_xml (dados) {
        let sigleormany = this.sigle

        if (Array.isArray(dados)) {
            dados = dados.map((item) => {
                return { [ this.sigle ] : item } 
            })
            sigleormany = this.many
        }

        return jsontoxml({ [ sigleormany ] : dados })
    }

    _xml_json (dados) {
        const { data } = xml2json.toJson(dados, { object: true})
        
        return data
    }

    _buffer_json (dados) {
        let ent = Buffer.from(dados).toString()
        if (ent[0] === '<') {
            return this._xml_json(ent)
        }
        throw new SyntaxError(`Unexpected token ${ent[0]} in XML at position 0`)
    }
    

    entrada (dados) {
        if (this.contentType === 'application/xml' && dados instanceof Buffer) {
            return this._buffer_json(dados)
        }
        
        if (this.contentType === 'application/json' && !(dados instanceof Buffer)) {
            let ent = this._json(dados)
            if (ent[0] === '{') return dados
        }

        throw new FormatoNaoCompativel(this.contentType)
    }

    saida (dados) {
        if (this.contentType === 'application/json') {
            return this._json(this.filtrar(dados))//dados
        }

        if (this.contentType === 'application/xml') {
            return this._json_xml(this.filtrar(dados))
        }
        

        console.log(this.contentType);
        throw new FormatoNaoSuportado(this.contentType)    
    }

    filtrarObjeto(dados) {
        return Object.getOwnPropertyNames(dados).reduce((acc, key) => {
            if (this.campos.indexOf(key) !== -1) {
                acc[key] = dados[key]
            }
            return acc
        }, {})
    }

    filtrar(dados) {
        if (Array.isArray(dados)) {
            return dados.map(dado => this.filtrarObjeto(dado))
        } 
        return this.filtrarObjeto(dados)
    }
}

class FormatsFornecedor extends Formats {
    constructor (contentType, ...extras) {
        super()
        this.contentType = contentType
        this.campos = ['id', 'empresa', 'categoria', ...extras]
        this.sigle = 'fornecedor'
        this.many = 'fornecedores'
    }
}

class FormatsProduto extends Formats{
    constructor (contentType, ...extras) {
        super()
        this.contentType = contentType
        this.campos = ['id', 'titulo', 'preco', 'estoque', ...extras]
        this.sigle = 'produto'
        this.plural = 'produtos'
    }
}

class FormatsErro extends Formats {
    constructor(contentType) {
        super()
        this.contentType = contentType
        this.campos = ['id', 'message', 'field']
        this.sigle = 'error'
        this.many = 'errors'
    }
}

module.exports = {
    Formats,
    FormatsFornecedor,
    FormatsProduto,
    FormatsErro,
    formatos_aceitos : formatosAceitos
}
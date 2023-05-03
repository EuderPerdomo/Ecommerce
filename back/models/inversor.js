'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InversorSchema = Schema({
    producto: {type: Schema.ObjectId, ref: 'producto', required: true},
    salida_ac: [{type: Object, required: true}],
    entrada_dc: {type: Number,default: 0, required: true},
    potencia: {type: Number,default: 0, required: true},
    createdAt: {type:Date, default: Date.now, require: true}
});

module.exports =  mongoose.model('inversor',InversorSchema);
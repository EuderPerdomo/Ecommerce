'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Panel_solarSchema = Schema({
    producto: {type: Schema.ObjectId, ref: 'producto', required: true},
    vmp: {type: Number,default: 0, required: true},
    imp: {type: Number,default: 0, required: true},
    voc: {type: Number,default: 0, required: true},
    isc: {type: Number,default: 0, required: true},
    eficiencia: {type: Number,default: 0, required: true},
    tension: {type: Number,default: 0, required: true},
    potencia: {type: Number,default: 0, required: true},
    createdAt: {type:Date, default: Date.now, require: true}
});

module.exports =  mongoose.model('panel_solar',Panel_solarSchema);
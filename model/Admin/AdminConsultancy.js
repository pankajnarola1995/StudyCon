const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let random = require('mongoose-random');
//Create schema and modoles
let ConsultancySchema = Schema({
    _id: Schema.Types.ObjectId,
    country_name: String,
    flage_image: String,
    requirenment: String,
    detail: String,
    important_link: String

});
ConsultancySchema.plugin(random, { path: 'r' }); // by default `path` is `random`. It's used internally to store a random value on each doc.

let Consultancy = mongoose.model("Consultancy", ConsultancySchema);

module.exports = Consultancy;


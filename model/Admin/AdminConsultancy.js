const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema and modoles
let ConsultancySchema = Schema({
    _id: Schema.Types.ObjectId,
    country_name: String,
    flage_image: String,
    requirenment: String,
    detail: String,
    important_link: String

});
let Consultancy = mongoose.model("Consultancy", ConsultancySchema);

module.exports = Consultancy;


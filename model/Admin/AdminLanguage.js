const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema and modoles
let LanguageSchema = Schema({
    _id: Schema.Types.ObjectId,
    country_name: String,
    flage_image: String,
    requirenment: String,
    detail: String,
    important_link: String

});
let Language = mongoose.model("Language", LanguageSchema);

module.exports = Language;


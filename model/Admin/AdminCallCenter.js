const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema and modoles
let CallCenterSchema = Schema({
    _id: Schema.Types.ObjectId,
    CallCenter_name: String,
    flage_image: String,
    requirenment: String,
    detail: String,
    important_link: String

});
let CallCenter = mongoose.model("CallCenter", CallCenterSchema);

module.exports = CallCenter;


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema and modoles

let ImageSchema = Schema({
    //author: { type: Schema.Types.ObjectId, ref: 'Person' },
    consultancy_id: String,//{ type: Schema.Types.ObjectId, ref: 'Consultancy' },
    images_name: String,

});
let Image = mongoose.model("Image", ImageSchema);

module.exports = Image;


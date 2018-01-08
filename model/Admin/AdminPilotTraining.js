const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema and modoles
let PilotTrainingSchema = Schema({
    _id: Schema.Types.ObjectId,
    PilotTraining_name: String,
    flage_image: String,
    requirenment: String,
    detail: String,
    important_link: String

});
let PilotTraining = mongoose.model("PilotTraining", PilotTrainingSchema);

module.exports = PilotTraining;


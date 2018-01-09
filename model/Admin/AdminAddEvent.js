const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema and modoles
let AddEventSchema = mongoose.Schema({

    event_name: String,
    event_description: String,
    event_type: String,
    event_start:Date,
    event_end: Date,
    event_details: String,

    // images:String

});

//Admin Event handling

let AddEvent = mongoose.model("AddEvent", AddEventSchema);

module.exports = AddEvent;


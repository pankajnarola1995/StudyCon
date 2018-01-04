const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema and modoles

let contactSchema = Schema({

    Name: String,
    Subject: String,
    Email: String,
    Message: String

});

let contact = mongoose.model("contact", contactSchema);

module.exports = contact;


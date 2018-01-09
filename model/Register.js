const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema and modoles

let RegisterSchema = mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    date_of_birth: String,
    address: String,
    gender: String,
    nationality: String,
    highest_degree: String,
    intended_study_field: String,
    degree_sought: String,
    password: String,
    confirm_password: String,
});
let Register = mongoose.model("Register", RegisterSchema);

module.exports = Register;


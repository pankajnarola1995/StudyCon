const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema and modoles

let HomeBannerSchema = Schema({

    BannerName: String,


});

let HomeBanner = mongoose.model("HomeBanner", HomeBannerSchema);

module.exports = HomeBanner;


var mongoose = require("mongoose")
var articleSchema = mongoose.Schema({
    title: String,
    teaser: String,
    link: String
})
module.exports = mongoose.model("Article", articleSchema)
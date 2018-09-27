var mongoose = require("mongoose")
var commentsSchema = mongoose.Schema({
    text: String,
    articleID: String
})
module.exports = mongoose.model("Comment", commentsSchema)
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let path = require('path');
let ObjectId = Schema.ObjectId;

let imageSchema = new Schema({
    user_id: {type:ObjectId},
    filename: {type:String},
    title: {type:String},
    description: {type:String},
    views: {type: Number, 'default' :0},
    likes: {type: Number, 'default' :0},
    timestamp: {type:Date, 'default':Date.now},
})

imageSchema.virtual('uniqueId').get(function() {
        return this.filename.replace(path.extname(this.filename), '');
    }

);

module.exports = mongoose.model('image' , imageSchema);
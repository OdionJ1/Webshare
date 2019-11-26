const express = require('express');
let app = express();
let config = require('./server/configure');
let mongoose = require('mongoose');

app.set('PORT', process.env.PORT || 8080);
app.set('views' , __dirname + '/views')

app = config(app);

mongoose.connect('mongodb://localhost:27017/webshare', {useNewUrlParser:true , useUnifiedTopology:true});
mongoose.connection.on('error' , console.error.bind(console, 'Database Connection Error'))
mongoose.connection.once('open' , function(){
    console.log('Connection to Database')
})

let server = app.listen(app.get('PORT'), function(){
    console.log(`Server Listening at localhost:${app.get('PORT')}`);
});

require('./server/chat_server').initialize(server);
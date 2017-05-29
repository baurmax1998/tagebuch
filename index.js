// Setup basic express server
var fs = require("fs");
var path = "./database/";
var express = require('express');
const app = express();
var server = require('http').createServer(app);
var io = require('./socket.io/')(server);
var port = process.env.PORT || 3030;
server.listen(port, function() { //NOTE we start only with the database
    console.log('Server listening at port %d', port);
});
//write file test
//writeFile("test.txt", "Hello max from the Node writeFile method!");

// write file
function writeFile(name, content) {
    var absolutePath = (path + name);
    fs.writeFile(absolutePath, content, function(error) {
        if (error) {
            console.error("write error:  " + error.message);
        } else {
            console.log("Successful Write to " + absolutePath);
        }
    });
}

//read all files in dir init
var filesArr = readAllFilesInDir("./database/");

function readAllFilesInDir(folder) {
    fs.readdir(folder, (err, files) => {
        console.log(files);
        filesArr = files;
    });
    return filesArr;
}


//rests
app.get('/getDatei', function(req, res) {
    var data = getData(req);
    console.log(data);
    var content = "";
    if (data.datei.match(".*txt")) {
        content = fs.readFileSync(path + data.datei);
    }
    console.log(content);
    res.send(content);
});
// app.get('/addFile', function(req, res) {
//     var data = getData(req);
//     console.log(data);
//     writeFile(data.context, data.content);
//     readAllFilesInDir("./database/");
//     res.send("");
// });

app.get('/getFiles', function(req, res) {
    res.send(readAllFilesInDir("./database/"));
});

function getData(req) {
    for (var value in req.query) {
        return JSON.parse(value)
    }
}
// Routing
app.use(express.static(__dirname + '/public'));
// Chatroom
var numUsers = 0;
io.on('connection', function(socket) {
    var addedUser = false;
    // when the client emits 'edit', this listens and executes
    socket.on('edit', function(data) {
        // we tell the client to execute 'edit'
        console.log("es wurde was edit");
        console.log(data);
        if (!data.context.match(".*txt")) {
            data.context = data.context + ".txt";
            //update filesArr
            readAllFilesInDir("./database/");
        }
        writeFile(data.context, data.content);

        socket.broadcast.emit('edit', {
            username: "socket.username",
            message: data.content
        });
    });
});
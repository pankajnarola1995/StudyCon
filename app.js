let express = require('express');
let app = express();
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let assert = require('assert');
let fileUpload = require('express-fileupload');
let io = require('socket.io')();
let uuid = require('node-uuid');
let btoa = require('btoa');
var server = require('http').Server(app);
let session = require('express-session');

//database connection
let dbConn = mongoose.connect('mongodb://localhost/StudyConDb', {
    useMongoClient: true,
    /* other options */
});
if (dbConn) {
    console.log('success');
    server.listen(3000, function() {
        console.log('Server started ' + 3000 + ' at ' +
            (new Date().toLocaleString().substr(0, 24)));
    });
    io.attach(server, {
        'pingInterval': 15000,
        'pingTimeout': 15000
    });
} else {
    console.log('success');
}
//Session
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true,
   // cookie: { secure: true }
}));
app.use(function(req, res, next) {
    res.locals.email = req.session.email;
    res.locals.EmailId =req.session.EmailId;
    next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'model')));

//redirection of file to the particular pages
app.use('/', require('./routes/index'));
app.use('/signin', require('./routes/signin'));
app.use('/register', require('./routes/register'));

app.use('/home', require('./routes/home'));
app.use('/MoreDetails', require('./routes/MoreDetails'));

app.use('/Admin', require('./routes/Admin/AdminLogin'));
app.use('/AdminIndex', require('./routes/Admin/AdminIndex'));
app.use('/Admin/AdminContactView', require('./routes/Admin/AdminContactView'));
app.use('/Admin/AdminConsultancy', require('./routes/Admin/AdminConsultancy'));
app.use('/Admin/AdminLanguage', require('./routes/Admin/AdminLanguage'));
app.use('/Admin/AdminCallCenter', require('./routes/Admin/AdminCallCenter'));
app.use('/Admin/AdminPilotTraining', require('./routes/Admin/AdminPilotTraining'));
app.use('/Admin/AdminHomeBanner', require('./routes/Admin/AdminHomeBanner'));
app.use('/Admin/AdminAddEvent', require('./routes/Admin/AdminAddEvent'));

app.use('/Admin/AdminUserProfile', require('./routes/Admin/AdminUserProfile'));


app.use('/adminURL', require('./routes/Admin/adminchat'));

app.use(fileUpload());


app.get('/ajaxcall',  (req, res) => {
    contact.find(function (err, data) {
        if (data) {
            console.log("Contact Data Fetched");
            res.send(data);
            //res.render('Admin/AdminContactView',{contact:data});
        }
        else {
            res.status(400).send(err);
        }
    });
    console.log("Ajax working");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

var AddUserSchema = new mongoose.Schema({
    Name:String,
    Email:String,
    Phone:String,
    roomID:String
});
var AddUser = mongoose.model('AddUser',AddUserSchema);

var MessageSchema = new mongoose.Schema({
    who:String,
    what:String,
    when: Date
});
var AddMsg = mongoose.model('AddMsg',MessageSchema);


var admins = {};
var users = {};





io.on('connection', function(socket) {
    //Login Admin
    socket.on('login', function(data) {
        if (btoa(data.password) != 'cGFzc3dvcmQ=')
            socket.emit('login', {
                login: false,
                err: "Invalid Login"
            })
        else {
            if (_.find('admin', function(admin) {
                    return ('admin' == data.admin);
                })) {
                if (admins[data.admin]) {
                    socket.emit('login', {
                        login: false,
                        err: "Already Logged In"
                    })
                } else {
                    socket.emit('login', {
                        login: true
                    })
                }

            } else {
                socket.emit('login', {
                    login: false,
                    err: "Invalid Login"
                })
            }
        }
    });
    //Init admin
    socket.on('add admin', function(data) {
        this.isAdmin = data.isAdmin;
        socket.username = data.admin;

        _.each(admins, function(adminSocket) {
            adminSocket.emit("admin added", socket.username)
            //socket.emit("admin added", adminSocket.username)
        });

        admins[socket.username] = socket;

        //If some user is already online on chat
        if (Object.keys(users).length > 0) {
            _.each(users, function(userSocket) {

                AddMsg.find({roomID: userSocket.roomID},function (err,res) {

                })
                    .then(function(history) {
                        var len = history.length;
                        var userSocket = users[history[len - 1]];
                        history.splice(-1, 1);
                        socket.join(userSocket.roomID);
                        console.log()
                        socket.emit("New Client", {
                            roomID: userSocket.roomID,
                            history: history,
                            details: userSocket.userDetails,
                            justJoined: true
                        })
                    })
            });
        }
    });
    //Init user
    socket.on('add user', function(data) {
        socket.isAdmin = false;
        if (data.isNewUser) {
            data.roomID = uuid.v4();
            var AdduserData = new AddUser(data)
            AdduserData.save();

            socket.emit("roomID", data.roomID);
        }
        socket.roomID = data.roomID;
        //Fetch user details
        AddUser.find({roomID:socket.roomID}, function(err,details){

        })
            .then(function(details) {
                socket.userDetails = details;
                console.log(socket.userDetails )
            })
            .catch(function(error) {
                console.log("Line 95 : ", error)
            })

        socket.join(socket.roomID);
        var newUser = false;
        if (!users[socket.roomID]) {  // Check if different instance of same user. (ie. Multiple tabs)
            users[socket.roomID] = socket;
            newUser = true;
        }
        AddUser.find({roomID:socket.roomID}, function(err,details){
        })
            .then(function(history) {
                history.splice(-1, 1)
                socket.emit('chat history', {
                    history: history,
                    getMore: false
                });
                if (Object.keys(admins).length == 0) {
                    //Tell user he will be contacted asap and send admin email
                    socket.emit('log message', "Thank you for reaching us." +
                        " Please leave your message here and we will get back to you shortly.");
                    /*mail.alertMail();*/
                } else {
                    if (newUser) {
                        console.log(data.roomID);
                        AddUser.find({roomID:socket.roomID}, function(err,details){
                            console.log(details);
                        })
                        socket.emit('log message', "Hello " + socket.userDetails[0].Name + ", How can I help you?");

                        //Make all available admins join this users room.
                        _.each(admins, function(adminSocket) {
                            adminSocket.join(socket.roomID);
                            adminSocket.emit("New Client", {
                                roomID: socket.roomID,
                                history: history,
                                details: socket.userDetails,
                                justJoined: false
                            })
                        });
                    }
                }
            })
            .catch(function(error) {
                console.log("Line 132 : ", error)
            })

    });

    socket.on('chat message', function(data) {
        if (data.roomID === "null")
            data.roomID = socket.roomID;
        data.isAdmin = socket.isAdmin;

        var AddMsgData = new AddMsg({
            who:data.isAdmin,
            what:data.msg,
            when:data.timestamp
        });
        AddMsgData.save(data);
        console.log(AddMsgData);
        socket.broadcast.to(data.roomID).emit('chat message', data);
    });

    socket.on("typing", function(data) {
        socket.broadcast.to(data.roomID).emit("typing", {
            isTyping: data.isTyping,
            person: data.person,
            roomID: data.roomID
        });
    });

    socket.on('disconnect', function() {
        if (socket.isAdmin) {
            delete admins[socket.username];
            _.each(admins, function(adminSocket) {
                adminSocket.emit("admin removed", socket.username)
            });
        } else {
            if (io.sockets.adapter.rooms[socket.roomID]) {
                var total = io.sockets.adapter.rooms[socket.roomID]["length"];
                var totAdmins = Object.keys(admins).length;
                var clients = total - totAdmins;
                if (clients == 0) {
                    //check if user reconnects in 4 seconds
                    setTimeout(function() {
                        if (io.sockets.adapter.rooms[socket.roomID])
                            total = io.sockets.adapter.rooms[socket.roomID]["length"];
                        totAdmins = Object.keys(admins).length;
                        if (total <= totAdmins) {
                            /*mail.sendMail({
                                roomID: socket.roomID,
                                MsgLen: socket.TotalMsgLen,
                                email: socket.userDetails
                            });*/
                            delete users[socket.roomID];
                            socket.broadcast.to(socket.roomID).emit("User Disconnected", socket.roomID);
                            _.each(admins, function(adminSocket) {
                                adminSocket.leave(socket.roomID)
                            });
                        }
                    }, 4000);
                }
            } else {
                if (socket.userDetails)
                /*mail.sendMail({
                    roomID: socket.roomID,
                    MsgLen: socket.TotalMsgLen,
                    email: socket.userDetails
                });*/
                    delete users[socket.roomID];
            }
        }
    });

    socket.on('poke admin', function(targetAdmin) {
        admins[targetAdmin].emit("poke admin", {})
    });

    socket.on('client ack', function() {
        for (adminSocket in admins) {
            if (!admins.hasOwnProperty(adminSocket)) {
                continue;
            }
            admins[adminSocket].emit("client ack", {})
        }
    });

    socket.on("more messages", function() {
        if (socket.MsgHistoryLen < 0) {
            AddUser.find({roomID:socket.roomID }, function(){

            })
                .then(function(history) {
                    history.splice(-1, 1)
                    socket.emit('more chat history', {
                        history: history
                    });
                })
            socket.MsgHistoryLen += 10;
        }
    });
});


module.exports = app;
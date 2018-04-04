const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const nodemailer = require("nodemailer");
const fs = require("fs");
const clientTwilio = require("twilio")('*****', '*****');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mail = require('./js/mail');

const port = 8000;

var code = parseInt(Math.random() * (9999 - 1999) + 1999);
var verfCode = code;

//  Конектимось до пошти  
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: mail.login,
        pass: mail.password
    }
});

//  MYSQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'Polianskyi',
    password: '0987hgyt_Qwe_1',
    database: 'storedb'
});

//Клієнтська частина сайту знаходитиметься у папці public
app.use(express.static(__dirname + '/public'));
//Стандарти кодування
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    'extended': 'true'
}));

//  config for img Upload
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/img')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname)
    }
});

var upload = multer({
    storage: storage
}).any();

//  send img to server
app.post('/multer', function (req, res) {
    upload(req, res, function (err) {
        if (err) throw err;
        res.json({
            success: true,
            message: 'Uploaded'
        });
    })
});

var chat = {};
fs.readFile('chatMessages.json', function (err, data) {
    if (err) {
        console.log(err);
    } else {
        chat = JSON.parse(data);
        console.log("Chat data Readed!");
    }
});


let listOfGoodsAttendance = [];
fs.readFile('increaseAttendanceOfTheGoods.json', function (err, data) {
    if (err) {
        console.log(err);
    } else {
        listOfGoodsAttendance = JSON.parse(data);
        console.log("Data about Attendance of the goods readed!");
    }
});

//  Socket
io.sockets.on('connection', function (socket) {

    // add new user
    socket.on("signUp", function (data) {
        const has = Object.prototype.hasOwnProperty; // cache the lookup once, in module scope.
        if (!has.call(data, "name") &&
            !has.call(data, "login") &&
            !has.call(data, "password") &&
            !has.call(data, "email") &&
            !has.call(data, "verCode")) {

            socket.emit("getResSignUp", "Error");
            return;
        }

        connection.query('SELECT * FROM listofusers WHERE login = ?', data.login, function (err, rows) {
            if (err) throw err;
            if (rows[0] == undefined) {
                if (data.verCode == verfCode) {
                    connection.query('INSERT INTO listofusers SET name = ?, login = ?, password = ?, email = ?', [data.name, data.login, data.password, data.email], function (err, result) {
                        if (err) throw err;
                        console.log('users added to database');
                        socket.emit("getResSignUp", data.login + " created");
                    })
                } else {
                    socket.emit("getResSignUp", "Error ver. code");
                }
            } else {
                socket.emit("getResSignUp", "pls choose another login");
            }
        })
    });

    socket.on("verificationCode", function (data) {
        const has = Object.prototype.hasOwnProperty;
        if (!has.call(data, "phone")) {
            socket.emit("getResVerificationCode", "Error");
            return;
        }

        verfCode = parseInt(Math.random() * (9999 - 1999) + 1999);

        clientTwilio.messages.create({
            to: data.phone,
            from: '+18302613396',
            body: 'code: ' + verfCode
        }, function (err, message) {
            if (err) {
                socket.emit("getResVerificationCode", err);
            }
            socket.emit("getResVerificationCode", "Success");
        });
    });

    socket.on("remindPassword", function (data) {
        if ((typeof data) !== "string") {
            socket.emit("getResRemindPassword", "Wrong mail");
            return;
        }

        connection.query('SELECT * FROM listofusers WHERE email = ?', data, function (err, rows) {
            if (err) throw err;

            if (rows[0] === undefined) {
                socket.emit("getResRemindPassword", "Wrong mail");
                return;
            }

            var mailOptions = {
                //  to: "ipolianskyi@gmail.com",
                to: data,
                subject: "Password for user \"" + rows[0].name + "\"",
                text: rows[0].password
            }

            smtpTransport.sendMail(mailOptions, function (error, response) {
                if (error) {
                    console.log(error);
                } else {
                    socket.emit("getResRemindPassword", "Password sent!");
                }
            });
        });
    });

    //  first get of goods 
    socket.on("goodsByCount", function (data) {
        const has = Object.prototype.hasOwnProperty;
        if (!has.call(data, "count")) {
            socket.emit("getResGoodsByCount", "Error");
            return;
        }

        connection.query('select * from listofgoods LIMIT 0, ?', data.count, function (err, rows) {
            if (err) throw err;
            socket.emit("getResGoodsByCount", rows);
        });
    });

    socket.on("getMoreGoods", function (data) {
        const has = Object.prototype.hasOwnProperty;
        if (!has.call(data, "currentCount") &&
            !has.call(data, "count")) {
            socket.emit("getResGetMoreGoods", "Error");
            return;
        }

        connection.query('select * from listofgoods  LIMIT ?, ?', [data.currentCount, data.count], function (err, rows) {
            if (err) throw err;
            socket.emit("getResGetMoreGoods", rows);
        });
    });

    socket.on("userLogin", function (data) {
        const has = Object.prototype.hasOwnProperty;
        if (!has.call(data, "login") &&
            !has.call(data, "password")) {
            socket.emit("getResUserLogin", "Error");
            return;
        }

        connection.query('select * from listofusers', function (err, rows) {
            if (err) throw err;

            for (var i = 0; i < rows.length; i++) {
                if (rows[i].login == data.login) {
                    if (rows[i].password == data.password) {
                        socket.emit("getResUserLogin", JSON.stringify(rows[i]));
                        break;
                    } else {
                        socket.emit("getResUserLogin", "Wrong Password");
                        break;
                    }
                } else {
                    if (i == rows.length - 1) {
                        socket.emit("getResUserLogin", "Wrong Login");
                    }
                }

            }

        });
    });

    socket.on("sendCart", function (data) {
        const has = Object.prototype.hasOwnProperty;
        if (!has.call(data, "firstName") &&
            !has.call(data, "secondName") &&
            !has.call(data, "phone") &&
            !has.call(data, "email") &&
            !has.call(data, "city") &&
            !has.call(data, "address") &&
            !has.call(data, "additionalInformation") &&
            !has.call(data, "orderGoodsCount") &&
            !has.call(data, "cartListOfGoodsforAdmin")) {
            socket.emit("getResSendCart", "Error");
            return;
        }

        //  Messege
        var mes = "";
        mes += "User info: \n";
        mes += "First name: " + data.firstName + "\n";
        mes += "Second name:" + data.secondName + "\n";
        mes += "Phone: " + data.phone + "\n";
        mes += "Email: " + data.email + "\n\n";
        mes += "Order: \n";
        for (var i = 0; i < data.cartListOfGoodsforAdmin.length; i++) {
            mes += "№ " + (i + 1) + " Name: " + data.cartListOfGoodsforAdmin[i].name + " Price: " + data.cartListOfGoodsforAdmin[i].price + " Category: " + data.cartListOfGoodsforAdmin[i].category + " Count: " + data.cartListOfGoodsforAdmin[i].countOfOneGood + "\n";
        }
        //  (end) Messege

        var mailOptions = {
            to: "ipolianskyi@gmail.com",
            subject: "Cart",
            text: mes
        }

        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error)
                console.log(error);
        });

        connection.query("INSERT INTO `storedb`.`listoforders` (`firstName`, `secondName`, `phone`, `email`, `city`, `address`, `additionalInformation`, `orderGoodsCount`) VALUES " + "('" + data.firstName + "', '" + data.secondName + "', '" + data.phone + "', '" + data.email + "', '" + data.city + "', '" + data.address + "', '" + data.additionalInformation + "', '" + JSON.stringify(data.orderGoodsCount) + "')", function (err) {
            if (err) throw err;
            socket.emit("getResSendCart", "Success");
        });
    });

    socket.on("selectedGood", function (data) {
        const has = Object.prototype.hasOwnProperty;
        if (!has.call(data, "id")) {
            socket.emit("getResSelectedGood", "Error");
            return;
        }

        connection.query('select * from listofgoods where id = ?', data.id, function (err, rows) {
            if (err) throw err;
            socket.emit("getResSelectedGood", rows[0]);
        });
    });

    socket.on("selectedGoodForAdmin", function (data) {
        const has = Object.prototype.hasOwnProperty;
        if (!has.call(data, "id")) {
            socket.emit("getResSelectedGood", "Error");
            return;
        }

        connection.query('select * from listofgoods where id = ?', data.id, function (err, rows) {
            if (err) throw err;
            socket.emit("getResSelectedGoodForAdmin", rows[0]);
        });
    });

    socket.on("saveCommentOfGoodToDb", function (data) {
        const has = Object.prototype.hasOwnProperty;
        if (!has.call(data, "selectedGoodId") &&
            !has.call(data, "comments")) {

            console.log("Error");
            return;
        }

        if (!has.call(data.comment, "name") &&
            !has.call(data.comment, "content") &&
            !has.call(data.comment, "date")) {

            console.log("Error");
            return;
        }

        if (data.selectedGoodId === null) {
            console.log("Error 'data.selectedGoodId === null'");
            return;
        }

        if (data.comment.name == "" || data.comment.content == "" || data.comment.date == "") {
            console.log("Error: data.comment.name == '' || data.comment.content == '' || data.comment.date == ''");
            return;
        }

        let listOfComments = [];
        connection.query("select * from listofgoods WHERE id = ?", data.selectedGoodId, function (err, rows) {
            if (err) throw err;

            if (rows[0] === undefined) {
                console.log("Error 'rows[0] === undefined'");
                return;
            }

            if (rows[0].comments !== undefined && rows[0].comments !== null && rows[0].comments !== "") {
                listOfComments = JSON.parse(rows[0].comments);
            }
            listOfComments.push(data.comment);

            connection.query("UPDATE listofgoods SET comments = ? WHERE id = ?", [JSON.stringify(listOfComments), data.selectedGoodId], function (err, rows) {
                if (err) throw err;
                socket.emit("getResSaveCommentOfGoodToDb", "Success");
            });

        });
    });

    socket.on("sendMessage", function (data) {
        const has = Object.prototype.hasOwnProperty;
        if (!has.call(data, "name") &&
            !has.call(data, "email") &&
            !has.call(data, "phone") &&
            !has.call(data, "message")) {
            socket.emit("getResSendMessage", "Error");
            return;
        }

        connection.query("insert into `storedb`.`listofcontactmessages` (`name`, `email`, `phone`, `message`) values ('" + data.name + "', '" + data.email + "', '" + data.phone + "', '" + data.message + "')", function (err) {
            if (err) throw err;
            socket.emit("getResSendMessage", "Message sended");
        });
    });


    //  Admin
    socket.on("goods", function () {
        connection.query('select * from listofgoods', function (err, rows) {
            if (err) throw err;
            socket.emit("getResGoods", rows);
        });
    });

    socket.on("orders", function () {
        connection.query('select * from listoforders', function (err, rows) {
            if (err) throw err;
            socket.emit("getResOrders", rows);
        });
    });

    socket.on("messages", function () {
        connection.query("select * from listofcontactmessages", function (err, rows) {
            if (err) throw err;
            socket.emit("resGetMessages", rows);
        });
    });

    socket.on("selectGoodsByOrder", function (data) {
        const has = Object.prototype.hasOwnProperty;
        if (!has.call(data, "order")) {
            socket.emit("resGetGoodsByOrder", "Error");
            return;
        }

        let stringOfIds = "";
        for (let i = 0; i < data.order.length; i++) {
            if (i !== data.order.length - 1) {
                stringOfIds += ' id = "' + data.order[i].id + '" or ';
            } else {
                stringOfIds += ' id = "' + data.order[i].id + '"';
            }
        }

        connection.query('select * from listofgoods where ' + stringOfIds, function (err, rows) {
            if (err) throw err;

            let listOfOrderGoods = [];
            for (let i = 0; i < rows.length; i++) {
                listOfOrderGoods.push(rows[i]);
                listOfOrderGoods[i].orderGoodsCount = data.order.find(item => item.id == rows[i].id).count;
            }

            socket.emit("resGetGoodsByOrder", listOfOrderGoods);
        });
    });

    socket.on("addNewGood", function (data) {
        const has = Object.prototype.hasOwnProperty;
        if (!has.call(data, "name") &&
            !has.call(data, "price") &&
            !has.call(data, "category") &&
            !has.call(data, "src") &&
            !has.call(data, "new_good") &&
            !has.call(data, "save_money") &&
            !has.call(data, "old_price") &&
            !has.call(data, "top_good")) {
            socket.emit("getResAddNewGood", "Error");
            return;
        }

        connection.query('insert into listofgoods set ?', data, function (err, res) {
            if (err) throw err;
            socket.emit("getResAddNewGood", "Item added to database with id: " + res.insertId);
        });
    });

    socket.on("deleteGood", function (data) {
        const has = Object.prototype.hasOwnProperty;
        if (!has.call(data, "id")) {
            socket.emit("getResDeleteGood", "Error");
            return;
        }

        connection.query('DELETE FROM listofgoods WHERE id = ?', data.id, function (err) {
            if (err) throw err;
            socket.emit("getResDeleteGood", "Element with id: " + data.id + " removed");
        });
    });

    socket.on("changeGood", function (data) {
        const has = Object.prototype.hasOwnProperty;
        if (!has.call(data, "id") &&
            !has.call(data, "name") &&
            !has.call(data, "price") &&
            !has.call(data, "category") &&
            !has.call(data, "src") &&
            !has.call(data, "new_good") &&
            !has.call(data, "save_money") &&
            !has.call(data, "old_price") &&
            !has.call(data, "top_good")) {
            socket.emit("getResChangeGood", "Error");
            return;
        }

        connection.query("UPDATE listofgoods SET name = '" + data.name + "', price = '" + data.price + "',  category = '" + data.category + "', src = '" + data.src + "', new_good = '" + data.new_good + "', save_money = '" + data.save_money + "', old_price = '" + data.old_price + "', top_good = '" + data.top_good + "' WHERE id = '" + data.id + "'", function (err) {
            if (err) throw err;
            socket.emit("getResChangeGood", "Element with id: " + data.id + " changed.");
        });
    });
    //  (end) Admin

    //  Chat

    socket.on("setRoom", function (data) {
        socket.join(data);
    });

    socket.on("getListOfChatMessages", function (data) {
        io.to(socket.rooms[data]).emit("resGetListOfMessages", chat[data]);
    });

    socket.on("getListOfAllChatMessagesForAdmin", function (data) {
        io.to(socket.rooms[data]).emit("resGetListOfAllChatMessagesForAdmin", chat);
    });

    socket.on("getListOfUser", function (data) {
        io.to(socket.rooms[data]).emit("resGetListOfUser", chat);
    });

    socket.on('sendMessageToServer', function (data) {
        if (chat[data.room] === undefined) {
            chat[data.room] = [];
        }

        chat[data.room].push(data);
        socket.join("admin");

        io.to(socket.rooms[data.room]).emit("resGetListOfMessages", chat[data.room]);
        io.to(socket.rooms["admin"]).emit("resGetListOfAllChatMessagesForAdmin", chat);

        fs.writeFile('chatMessages.json', JSON.stringify(chat), function (err) {
            if (err) throw err;
            console.log('Chat data Saved!');
        });
    });

    //  (end) Chat

    socket.on('increaseAttendanceOfTheSelectedGood', function (data) {
        if (!listOfGoodsAttendance.some(i => i.id === data.id)) {
            listOfGoodsAttendance.push({
                id: data.id,
                countOfVisitors: 1
            });
        } else {
            (listOfGoodsAttendance.find(i => i.id === data.id)).countOfVisitors = 1 + (listOfGoodsAttendance.find(i => i.id === data.id)).countOfVisitors;
        };

        socket.emit("getResIncreaseAttendanceOfTheSelectedGood", {
            id: data.id,
            countOfVisitors: listOfGoodsAttendance.find(i => i.id === data.id).countOfVisitors
        });

        fs.writeFile('increaseAttendanceOfTheGoods.json', JSON.stringify(listOfGoodsAttendance), function (err) {
            if (err) throw err;
            console.log('Data about Attendance of the goods saved!');
        });

    });

    socket.on("getAllAttendanceOfTheGoods", function (data) {
        socket.emit("getResAllAttendanceOfTheGoods", listOfGoodsAttendance);
    });

});

app.get("*", function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

server.listen(port, function (error) {
    if (error) throw error;
    console.log("Server started on the port " + port + "!");
});

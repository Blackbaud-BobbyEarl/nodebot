// keyControl.js
var keypress = require("keypress");
var Spark = require("spark-io");
var five = require("johnny-five");
var Sumobot = require("sumobot")(five);
var board = new five.Board({
    io: new Spark({
        token: 'b427b3eb920dc1f7678d267457bbdbb5a97041ea',
        deviceId: '54ff6d066667515139371367'
    })
});

var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(3000);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

keypress(process.stdin);
board.on("ready", function() {

    var servoLeft = new five.Servo({
        pin: 'D0',
        type: 'continuous'
    });

    var servoRight = new five.Servo({
        pin: 'D1',
        type: 'continuous'
    });

    var servoFront = new five.Servo({
        pin: 'A0',
        type: 'continuous'
    });

    var ledBrake = new five.Led({
        pin: 'D6'
    });

    var ledHeadlight = new five.Led({
        pin: 'D7'
    });

    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', function(ch, key) {
        processKey(key.name);
    });

    io.on('connection', function (socket) {
        socket.on('keydown', function (e) {
            processKey(e.name);
        });
    });

    function processKey(key) {
        console.log('processing: ' + key);
        switch (key) {
            case 'up':
                servoLeft.ccw(1);
                servoRight.cw(1);
                ledHeadlight.on();
                ledBrake.off();
            break;
            case 'down':
                servoLeft.cw(1);
                servoRight.ccw(1);
                ledHeadlight.off();
                ledBrake.on();
            break;
            case 'left':
                servoRight.stop();
                servoLeft.ccw(1);
            break;
            case 'right':
                servoLeft.stop();
                servoRight.cw(1);
            break;
            case 'space':
                servoLeft.stop();
                servoRight.stop();
                servoFront.stop();
                ledHeadlight.off();
                ledBrake.off();
            break;
            case 'e':
                servoFront.ccw(1);
            break;
            case 'f':
                servoFront.cw(1);
            break;
            case 'b':
                servoFront.sweep();
            break;
            case 'q':
                servoLeft.stop();
                servoRight.stop();
                servoFront.stop();
                ledHeadlight.off();
                ledBrake.off();
                process.exit();
            break;
        }
    }

});

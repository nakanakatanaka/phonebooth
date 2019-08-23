let express = require("express");
let app = express();

//１:モジュールのロード
const http = require("http");
const fs = require("fs");

// CORSを許可する
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//４:待ち受け開始
//server.listen(3000);
const server = app.listen(3000, () => {
  console.log("node.js is listning to port:" + server.address().port);
});

let returnData = [
    {
      id: "left",
      isOccupied: ""
    },
    /*{
      id: "right",
      isOccupied: ""
    }*/
  ];

// obnizの設定
const Obniz = require("obniz");
// センサー　
const obniz1 = new Obniz("0667-4000");
/*
obniz1を接続後、obniz2の接続
*/
obniz1.onconnect = async function() {
  // パトランプ
  const obniz2 = new Obniz("3849-2551");
  obniz2.onconnect = async function() {
    const humanDetector = obniz1.wired("HC-SR505", { vcc: 2, gnd: 0, signal: 1 });
    const ledRed = obniz2.wired("LED", { anode: 7, cathode: 8 });
    const ledGreen = obniz2.wired("LED", { anode: 9, cathode: 10 });

    humanDetector.onchange = function(val) {
      obniz1.display.clear();
      obniz1.display.print(val ? "detected!" : "not detected");
      if (val) {
        ledRed.on();
        ledGreen.off();
      } else {
        ledRed.off();
        ledGreen.on();
      }
      returnData[0].isOccupied = JSON.stringify(val);
    };
  };
};

// get送信
app.get("/get", function(req, res, next) {
  res.send(returnData);
});
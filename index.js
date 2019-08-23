let express = require("express");
let app = express();

//モジュールのロード
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

//待ち受け開始
const server = app.listen(3000, () => {
  console.log("node.js is listning to port:" + server.address().port);
});

let returnData = [
    {
      id: "left",
      isOccupied: ""
    }
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

    humanDetector.onchange = function(val) {
      obniz1.display.clear();
      obniz1.display.print(val ? "detected!" : "not detected");

      if(val){
        obniz2.io8.output(false);
        obniz2.io9.output(true);
        obniz2.io10.output(false);
        obniz2.io11.output(true);
      } else {
        obniz2.io8.output(false);
        obniz2.io9.output(true);
        obniz2.io10.output(true);
        obniz2.io11.output(true);
      }

      returnData[0].isOccupied = val;
    };
  };
};

// get送信
app.get("/get", function(req, res, next) {
  res.send(returnData);
});
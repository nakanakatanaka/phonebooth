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
    isOccupied: null
  },
  {
    id: "right",
    isOccupied: false
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
  const obniz2 = new Obniz("4887-8453");
  //const obniz2 = new Obniz("3849-2551");
  obniz2.onconnect = async function() {
    const humanDetector = obniz1.wired("HC-SR505", {
      vcc: 11,
      gnd: 9,
      signal: 10
    });
    const sonor = obniz1.wired("HC-SR04", {
      gnd: 3,
      echo: 2,
      trigger: 1,
      vcc: 0
    });

    let distanceVal = false;
    const main = () => {
      sonor.measure(distance => {
        if (distance < 600) {
          distanceVal = true;
        } else {
          distanceVal = false;
        }
      });
    };

    setInterval(main, 3000);

    humanDetector.onchange = function(val) {
      if (val || distanceVal) {
        obniz1.display.clear();
        obniz1.display.print("detected!");
        obniz2.io5.output(false);
        obniz2.io6.output(true);
        obniz2.io7.output(false);
        obniz2.io8.output(true);
      } else {
        obniz1.display.clear();
        obniz1.display.print("not detected");
        obniz2.io5.output(false);
        obniz2.io6.output(true);
        obniz2.io7.output(true);
        obniz2.io8.output(true);
      }
      returnData[0].isOccupied = val || distanceVal;
    };
  };
};

// 右側
const obniz3 = new Obniz("6225-8488");

obniz3.onconnect = async function() {
  // パトランプ
  const obniz4 = new Obniz("3849-2551");
  obniz4.onconnect = async function() {
    const humanDetector2 = obniz3.wired("HC-SR505", {
      vcc: 2,
      gnd: 0,
      signal: 1
    });
    const sonor2 = obniz3.wired("HC-SR04", {
      gnd: 11,
      echo: 10,
      trigger: 9,
      vcc: 8
    });

    let distanceVal2 = false;
    const main2 = () => {
      sonor2.measure(distance => {
        if (distance < 600) {
          distanceVal2 = true;
        } else {
          distanceVal2 = false;
        }
      });
    };

    setInterval(main2, 3000);

    humanDetector2.onchange = function(val) {
      if (val || distanceVal2) {
        obniz3.display.clear();
        obniz3.display.print("detected!");
        obniz4.io5.output(false);
        obniz4.io6.output(true);
        obniz4.io7.output(false);
        obniz4.io8.output(true);
      } else {
        obniz3.display.clear();
        obniz3.display.print("not detected");
        obniz4.io5.output(false);
        obniz4.io6.output(true);
        obniz4.io7.output(true);
        obniz4.io8.output(true);
      }

      returnData[1].isOccupied = val || distanceVal2;
    };
  };
};

// get送信
app.get("/get", function(req, res, next) {
  res.send(returnData);
});

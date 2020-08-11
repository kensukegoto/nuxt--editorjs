const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const fs = require('fs');

const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const storage = multer.diskStorage({
  // ファイルの保存先を指定(今回はsrc/public/image以下に画像を保存)
  destination: function (req, file, cb) {
      cb(null, './static')
  },
  // ファイル名を指定(オリジナルのファイル名を指定)
  filename: function (req, file, cb) {
      //　Math.random().toString(36).slice(-9)で乱数を生成
      const imageName = `${Math.random().toString(36).slice(-9)}_${Date.now()}.jpg`;
      console.log(imageName);
      cb(null, imageName)
  }
})

const upload = multer({
  storage: storage
}).single('file')


app.post('/image', (req, res) => {
  
  upload(req, res, (err) => {
      if (err) {
        console.log(err)
          //アップロード失敗した場合
          res.json({
              status: "error",
              error: "fail to uplord image"
          })
      } else {
          //アップロード成功した場合
          res.json({
              status: "sucess",
              // ファイル名を返す
              path: res.req.file.filename
          })
      }
  })
});

app.get("/article",(req,res) => {
  const jsonObject = JSON.parse(fs.readFileSync('./api/articles.json', 'utf8'));
  res.json(jsonObject);

});


module.exports = {
  path: "/api",
  handler: app
}
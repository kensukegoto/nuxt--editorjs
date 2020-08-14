const express = require("express");
const multer = require("multer");
// const bodyParser = require("body-parser");
const fs = require('fs');

const app = express()

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

const storage = multer.diskStorage({
  // ファイルの保存先を指定(今回はsrc/public/image以下に画像を保存)
  destination: function (req, file, cb) {
      cb(null, './static')
  },
  // ファイル名を指定(オリジナルのファイル名を指定)
  filename: function (req, file, cb) {

      //　Math.random().toString(36).slice(-9)で乱数を生成
      const imageName = `image/${Math.random().toString(36).slice(-9)}_${Date.now()}.jpg`;
      cb(null, imageName)
  }
})

const upload = multer({
  storage: storage
}).array('files')


// app.post("/create",
// multer().none(),
// (req,res,cb) => {
//   console.log(req)

//   cb()
// },
// (req,res) => {
//   console.log("来る？")
//   return res.json({ status: 200 })

// })
app.post('/create', (req, res) => {
  // 引数はコールバック
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
          let body = res.req.body;
          console.log(body)
          for(let i = 0,l = res.req.files.length;i < l;i++){
            const name = res.req.files[i].filename;
            body = Object.keys(body).map( key => {
              let item = {};
              if(key.startsWith("image")) {
                item[key] = name;
              } else {
                item[key] = body[key]
              }
              return item;
            })
          }

          res.json({
              status: "sucess",
              // ファイル名を返す
              body: body
              // path: res.req.file.filename
          })
      }
  })
});

app.get("/article",(req,res) => {
  const jsonObject = JSON.parse(fs.readFileSync('./api/articles.json', 'utf8'));
  res.json(jsonObject);
});
app.post("/article",(req,res) => {
  fs.writeFileSync('./api/articles.json', JSON.stringify(req.body));
  res.json({
    message: "ok"
  });
});


module.exports = {
  path: "/api",
  handler: app
}
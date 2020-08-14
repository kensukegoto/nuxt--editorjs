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

        // {
        //   "type":"h1",
        //   "data":{
        //     "text":"野十郎さんのお食事事情 1"
        //   }
        // },
        // {
        //   "type":"mv",
        //   "data":{
        //     "text":"/image/nyanco_01.jpg"
        //   }
        // },
          //アップロード成功した場合
          let body = res.req.body;
          body = Object.keys(body).map(k => {
            const tag = k.split("_")[0]
            return { type : tag, content : body[k]}
          })
          
          for(let i = 0,l = res.req.files.length;i < l;i++){
            const name = res.req.files[i].filename;
            body = body.map( item => {
              if(item.type.startsWith("image")) item.content = name;
              return item;
            })
          }

          res.json({
              status: "sucess",
              // ファイル名を返す
              body: body
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
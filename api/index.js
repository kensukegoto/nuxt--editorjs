const express = require("express");
const multer = require("multer");
const fs = require('fs');

const app = express()


const storage = multer.diskStorage({
  // ファイルの保存先を指定(今回はsrc/public/image以下に画像を保存)
  destination: function (req, file, cb) {
      cb(null, './static')
  },
  // ファイル名を指定(オリジナルのファイル名を指定)
  filename: function (req, file, cb) {
      //　Math.random().toString(36).slice(-9)で乱数を生成
      const imageName = `/image/${Math.random().toString(36).slice(-9)}_${Date.now()}.jpg`;
      cb(null, imageName)
  }
})

const upload = multer({
  storage: storage
}).fields([{name:'files'},{name:'imgPath'}])


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

          if(res.req.files.imgPath && res.req.files.imgPath[0]) {
            
            body = body.map( item => {
              if(item.type.startsWith("imgPath") && item.content === "") {
                item.content = res.req.files.imgPath[0].filename;
              }
              return item;
            })
          }
          
          if(res.req.files.files){
            for(let i = 0,l = res.req.files.files.length;i < l;i++){
              const name = res.req.files.files[i].filename;
              let flg = false;
              body = body.map( item => {
                if(!flg && item.type.startsWith("image") && item.content === "") {
                  item.content = name;
                  flg = true;
                }
                return item;
              })
            }
          }


          const header = ["title","description","pubDate","imgPath","link"];
          const jsonData = body.reduce((acc,e) => {
            if(header.includes(e.type)) {
              acc[e.type] = e.content
              return acc
            }
            acc.body.push(e)
            return acc;
          },{
            body:[]
          })


          const pubDate = new Date(res.req.body.pubDate)
          const filename = `${pubDate.getFullYear()}${("00" + (pubDate.getMonth() + 1)).slice(-2)}${("00" + pubDate.getDate()).slice(-2)}`;

    
          if(pubDate.toString() === "Invalid Date") {
            return res.json({
              status: "fail",
              message: "Invalid Date",
              body: jsonData
            })
          }

          fs.writeFile(`./static/data/${filename}.json`, JSON.stringify(jsonData),(err)=>{
            console.log(err)
          });


          (()=>{

            const data = {
              title: res.req.body.title,
              description: res.req.body.description,
              pubDate: res.req.body.pubDate,
              link: `${filename}`,
              imgPath: res.req.files.imgPath && res.req.files.imgPath[0] ? res.req.files.imgPath[0].filename : "/image/noimage.png"
            };

            let list = JSON.parse(fs.readFileSync('./static/data/list.json', 'utf8'));
            if(!Array.isArray(list)) list = [];

            const index = list.findIndex(item => item.link.startsWith(filename))
            if(index >= 0){
              list.splice(index, 1, data);
            } else {
              list.unshift(data)
            }
            fs.writeFile(`./static/data/list.json`, JSON.stringify(list),(err)=>{
              console.log(err)
            });

          })();


          res.json({
              status: "sucess",
              // ファイル名を返す
              body: jsonData
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
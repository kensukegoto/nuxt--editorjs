<template>
  <div>
    <div id="editorjs" />
    <button @click="save">保存</button>
  </div>
</template>

<script>

export default {
  data: () => {
    return {
      editor: {},
      // article: {},
    }
  },
  mounted(){

    const EditorJS = require('@editorjs/editorjs');
    const Header = require('@editorjs/header');
    const paragraphBg = require("./paragraphBg");
    const ImageTool = require("./Image");

    this.editor = new EditorJS({
      handler: "editorjs",
      tools: {
        Header,
        paragraphBg,
        ImageTool: ImageTool(this)
      },
      data: {
        time: 1552744582955,
        blocks: this.article.body,
        version: "2.11.10"
      }

    })

    
  },
  methods: {
    save() {
      const id = this.article.id;
      const all = this.all;

      this.editor.save().then( data => {

        let updateAll = {...all};
        updateAll.channel.item = all.channel.item.map( item => {
          if(+item.id === id) {
            console.log(data)
            item = {...item,body:data.blocks}
          }
          return item;
        });

        this.$axios.$post("/api/article",updateAll)
          .then(res => {
            console.log(res)
          })
      })

    }
  },
  props: {
    all: {
      required: true
    },
    article: {
      required: true
    }
  }
}
</script>

<style>
.simple-image {
  padding: 20px 0;
}
.simple-image input,
.simple-image [contenteditable] {
  width: 100%;
  padding: 10px;
  border-radius: 3px;
  outline: none;
  background-color: #dbf7ff;
}
.simple-image img {
    max-width: 100%;
    margin-bottom: 15px;
}
.simple-image.withBorder img {
    border: 1px solid #e8e8eb;
}

.simple-image.withBackground {
    background: #eff2f5;
    padding: 10px;
}

.simple-image.withBackground img {
    display: block;
    max-width: 60%;
    margin: 0 auto 15px;
}
</style>
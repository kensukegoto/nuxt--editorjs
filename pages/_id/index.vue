<template>
  <div>
    <div>
      <div>記事作成</div>
      <div >
        <client-only placeholder="loading">
          <Editor :article="article" :all="all" />
        </client-only>
        <!-- <div id="editorjs"/> -->
      </div>
    </div>
  </div>
</template>

<script>
import Editor from "~/components/Editor/index"

export default {
  name: "ArticleCreateForm",
  components:{
    Editor
  },
  asyncData(context) {
    return context.app.$axios.$get("/api/article")
      .then(res => {
        const item = res.channel.item.filter(item => {
          return item.id === +context.params.id
        })
        return {
          all: res,
          article: item[0]
        }
      })
  },
  methods: {
    save() {
      console.log("保存をご希望ですか？");
      // this.editor.save().then((data) => {
      //   console.log(data);
      //   this.article = data
      // }).catch(err => {
      //   console.log(err)
      // })
    },
  }
}
</script>

<style>

</style>
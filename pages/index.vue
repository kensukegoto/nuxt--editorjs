<template>
  <div>
    <div>
      <div>記事作成</div>
      <div >
        <client-only placeholder="loading">
          <Editor />
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
    data: () => ({
      config: {},
      editor: {},
    }),
    components:{
      Editor
    },
    mounted() {

      console.log(this)

      // this.editor = new EditorJS({
      //   holder: 'editorjs', 
      // });

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
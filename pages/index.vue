<template>
  <div class="container-fluid">
    <div class="card">
      <div class="card-header">記事作成</div>
      <div class="card-body">
        <div id="editorjs"/>
      </div>
      <div class="card-footer">
        <div class="row justify-content-end">
          <button @click="save">保存</button>
        </div>
      </div>
    </div>
    <div>{{ article }}</div>
  </div>
</template>

<script>

  export default {
    name: "ArticleCreateForm",
    data: () => ({
      editor: {},
      article: {},
    }),
    mounted() {

      const me = this;

      const EditorJS = require('@editorjs/editorjs');
      const Header = require('@editorjs/header');
      const ImageTool = require('@editorjs/image');

      
      class SimpleImage {

        constructor({data}){
          this.data = data;
        }

        static get toolbox() {
          return {
            title: 'Image',
            icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
          };
        }

        render(){
          const wrapper = document.createElement("div");
          const input = document.createElement("input");

          wrapper.classList.add("simple-image");
          wrapper.appendChild(input);

          input.placeholder = "Paste an image URL...";
          input.value = this.data && this.data.url ? this.data.url : ""

          return wrapper;
        }

        save(blockContent){
          console.log(blockContent)
          const input = blockContent.querySelector("input");
          return {
            url: input.value
          }
        }
      }




      this.editor = new EditorJS({
        holder: 'editorjs', 
        tools: {
          image2: SimpleImage,
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile(file) {
                  let formData = new FormData()
                  formData.append('file', file)
                  let config = {headers: {'content-type': 'multipart/form-data'}}
                  return me.$axios.post('/api/image', formData, config)
                    .then(res => {
                      console.log(res);
                      return {
                        success: 1,
                        file: {
                          url: res.data.path
                        }
                      }
                    })
                    .catch(e => {
                      console.log("失敗");
                    })
                },
              }
            }
          }
        },
        data: {
          time: 1552744582955,
          blocks: [
            {
              type: "image2",
              data: {
                url: "https://cdn.pixabay.com/photo/2017/09/01/21/53/blue-2705642_1280.jpg"
              }
            }
          ],
          version: "2.11.10"
        }
      });
    },
    methods: {
      save() {
        this.editor.save().then((data) => {
          console.log(data);
          this.article = data
        }).catch(err => {
          console.log(err)
        })
      },
    }
  }
</script>

<style>
.simple-image {
  padding: 20px 0;
}
.simple-image input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e4e4e4;
  border-radius: 3px;
  outline: none;
  font-size: 14px;
}
</style>
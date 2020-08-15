<template>
  <section class="editor">
    <form @submit.prevent="doSave">

      <draggable tag="ul" ghost-class="item--draged" :list="list">
        <li v-for="(item, index) of list" 
        :key="index" 
        class="editor__item item">
          <div class="item__header">
            <p class="item__header__title">{{ typename(item.type) }}</p>
            <a @click="doDelete(index)"><p>×</p></a>
          </div>
          <div v-if="item.type === 'p'" class="item__body">
            <div><p contenteditable="true" @input="e => {doUpdate(e,index)}" @paste="onPaste">{{ item.content }}</p></div>
          </div>
          <div v-if="item.type === 'h2'" class="item__body">
            <div><h2 contenteditable="true" @input="e => {doUpdate(e,index)}" @paste="onPaste">{{ item.content }}</h2></div>
          </div>
          <div v-if="item.type === 'image'" class="item__body item__body--image">
            <figure>
              <img :src="item.content" alt="">
            </figure>
            <div class="upload">
              <p>
                <input type="file" :data-index="index" :name="'image_' + index" @change="addPreview">
                <span>ファイルを選択して下さい</span>
              </p>
            </div>
          </div>
        </li>
      </draggable>
      
      <div class="add">
        <p>
          <select id="add__select" v-model="selectedType">
            <option disabled value="">追加する要素を選択して下さい</option>
            <option value="p">テキスト</option>
            <option value="h2">中見出し</option>
            <option value="image">画像</option>
          </select>
        </p>
        <a @click="doAdd"><p>+</p></a>
      </div>
      <div class="save">
        <a @click="doSave"><p>保存</p></a>
      </div>
    </form>
  </section>
</template>

<script>
import draggable from 'vuedraggable'
const type2name = new Map([
  ["h2","中見出し"],
  ["p","テキスト"],
  ["image","画像"],
])
export default {
  components:{
    draggable
  },
  data(){
    return {
      list: [
        { type: "h2",content: "def",updated: ""},
        { type: "p",content: "abc",updated: "" },
        // { type: "image",content: "/image/nyanco_01.jpg" }
      ],
      selectedType: ''
    }
  },
  computed:{
    typename:()=>{
      return (type)=>{
        return type2name.get(type);
      }
    }
  },
  methods:{
    doUpdate(e,index){
      this.list[index].updated = e.target.innerHTML
    },
    doAdd(){
      const type = this.selectedType || "p";
      let item;
      switch(type){
        case "image":
          item = { type,name: type2name.get(type), content:"/image/noimage.png" ,file:""};
          break;
        default:
          item = { type,name: type2name.get(type), content:"" };
      }
      this.list.push(item)
    },
    doDelete(index){
      this.list.splice(index, 1);
    },
    doSave(){

      const formData = [...this.list].reduce((acc,item,index) => {
        if(item.type !== "image"){
          acc.append(`${item.type}_${index}`,item.updated || item.content)
        } else {
          acc.append(`${item.type}_${index}`,"")
          acc.append("files",item.file)
        }
        return acc;
      },new FormData());

      const config = {headers: {'content-type': 'multipart/form-data'}}

      this.$axios.$post("/api/create",formData,config)
        .then(res => {
          console.log(res)
        })


    },
    doSend(){
      console.log("送るかも");
    },
    doBold(cmdId, param){
      // 文字選択がdraggableのイベントで置き換わってるっぽい
      document.execCommand('bold', false, param);
    },
    addPreview(e){
      let files = e.target.files || e.dataTransfer.files;
      const index = e.target.dataset["index"];
      let reader = new FileReader();
      reader.onload = (e) => {
        this.list[index].content = e.target.result;
      };
      reader.readAsDataURL(files[0]);
      this.list[index].file = files[0]
    },
    onPaste(e) {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      document.execCommand("insertHTML", false, text);
    }
  }
}
</script>

<style lang="scss" scoped>
.editor{

  width: 800px;
  margin: 0 auto;

  &__item{
    margin-top: 24px;
  }
}

.item{

  &--draged{
    opacity: 0.5;
  }

  &__header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 24px;
    background: #88684e;
    color: #fff;
    padding: 0 16px;
    font-weight: bold;
    a{
      display: block;
      font-size: 20px;
      cursor: pointer;
      
    }
  }
  &__body{
    background: #fff;
    padding: 8px;
    h2,p{
      min-height: 1em;
    }
    h2,p{
      &:focus{
        outline: none;
      }
    }
    &--image{
      display: flex;
      flex-wrap: wrap;
      figure{
        width: 50%;
        img{
          max-width: 100%;
        }
      }
      .upload {
        width: 50%;
        p{
          position: relative;
          height: 100px;
          background: #efefef;
          border-radius: 15px;
          display: flex;
          justify-content: center;
          align-items: center;
          input{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            &:focus{
              outline: none;
            }
          }
        }
        


      }
    }
  }
}




.add {

  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  select{
    width: 400px;
    height: 32px;
  }
  a{
    display: inline-block;
    p{
      height: 32px;
      width: 32px;
      text-align: center;
      font-size: 24px;
      background: #88684e;
      color: #fff;
      // border-radius: 50%;
    }
  }
}
.save{
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  a {
    cursor: pointer;
    display: inline-block;
    padding: 8px;
    font-size: 16px;
    font-weight: bold;
    background: #fff;
    border: 1px solid #88684e;
  }
}

</style>
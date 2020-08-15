<template>
  <section class="editor">

    <form @submit.prevent="doSave">
      <div class="editor__meta">
        <ItemHeader
          content="meta"
        />
        <div>
          <p class="editor__meta__heading">タイトル</p>
          <TextArea
            @doUpdate="e => {doUpdate(e,'title',true)}" 
            :content="meta.title.content"
            type="h1"
            />
          <p class="editor__meta__heading">ディスクリプション</p>
          <TextArea
            @doUpdate="e => {doUpdate(e,'description',true)}" 
            :content="meta.description.content"
            type="p"
            />
          <p class="editor__meta__heading">日付</p>
          <DatePicker
            class="editor__meta__date"
            v-model="meta.pubDate.content"
            :format="datePicker.DatePickerFormat"
            :language="datePicker.lang" />
          <p class="editor__meta__heading">サムネイル</p>
          <ImageArea 
            class="item__body--image"
            @doUpdateImage="e => {doUpdateImage(e,'imgPath',true)}"
            :content="meta.imgPath.content"
          />
        </div>
      </div>

      <draggable class="editor__body" tag="ul" ghost-class="draged" :list="list">
        <li v-for="(item, index) of list" 
        :key="index" 
        class="editor__item">
          <ItemHeader
            :type="item.type"
            @doDelete="doDelete(index)"
          />
          <TextArea v-if="item.type === 'p' || item.type === 'h2'" 
            @doUpdate="e => {doUpdate(e,index)}" 
            :content="item.content"
            :type="item.type"
            />
          <ImageArea v-if="item.type === 'image'"
            @doUpdateImage="e => {doUpdateImage(e,index)}"
            :content="item.content"
          />
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
import DatePicker from 'vuejs-datepicker/src/components/Datepicker.vue';
import {ja} from 'vuejs-datepicker/dist/locale'

import TextArea from '~/components/TextArea'
import ImageArea from '~/components/ImageArea'
import ItemHeader from '~/components/ItemHeader'


export default {
  components:{
    draggable,
    DatePicker,
    TextArea,
    ImageArea,
    ItemHeader
  },
  data(){
    return {
      meta: {
        title : {
          content: "終戦から75年 全国戦没者追悼式 約310万人の戦没者を慰霊",
          updated: ""
        },
        description: {
          content: "【NHK】終戦から75年を迎えた15日、およそ310万人の戦没者を慰霊する政府主催の全国戦没者追悼式が東京の日本武道館で行われてい…",
          updated: ""
        },
        imgPath: {
          content: "",
          updated: ""
        },
        pubDate: {
          content:"",
          updated: ""
        }
      },
      list: [
        { type: "h2",content: "def",updated: ""},
        { type: "p",content: "abc",updated: "" },
        // { type: "image",content: "/image/nyanco_01.jpg",updated: "" }
      ],
      selectedType: '',
      datePicker: {
        default: new Date(),
        DatePickerFormat: 'yyyy年MM月dd日',
        lang: ja
      }
    }
  },

  methods:{

    doUpdate(e,index,meta){
      if(meta){
        this.meta[index].updated = e;
        return;
      }
      this.list[index].updated = e.target || e
      console.log(this.list)
    },
    doUpdateImage(e,index,meta){
      if(meta){
        this.meta[index].content = e.base64;
        this.meta[index].updated = e.file;
        return;
      }
      this.list[index].content = e.base64;
      this.list[index].updated = e.file;
    },
    doAdd(){
      const type = this.selectedType || "p";
      let item;
      switch(type){
        case "image":
          item = { type, content:"" ,updated:""};
          break;
        default:
          item = { type, content:"", updated: "" };
      }
      this.list.push(item)
    },
    doDelete(index){
      this.list.splice(index, 1);
    },
    doSave(){

      let formData = new FormData();

      const meta = this.meta;
      formData = Object.keys(meta).reduce((acc,key,index) => {
        const item = meta[key];
        if(key !== "imgPath"){
          acc.append(key,item.updated || item.content);
        } else {
          if(item.updated === ""){
            acc.append(key, item.content)

          } else {
            acc.append(key, "")
            acc.append("imgPath",item.updated)
          }
        }
        return acc;
      },formData);

      formData = [...this.list].reduce((acc,item,index) => {
        if(item.type !== "image"){
          acc.append(`${item.type}_${index}`,item.updated || item.content)
        } else {
          if(item.updated === ""){
            acc.append(`${item.type}_${index}`, item.content)

          } else {
            acc.append(`${item.type}_${index}`, "")
            acc.append("files",item.updated)
          }
        }
        return acc;
      },formData);


      const config = {headers: {'content-type': 'multipart/form-data'}}

      this.$axios.$post("/api/create",formData,config)
        .then(res => {
          console.log(res)
        })


    },
  }
}
</script>

<style>
.editor__meta__date input{
  padding: 8px;
}
</style>

<style lang="scss" scoped>
.editor{
  width: 800px;
  margin: 0 auto;
}
 .editor__meta{
  background-color: #fff;
  &__heading{
    margin: 8px 8px 0;
    font-weight: bold;
  }
  &__date{
    margin: 8px 8px 0;
  }
}
.editor__body{
  margin-top: 24px;
  .draged{
    opacity: .5;
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
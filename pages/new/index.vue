<template>
  <section class="editor">
    <nuxt-link to="/" class="newBtn">戻る</nuxt-link>
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

      <ToolBox
        class="editor__toolbox"
        @doAdd="type => doAdd(type)"
        @doSave="doSave"
      />

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
import ToolBox from '~/components/ToolBox'


export default {
  components:{
    draggable,
    DatePicker,
    TextArea,
    ImageArea,
    ItemHeader,
    ToolBox
  },
  data(){

    return {
      meta: {
        title : {
          content: "",
          updated: ""
        },
        description: {
          content: "",
          updated: ""
        },
        imgPath: {
          content: "",
          updated: ""
        },
        pubDate: {
          content: "",
          updated: ""
        }
      },
      list: [],
      datePicker: {
        default: new Date(),
        DatePickerFormat: 'yyyy年MM月dd日',
        lang: ja
      },
      

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
    doAdd(type){
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

      this.$router.push("/");


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
.editor__toolbox {
  margin-top: 24px;
}

.newBtn{
  margin-top: 24px;
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  width: 100px;
  height: 48px;
  text-decoration: none;
  font-weight: bold;
  color: #333;
  border: 1px solid #aaa;
}


</style>
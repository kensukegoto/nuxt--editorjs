<template>
  <section class="editor">
      <draggable tag="ul" ghost-class="item--draged" :list="list">
        <li v-for="(item, index) of list" 
        :key="index" 
        class="editor__item item">
          <div class="item__header">
            <p>×</p>
          </div>
          <div class="item__body">
            <textarea name="" id="" v-model="item.content"></textarea>
          </div>
        </li>
      </draggable>
      <div class="add">
        <p>
          <select name="" id="">
            <option hidden>選択してください</option>
          </select>
        </p>
        <a><p>+</p></a>
      </div>
  </section>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  components:{
    draggable
  },
  data(){
    return {
      list: [
        { content: "abc" },
        { content: "def" }
      ]
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
    padding-top: 32px;
  }

  .item{

    &--draged{
      opacity: 0.5;
    }

    &__header{
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 32px;
      background: #88684e;
      p{
        margin-right: 24px;
      }
    }
  }

  textarea{
    width: 100%;
    min-height: 200px;
    border: none;
  }

}



.add {

  margin-top: 24px;
  padding-top: 8px;
  padding-bottom: 8px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 8px;

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
</style>
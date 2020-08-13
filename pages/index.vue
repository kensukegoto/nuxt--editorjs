<template>
  <section class="editor">
      <draggable tag="ul" ghost-class="ghost" :list="list">
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
        { content: "def" },
        { content: "ghi" },
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

.ghost {
  opacity: 0.5;
}
</style>
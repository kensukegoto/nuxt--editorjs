<template>
  <section>
    <h1>記事一覧</h1>
    <nuxt-link to="new" class="newBtn">新規追加</nuxt-link>
    <ul class="item__wrapper">
      <li
        v-for="(item,index) of items"
        class="item"
        :key="index"
        >
        <nuxt-link :to="item.link">
          <figure><img :src="item.imgPath" alt=""></figure>
          <h3>{{ item.title }}</h3>
          <time>{{ item.pubDate }}</time>
        </nuxt-link>
      </li>
    </ul>
  </section>
</template>

<script>
import draggable from 'vuedraggable'
import data from '~/static/data/list.json'

export default {
  components:{
    draggable,
  },
  data(){
    return {
      items : data
    }
  },

}
</script>

<style lang="scss" scoped>
section{
  width: 800px;
  margin: 0 auto;
}
h1 {
  text-align: center;
  margin-top: 24px;
}
.item{
  margin-top: 24px;
  width: 50%;

  &__wrapper{

    display: flex;
    flex-wrap: wrap;
  }
  img {
    max-width: 100%;
  }
}

.newBtn{
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
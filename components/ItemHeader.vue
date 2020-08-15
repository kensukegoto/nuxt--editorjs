<template>
  <div class="header">
    <p class="header__title">{{ content || typename(type) }}</p>
    <a v-if="!content" @click="doDelete" class="header__close"><p>×</p></a>
  </div>
</template>

<script>

const type2name = new Map([
  ["h2","中タイトル"],
  ["p","テキスト"],
  ["image","画像"]
])

export default {
  props:{
    content :{
      type: String,
      default: ""
    },
    type:{
      type: String,
      default: ""
    }
  },
  methods:{
    doDelete(){
      this.$emit("doDelete")
    }
  },
  computed:{
    typename:()=>{
      return (type)=>{
        return type2name.get(type);
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.header{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 24px;
  background: #88684e;
  color: #fff;
  padding: 0 16px;
  font-weight: bold;
  &__close{
    display: block;
    font-size: 20px;
    cursor: pointer;
  }
}
</style>
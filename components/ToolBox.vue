<template>
  <div class="toolbox">
    <div class="toolbox__add">
      <select class="toolbox__add__select" v-model="selectedType">
        <option disabled value="">追加する要素を選択して下さい</option>
        <option value="p">テキスト</option>
        <option value="h2">中見出し</option>
        <option value="image">画像</option>
      </select>
      <a class="toolbox__add__btn" @click="doAdd"><p>追加</p></a>
    </div>
    <div class="toolbox__save">
      <a class="toolbox__save__btn" @click="doSave"><p>保存</p></a>
    </div>
  </div> 
</template>

<script>
export default {
  data(){
    return {
      selectedType: '',
    }
  },
  methods:{
    doAdd(){
      this.$emit("doAdd")
    },
    doSave(){
      this.$emit("doSave")
    }

  }
}
</script>

<style lang="scss" scoped>
.toolbox {

  margin-top: 24px;
  padding: 8px;
  background-color: #fff;
  display: flex;
  flex-wrap: wrap;

  &__add{
    width: 40%;
    &__select{
      width: 100%;
      height: 32px;
    }
    &__btn {
      width: 100%;
      display: block;
      text-align: center;
      background: #ddd;
      border: 1px solid #888;
      border-top: none;
      font-weight: bold;
      cursor: pointer;
    }
  }

  &__save{
    margin-left: 8px;
    width: calc(20% - 8px);
    &__btn {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      background-color: #333;
      font-weight: bold;
      cursor: pointer;
    }
  }
}
</style>
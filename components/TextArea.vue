<template>
  <div class="textArea__outer">
    <div class="textArea" :class="`textArea--${type}`">
      <p class="textArea__input" :class="`textArea__input--${type}`" contenteditable="true" @input="e => {doUpdate(e)}" @paste="doPaste">{{ content }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    content:{
      type: String,
      default : ""
    },
    type:{
      type: String,
      default : ""
    }
  },
  methods:{
    doUpdate(e){
      const text =  e.target.innerHTML
        .trim()
        .replace(/<div><br>|<div>/g,"<br>")
        .replace(/<\/div>/g,"")
        .replace(/<span.*?>|<\/span>/g,"")
        .replace(/(<br>)*$/,"")

      this.$emit("doUpdate",text);
    },
    doPaste(e){
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      document.execCommand("insertHTML", false, text);
    }
  }
}
</script>

<style lang="scss" scoped>
.textArea{
  &__outer{
    background: #fff;
    padding: 8px;
  }
  &__input{
    padding: 8px;
    border: 1px solid #ccc;
    &:focus{
      outline: none;
    }
    &--p{
      min-height: 5em;
    }
    &--h2,&--h1{
      font-weight: bold;
      font-size: 20px;
      min-height: 1em;
    }
  }
}
</style>
<template>
  <section class="editor">
    <div class="editor__item item">
      <div class="item__header">
        <p>×</p>
      </div>
      <div class="item__body">
        <textarea name="" id=""></textarea>
      </div>
    </div>
    <div class="editor__item">
      <div class="item__header">
        <p>×</p>
      </div>
      <div class="item__body">
        <textarea name="" id=""></textarea>
      </div>
    </div>
  </section>
</template>

<script>

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
</style>
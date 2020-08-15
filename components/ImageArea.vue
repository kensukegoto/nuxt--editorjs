<template>
  <div class="imageArea">
    <figure class="imageArea__image">
      <img :src="content || '/image/noimage.png'" alt="">
    </figure>
    <div class="imageArea__upload">
      <p>
        <input type="file" @change="e => { doPreview(e,true) }">
        <span>ファイルを選択</span>
      </p>
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
  },
  methods:{

    doPreview(e,meta){

      let files = e.target.files || e.dataTransfer.files;
      let reader = new FileReader();

      reader.onload = (e) => {
        // base64の画像
        this.$emit("doUpdateImage",{
          base64: e.target.result,file: files[0]
        })
      };
      reader.readAsDataURL(files[0]);

    }

  }
}
</script>

<style lang="scss" scoped>
.imageArea{

  background: #fff;
  padding: 8px;
  display: flex;
  flex-wrap: wrap;

  &__image{
    width: 50%;
    img{
      max-width: 100%;
    }
  }
  &__upload{
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

</style>
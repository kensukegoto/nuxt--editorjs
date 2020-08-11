const ImageTool = require('@editorjs/image');

module.exports = (context) => {

  return {
    class: ImageTool,
    config: {
      uploader: {
        uploadByFile(file) {
          let formData = new FormData()
          formData.append('file', file)
          formData.append("idididid",context.article.id)
          let config = {headers: {'content-type': 'multipart/form-data'}}
          return context.$axios.post('/api/image', formData, config)
            .then(res => {
              console.log(res);
              return {
                success: 1,
                file: {
                  url: res.data.path
                }
              }
            })
            .catch(e => {
              console.log("失敗");
            })
        },
      }
    }
  }
}
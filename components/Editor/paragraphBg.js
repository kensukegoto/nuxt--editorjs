const icon = `<p style="background-color:#888;color:#fff;padding:4px;">Text</p>`;

class paragraphBg {

  constructor({data}){
    this.data = data;
    this.wrapper = undefined;
  }

  static get toolbox() {
    return {
      title: '座布団',
      icon
    };
  }

  render(){

    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('simple-image');

    const input = document.createElement('div');
    input.contentEditable = true;
    input.innerHTML = (this.data && this.data.text) ? this.data.text : '';

    this.wrapper.appendChild(input);
    return this.wrapper;
  }


  save(blockContent){
    const caption = blockContent.querySelector('[contenteditable]');
  
    return {
      text: caption.innerHTML || ''
    }
  }

  validate(savedData){
    if (!savedData.text.trim()){
      return false;
    }

    return true;
  }
}

module.exports = paragraphBg
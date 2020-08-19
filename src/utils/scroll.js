// key为vue中data存放的索引,y1没滑动时的值，y2滑动后的值
let scroll = function(key,y1,y2){

  //误差调整
  let diff = -160
  let block = document.querySelectorAll(".form-block");
  if(block.length <= 1) return

  //处理updated生命周期中问题，只调用一次
  if(this.updatedTag) this.updatedTag= false;


  let scrollDom =  document.querySelector(".app-container");
  let leftInfo = document.querySelector(".left-info");

  const hasHead = leftInfo.querySelector('.head-block');


  //控制左边的滑块
  leftInfo.style.position = 'absolute';
  leftInfo.style.left = '226px';
  hasHead?leftInfo.style.top = '100px':leftInfo.style.top = '0px';


  //判断返回相应的index
  function returnIndex(t){
    for(var i=0;i<block.length-1;i++){
      if(block[i].offsetTop + diff <= t && t < block[i+1].offsetTop + diff){
        return i

      }
    }
    if(block[i].offsetTop + diff <= t && t< (block[i].offsetHeight+block[i].offsetTop + diff)){
      return i
    }
    return -1
  }

  let start = function(e){
    let t = scrollDom.scrollTop;
    controlLeftInfo(t)
    this[key] = returnIndex(t);
  }.bind(this)

  let li = document.querySelector(".main-block").children;

  for(let i=0;i<li.length;i++){
    (function(){
      li[i].onclick = function(){
        position(i)
      }
    })(i)
  }

  function position(index){
    let target =  block[index].offsetTop + diff;
    scrollDom.scrollTop = target
  }

  function controlLeftInfo(val){
    if(val>=100){
      if(y2){

        leftInfo.style.top = (val - y2) + 'px';
        return false
      }
      hasHead?leftInfo.style.top = val + 'px':leftInfo.style.top = (val-100) + 'px';
    }else{
      if(y1){
        leftInfo.style.top = y1 + 'px';
        return false
      }
      hasHead?leftInfo.style.top = '100px':leftInfo.style.top = '0px';
    }
  }

  scrollDom.onscroll = start
}





export default scroll;

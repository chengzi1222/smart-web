export default function dataDistinct(dataLeft, dataRight,leftName,rightName,deep = false) {

    if(deep){
        deepHandle.call(this,dataLeft, dataRight,leftName,rightName);
    }
    for(let i=0;i<dataLeft.length;i++){
      let left = dataLeft[i];
        let child = left.children;
        for(let item of dataRight) {
          if(left.code) {
            if (left.code == item.code) {
              for (let j = 0; j < child.length; j++) {
                for (let r of item.children) {
                  if (child[j].code) {
                    if (child[j].code == r.code) {
                      // 遇到重复的删除掉
                      child.splice(j, 1);
                    }
                  } else {
                    if (child[j].id == r.id) {
                      // 遇到重复的删除掉
                      child.splice(j, 1);
                    }
                  }
                }
              }
              // 没有子元素的话删除该数组的字段
              if (child.length == 0) {
                delete dataLeft[i]
              }
              break;
            }
          } else {
            if (left.id == item.id) {
              for (let j = 0; j < child.length; j++) {
                for (let r of item.children) {
                  if (child[j].id == r.id) {
                    // 遇到重复的删除掉
                    child.splice(j, 1);
                  }
                }
              }
              // 没有子元素的话删除该数组的字段
              if (child.length == 0) {
                delete dataLeft[i]
              }
              break;
            }
          }
        }
    }


    this[leftName] = dataLeft.filter((item)=> !!item);
    this[rightName] = dataRight;
  }

function deepHandle(dataLeft, dataRight,leftName,rightName){
    for(let i=0;i<dataLeft.length;i++){
        let left = dataLeft[i];
        //左边元素如果有子则递归处理
        if(left.children){
            for(let j=0;j<dataRight.length;j++){

                if((left.id == dataRight[j].id || left.code == dataRight[j].code) && (dataRight[j].children)){
                    deepHandle.call(this,left.children,dataRight[j].children,leftName,rightName);
                    //递归回来的时候判断子的长度
                    if(left.children.length == 0){
                        dataLeft.splice(i,1);
                        i--
                    }
                }
            }

        }else{
            //左边元素没有children的情况下，则开始遍历右边找相同的，如果有相同的，则删除掉左边的元素
            for(let k=0;k<dataRight.length;k++){
                if((left.id == dataRight[k].id || left.code == dataRight[k].code) && (!dataRight[k].children)){
                    dataLeft.splice(i,1);
                    i--
                }
            }
        }

    }

}


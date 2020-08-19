function pop(msg){
    let box = document.getElementById("pop-box");
    if(box) {
        box.style.display = "block";
    } else {
        let body = document.body;
        box = document.createElement("div");
        box.id = "pop-box";
        box.style.position = 'fixed';
        box.style.width = '100%';
        box.style.height = '100%';
        box.style.top = 0;
        box.style.zIndex = 99998;
        box.style.backgroundColor = 'rgba(0,0,0,.3)';

        let div = document.createElement("div");
        div.id = 'pop-div';
        div.style.width = 450 + 'px';
        div.style.height = 230 + 'px';
        div.style.zIndex = 99999;
        div.style.position = "fixed";
        div.style.left = 'calc(50% - 225px)';
        div.style.top = 'calc(50% - 150px)';
        div.style.background = '#fff';

        let p = document.createElement('p');
        p.id = "msgBox";
        p.style.width = "400px"
        p.style.margin = "30px auto"
        p.style.wordBreak='break-all'
        p.innerHTML = msg;

        let btn = document.createElement('a');
        btn.id = 'pop-ok';
        btn.style.position = 'absolute'
        btn.style.bottom = '30px'
        btn.style.right = '30px';
        btn.style.width = '100px'
        btn.style.height = '30px';
        btn.style.lineHeight = '30px'
        btn.style.textAlign = 'center'
        btn.style.background = '#0DB5EF'
        btn.style.color = "#fff";
        btn.style.cursor = 'pointer'
        btn.innerText = '确定'
        btn.onclick = function(){
            if(box.style.display == 'block'){
                box.style.display = 'none';
            }else{
                box.style.display = 'block';
            }
          //  window.location.reload();
        }
        div.appendChild(p);
        div.appendChild(btn);
        box.appendChild(div);
        body.appendChild(box);
      // box.style.display = 'block';
    }

    let msgBox = document.getElementById('msgBox');
    msgBox.innerHTML = msg;

}
export default pop;

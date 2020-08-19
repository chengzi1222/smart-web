function scrollTop(a,b,c,back){
    var tt ={};
    var speed = 50;
    var tab = document.getElementById(a);
    var tab1 = document.getElementById(b);
    var tab2 = document.getElementById(c);
    // tab2.innerHTML = tab1.innerHTML;//这句执行不了。因为是死数据。手动添加
    function Marquee(){
        // console.log(tab2.clientHeight,tab.scrollTop)
        if(tab2.clientHeight - tab.scrollTop <=0) {        
            tab.scrollTop = 0;
        }else{
            tab.scrollTop =tab.scrollTop+1;
        }
    }
    var timer = setInterval(Marquee,speed);
    tt.current = timer;
    tab.onmouseover = function(){
        tt.prev = timer;
        clearInterval(timer);
        timer = null;
        back(tt);
    };
    tab.onmouseout = function(){
        timer = setInterval(Marquee,speed);
        tt.current = timer;
        back(tt);
    };
   
    back(tt);
   
   
}
export default scrollTop
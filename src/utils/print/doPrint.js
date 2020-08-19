import {getCfda} from "api/cfda/details";
import {getLodop} from "utils/print/LodopFuncs";
import pop from "components/pop.js";
import store from "../../store/index.js";

//巡查打印
export function doPrintRecord(isPreview) {
  //获取并初始化打印控件
  var LODOP = getLodop();

  if (LODOP && LODOP != null && LODOP != undefined) {

    document.getElementById('printPage').innerHTML = "<span>第 </span><span tdata='pageNO'>##<span>页，</span><span>共 <span tdata='pageCount'>##</span>页</span></font></span>";
    LODOP.PRINT_INIT("顺点科技");

    var printBody = document.getElementById("printBody");
    var printBodyTop=printBody.getAttribute("printBodyTop");
    if (!printBodyTop){
      printBodyTop=135;
    }

    var printBody = document.getElementById("printBody");
    var intHeight=printBody.getAttribute("intHeight");
    if (!intHeight){
      intHeight="75%";
    }

    LODOP.ADD_PRINT_HTM(10, 40, 686, 160, document.getElementById('printHead').innerHTML)
    LODOP.SET_PRINT_STYLEA(1, "ItemType", 1);
    LODOP.ADD_PRINT_HTM(1050, 370, 200, 15, "<span tdata='pageNO'>##</span>/ &nbsp;<span tdata='pageCount'> ##</span></font></span>");
    LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
    LODOP.SET_PRINT_STYLEA(1, "FontSize", 14);
    LODOP.ADD_PRINT_HTM(printBodyTop, 40, 686,intHeight, document.getElementById('printBody').innerHTML);
    if(isPreview) {
      LODOP.PREVIEW();
    } else {
      LODOP.PRINTA();
    }
  } else {
    pop('没有安装打印控件，请安装打印控件: <a style="color: #795da3" href="http://www.lodop.net/download.html" target="_blank">下载打印控件</a> ！')
  }
}

/*三小备案打印*/
/*type:
 WORKSHOP	食品小作坊
 SALE	小经营店(食品销售)
 CFDARESTAURANT	小经营店(餐饮服务)
 VENDORS  固定食品摊贩
 */
export function doPrintCfda(id, type,isPreview) {
  getCfda(id).then(result => {
      if (result.status) {
        //获取并初始化打印控件
        var LODOP = getLodop();

        if (LODOP && LODOP != null && LODOP != undefined) {
          let printInfo = result.data;
          if (printInfo) {
            LODOP.SET_PRINT_PAGESIZE(1,'','','A4');
            var validTo = []; //有效期
            //printInfo.validTo = "2017-5-16";		//测试数据
            if(printInfo.recordEndStr != null && printInfo.recordEndStr != '') {
              if(printInfo.recordEndStr.indexOf("-") > 0) {
                validTo = printInfo.recordEndStr.split('-');
              } else if(printInfo.recordEndStr.indexOf("/") > 0) {
                validTo = printInfo.recordEndStr.split('/');
              }
            } else {
              validTo = ['', '', ''];
            }

            var printDate = [];	//发证日期
            var printDateStr = new Date().toLocaleDateString();
            if(printDateStr.indexOf("-") > 0) {
              printDate = printDateStr.split('-');
            } else if(printDateStr.indexOf("/") > 0) {
              printDate = printDateStr.split('/');
            }
            if (type == 'WORKSHOP') {
              LODOP.SET_PRINT_PAGESIZE(1,'','','A4');
              LODOP.SET_PRINT_STYLE("FontSize","16");
              LODOP.SET_PRINT_STYLE("Bold",'1');

              //新版
              LODOP.ADD_PRINT_TEXT('76mm','55mm','180mm','6mm',printInfo.backupNo);
              LODOP.ADD_PRINT_TEXT('98mm','55mm','90mm','14mm',printInfo.entityName);
              LODOP.ADD_PRINT_TEXT('121mm','55mm','180mm','6mm',printInfo.corpName);
              // LODOP.ADD_PRINT_TEXT('186mm','55mm','180mm','6mm',printInfo.address);
              LODOP.ADD_PRINT_TEXT('186mm','55mm','120mm','14mm',printInfo.spaceAddr);

              //有效日期
              LODOP.ADD_PRINT_TEXT('208mm','65mm','180mm','6mm',validTo[0]);
              LODOP.ADD_PRINT_TEXT('208mm','94mm','180mm','6mm',validTo[1]);
              LODOP.ADD_PRINT_TEXT('208mm','113mm','180mm','6mm',validTo[2]);


              //打印日期
              LODOP.ADD_PRINT_TEXT('258mm','115mm','180mm','6mm',printDate[0]);
              LODOP.ADD_PRINT_TEXT('258mm','149mm','180mm','6mm',printDate[1]);
              LODOP.ADD_PRINT_TEXT('258mm','166mm','180mm','6mm',printDate[2]);

              LODOP.SET_PRINT_STYLE("FontSize","14");
              LODOP.ADD_PRINT_TEXT('143mm','69mm','120mm','60mm',printInfo.prodTypeStr);
              LODOP.SET_PRINT_STYLE("FontSize","10");
              LODOP.ADD_PRINT_TEXT('158mm','30mm','150mm','60mm',printInfo.prodVarietyStr);

              if(printInfo.issuingOrgan) {
                var organizeCodeLeft = 210 - (printInfo.issuingOrgan.length * 4 + 61) + "mm";
                // LODOP.ADD_PRINT_TEXT('239mm',organizeCodeLeft,'180mm','6mm',printInfo.issuingOrgan);
                LODOP.ADD_PRINT_TEXT('239mm',organizeCodeLeft,'180mm','6mm',printInfo.issuingOrgan);
              }
              //var testStr = printInfo.organizeCode+"打印测试七个字";

              //加入二维码
              if(printInfo.id != null && printInfo.id != '') {
                LODOP.ADD_PRINT_BARCODE('232mm', '25mm', '42mm', '42mm',
                  "QRCode", `${store.getters.base.qrUrl}?t=` + "F_RECORD&v=1&id="
                  + printInfo.id);
              }
            } else if (type == 'SALE' || type == 'CFDARESTAURANT') {

              //新版
              LODOP.SET_PRINT_PAGESIZE(1,'','','A4');
              LODOP.SET_PRINT_STYLE("FontSize","16");
              LODOP.SET_PRINT_STYLE("Bold",'1');

              LODOP.ADD_PRINT_TEXT('61mm','54mm','140mm','6mm',printInfo.backupNo);
              LODOP.ADD_PRINT_TEXT('76mm','54mm','90mm','14mm',printInfo.entityName);
              LODOP.ADD_PRINT_TEXT('91mm','54mm','140mm','6mm',printInfo.corpName);
              // LODOP.ADD_PRINT_TEXT('198mm','54mm','140mm','6mm',printInfo.address);
              LODOP.ADD_PRINT_TEXT('194mm', '55mm', '120mm', '14mm',
                printInfo.spaceAddr);

              //有效日期
              LODOP.ADD_PRINT_TEXT('213mm','65mm','140mm','6mm',validTo[0]);
              LODOP.ADD_PRINT_TEXT('213mm','94mm','140mm','6mm',validTo[1]);
              LODOP.ADD_PRINT_TEXT('213mm','114mm','140mm','6mm',validTo[2]);

              //打印日期
              LODOP.ADD_PRINT_TEXT('259mm','117mm','140mm','6mm',printDate[0]);
              LODOP.ADD_PRINT_TEXT('259mm','149mm','140mm','6mm',printDate[1]);
              LODOP.ADD_PRINT_TEXT('259mm','166mm','140mm','6mm',printDate[2]);

              LODOP.SET_PRINT_STYLE("FontSize","13");

              LODOP.ADD_PRINT_TEXT('107mm','54mm','120mm','60mm',printInfo.projectMainStr);
              LODOP.ADD_PRINT_TEXT('153mm','54mm','120mm','60mm',printInfo.projectSidStr);

              if(printInfo.issuingOrgan) {
                LODOP.SET_PRINT_STYLE("FontSize","14");
                var organizeCodeLeft = 210 - (printInfo.issuingOrgan.length * 4 + 60) + "mm";
                // LODOP.ADD_PRINT_TEXT('240mm',organizeCodeLeft,'180mm','6mm',printInfo.issuingOrgan);
                LODOP.ADD_PRINT_TEXT('240mm',organizeCodeLeft,'180mm','6mm',printInfo.issuingOrgan);
              }

              //加入二维码
              if(printInfo.id != null && printInfo.id != '') {
                LODOP.ADD_PRINT_BARCODE('232mm', '25mm', '42mm', '42mm',
                  "QRCode", `${store.getters.base.qrUrl}?t=` + "F_RECORD&v=1&id="
                  + printInfo.id);
              }
            } else if (type == 'VENDORS') {

              //新版
              LODOP.SET_PRINT_PAGESIZE(2,'','','A5');
              LODOP.SET_PRINT_STYLE("FontSize","16");
              LODOP.SET_PRINT_STYLE("Bold",'1');

              LODOP.ADD_PRINT_TEXT('40mm','47mm','180mm','6mm',printInfo.backupNo);
              LODOP.ADD_PRINT_TEXT('54mm','47mm','180mm','6mm',printInfo.corpName);
              // LODOP.ADD_PRINT_TEXT('54mm','47mm','180mm','6mm',printInfo.entityName);
              LODOP.ADD_PRINT_TEXT('68mm','60mm','180mm','6mm',printInfo.idNo);
              LODOP.ADD_PRINT_TEXT('95mm','54mm','120mm','14mm',printInfo.placeBiz);
              // LODOP.ADD_PRINT_TEXT('186mm','55mm','180mm','6mm',printInfo.realityAddr);

              //打印日期
              LODOP.ADD_PRINT_TEXT('119mm','117mm','180mm','6mm',printDate[0]);
              LODOP.ADD_PRINT_TEXT('119mm','148mm','180mm','6mm',printDate[1]);
              LODOP.ADD_PRINT_TEXT('119mm','165mm','180mm','6mm',printDate[2]);

              let saleStr = printInfo.foodProdStr;
              if(saleStr) {
                if(printInfo.foodSalesStr) {
                  saleStr += ',';
                  saleStr += printInfo.foodSalesStr;
                }
              } else {
                saleStr = printInfo.foodSalesStr;
              }
              LODOP.SET_PRINT_STYLE("FontSize","12");
              LODOP.ADD_PRINT_TEXT('82mm','56mm','100mm','60mm', saleStr);

              //二维码
              if(printInfo.id != null && printInfo.id != '') {
                LODOP.ADD_PRINT_BARCODE('104mm', '25mm', '29mm', '29mm',
                  "QRCode", `${store.getters.base.qrUrl}?t=` + "F_RECORD&v=1&id="
                  + printInfo.id);
              }
            }
            //LODOP.PRINTA();
            //LODOP.PREVIEW();
          } else {
            pop('获取打印页面数据失败')
          }
          if(isPreview) {
            LODOP.PREVIEW();
          } else {
            LODOP.PRINTA();
          }
        } else {
          pop('没有安装打印控件，请安装打印控件: <a style="color: #795da3" href="http://www.lodop.net/download.html" target="_blank">下载打印控件</a> ！')
        }
      } else {
        pop(result.msg)
      }
    }
  );
}

/**廉洁自律反馈表打印*/
export function doPrintIncorruption(isPreview, data) {
  //获取并初始化打印控件
  var LODOP = getLodop();

  if (LODOP && LODOP != null && LODOP != undefined) {
    LODOP.PRINT_INIT("廉洁自律反馈表");

    var printBody = document.getElementById("printBody");
    var printBodyTop=printBody.getAttribute("printBodyTop");
    if (!printBodyTop){
      printBodyTop=100;
    }

    var intHeight=printBody.getAttribute("intHeight");
    if (!intHeight){
      intHeight="75%";
    }

    LODOP.SET_PRINT_STYLEA(1, "ItemType", 1);
    LODOP.SET_PRINT_STYLEA(1, "FontSize", 14);
    
    if(data && data.length > 0) {
      for(let i = 0; i < data.length; i++) {
        LODOP.ADD_PRINT_HTM(printBodyTop, 22, 720, intHeight, data[i]);
        LODOP.NEWPAGE();  //强制分页
      }
    }
    if(isPreview) {
      LODOP.PREVIEW();
    } else {
      LODOP.PRINTA();
    }
  } else {
    pop('没有安装打印控件，请安装打印控件: <a style="color: #795da3" href="http://www.lodop.net/download.html" target="_blank">下载打印控件</a> ！')
  }
}

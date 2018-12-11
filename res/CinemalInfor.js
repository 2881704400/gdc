$(function(){
    GetWeather();
    NowDataTime();

    var search = window.location.hash.split('#')[1];

    $(".gdcTop_left").html(parseInt(search)+"号厅");

    serviceEnsurePxy(search)

})
//获取天气
function GetWeather() {
    $.ajax({
        type: "get",
        url: "/WebService1.asmx/CrossDomainRequest",
    data:{
        url:'http://www.sojson.com/open/api/weather/json.shtml?city=上海',
        value:'',
        host:'www.sojson.com', 
        method:'get'
    },
        success: function (dt) {
            var d= $(dt).children("string").text();
        var json=(new Function("","return "+d))();
        $('#gdcRight_Weather').html("今日天气："+json.data.forecast[0].type+"<br/>"+"室外温度："+json.data.wendu+"℃");
        }
    });

    var timer5=setTimeout(function(){
             GetWeather()
             clearTimeout(timer5);
    }, 1000*60*60*2);
  
    


}
//当前时间
function NowDataTime() {
    var myDate=new Date();
    var year=myDate.getFullYear();
    var mon=myDate.getMonth()+1;
    var day=myDate.getDate();
    var hours = myDate.getHours();
    var min = myDate.getMinutes();
    if(min<10){
        min="0"+min
    };
    var res= year+"-"+mon+"-"+day+"</br> "+hours+":"+min
    $("#gdcRight_time").html(res);
    myDate=null;year=null;mon=null;day=null;hours=null;min=null;


   
   var timer6=setTimeout(function(){
         NowDataTime() 
         clearTimeout(timer6);
   },  1000*60);

}
//连接服务器
function serviceEnsurePxy(dt2) {
    
    getServe(dt2)
    function getServe(dt2){
        $.ajax({
            type: "post",
            url: "/GWServices.asmx/InitEnsureRunProxy",
            data: "wcfIP=&&pageUserNm=admin",
            success: function (dt) {

                var analyze = $(dt).children("string").text();
                // console.log(1)
                if (analyze != "false" ) {
                    serviceToYDEquip(dt2);
                    
                }
                else{
                    $(".gdcSetting ul").html('');
                    $(".gdcSettingInfor").html("优");
                    $(".gdcSettingInfor").removeClass("scanning2");
                    $(".gdcSetting ul").html('<li style="margin-bottom:26px;">影厅环境：<span style="visibility:hidden;">空空</span></li>');
                    var newRow = "";

                    newRow= "温度：<span class='scanning3'>" +23 + "℃</span> "+"<span style='visibility:hidden;'>空空</span>湿度：<span class='scanning3'>" + 51 + "%</span> ";
                    $(".gdcSetting ul").append("<li>" + newRow + "</li>");
                    var timer=setTimeout(function(){
                         getServe(dt2)
                         
                         clearTimeout(timer);

                    }, 1000*10);
                }
            }
        });
    }
    
}
//获取影厅
function serviceToYDEquip(dt2){
        $.ajax({
        type: "post",
        url: "/GWServices.asmx/GetDataTableFromSQLSer",
        data: "sql=select * from GW_CinemaArea where CinemaArea_Type=0 order by CinemaArea_ID",
        success: function (data) {
            // console.log(data)
            $(data).children("DataTable").find("shen").each(function (i) {

                if (i + 1 == dt2) {
                   var hallCode=$(this).find("ProjHall_Code").text();
                   var CinemaArea_ID=$(this).find("CinemaArea_ID").text();

                    var item=cinemaSeat(hallCode)

                      
                    //cinemaTimeNow(item)
                    // console.log(hallCode)

                    getcinemaSeat()
                    function getcinemaSeat(){
                        item=cinemaSeat(hallCode);
                         cinemaTimeNow(item)
                          jsonToYDEquips(CinemaArea_ID)
                         
                        //电影详情
                         var timer1=setTimeout(function(){
                            getcinemaSeat()
                            
                            clearTimeout(timer1);
                         },1000*60);
                         
                    }

                    // loadSetPic(item,hallCode)//座位图

                    getloadSetPic()
                    function getloadSetPic(){
                        loadSetPic(item,hallCode);
                       var timer3= setTimeout(function(){
                            getloadSetPic()
                            clearTimeout(timer3);
                        }, 1000*60*60);
                    }
                    
                     

                    // jsonToYDEquips(CinemaArea_ID)//温湿度
                    // getjsonToYDEquips()
                    // function getjsonToYDEquips(){
                    //     jsonToYDEquips(CinemaArea_ID)
                    //    var timer4= setTimeout(function(){
                    //         getjsonToYDEquips()
                    //         clearTimeout(timer4);
                    //     },1000);
                    // }
                  
                    
                }
            });

        }
    });
}

//影厅温湿度
function jsonToYDEquips(CinemaArea_ID) {
    
     $.ajax({
        type: "post",
        url: "/GWServices.asmx/GetDataTableFromSQLSer",
        data: "sql=select  * from  GW_CinemaAreaItem where CinemaArea_ID="+CinemaArea_ID+" and Item_Type in (3,9)",
        success: function (data) {
            // console.log(data)
            var equpId=[];
            var res=$(data).find("DataTable");
            if($(res).find("shen").length!=0){
                $(res).find("shen").each(function(){
                    equpId.push(parseInt($(this).find("Equip_No").text()))
                })
                var equipID=removeRepeat(equpId);
                ServiceToYDEquipYcps(equipID)
               
            }else{
                $(".gdcSetting ul").html('');
                $(".gdcSettingInfor").html("优");
                $(".gdcSettingInfor").removeClass("scanning2");
                $(".gdcSetting ul").html('<li style="margin-bottom:26px;">影厅环境：<span style="visibility:hidden;">空空</span></li>');
                var newRow = "";

                newRow= "温度：<span class='scanning3'>" +23 + "℃</span> "+"<span style='visibility:hidden;'>空空</span>湿度：<span class='scanning3'>" + 51 + "%</span> ";
                $(".gdcSetting ul").append("<li>" + newRow + "</li>");
            }
            

           
        }
    });

    
}

function ServiceToYDEquipYcps(equipID) {
  
            var wsd=showWs(equipID)
            var showWd=wsd.wd,showSd=wsd.sd;
            var newRow = "";
            $(".gdcSetting ul").html('');
            $(".gdcSetting ul").html('<li style="margin-bottom:26px;">影厅环境：<span style="visibility:hidden;">空空</span></li>');
            var isSummer=getSummer();
            var cls="scanning3"
            if(isSummer){
                if(showWd/2>=10&&showWd/2<=28){
                    $(".gdcSettingInfor").html("优");
                    $(".gdcSettingInfor").removeClass("scanning2");
                }else{
                    $(".gdcSettingInfor").html("良");
                    $(".gdcSettingInfor").addClass("scanning2");
                    cls = "scanning2";
                }
            }else{
                if(showWd/2>=10&&showWd/2<=28){
                    $(".gdcSettingInfor").html("优");
                    $(".gdcSettingInfor").removeClass("scanning2");
                }else{
                    $(".gdcSettingInfor").html("良");
                    $(".gdcSettingInfor").addClass("scanning2");
                    cls = "scanning2";
                }
            }
            newRow= "温度：<span class='" + cls + "'>" +showWd/2 + "℃</span> "+"<span style='visibility:hidden;'>空空</span>湿度：<span class='" + cls + "'>" + showSd/2 + "%</span> ";
            $(".gdcSetting ul").append("<li>" + newRow + "</li>");
                                
            equpId=null;equipID=null;newRow=null;isSummer=null;
            
}
function showWs(equipID){
    var showWd=0,showSd=0,wsd={};
     for(var i=0;i<equipID.length;i++){
               // console.log(1);
                 $.ajax({
                        type: "post",
                        url: "/GWServices.asmx/RealTimeData",
                        data: "selectedEquipNo="+equipID[i]+"&&tableName=ycp",
                        async:false,
                        success: function (dt) {
                          
                            var data = $(dt).children("string").text();
                            if (data == "false"||data=="[]") {
                                showWd+=25;
                                 showSd+=51
                                
                             }else{
                                var usera =JSON.parse(data);
                                 for (var i = 0; i < usera.length; i++) {
                                    if (usera[i].m_iYCNo == 1) {//温度
                                            if(usera[i].m_YCValue=="0"||usera[i].m_YCValue=="***"){
                                                showWd+=25;
                                            }else{
                                                showWd+=parseInt(usera[i].m_YCValue);
                                            }
                                    }
                                    if (usera[i].m_iYCNo == 2) {//湿度
                                        if(usera[i].m_YCValue=="0"||usera[i].m_YCValue=="***"){
                                                showSd+=51;
                                            }else{
                                                showSd+=parseInt(usera[i].m_YCValue) ;
                                            }
                                    }
                                }
                             }
                        }
                    }).error(function() {
                        showWd+=25;
                        showSd+=51
                    });;
            }
        wsd.sd=showSd;
        wsd.wd=showWd;
        return wsd
    }


//获取当前播放电影
function cinemaSeat(hallCode) {
    var items={
       
        "nameArr":"",
        "seatArr":""
    }
    var nowDate,afterDate;
    nowDate=getNowTime().split(" ")[0];
    afterDate=getAfterDay(1);

    $.ajax({
        url: "/GWServices.asmx/GetDataTableFromSQLSer",
        data: "sql=select * from  GW_CinemaSeat where HallCode="+hallCode +" and State=1 and ShowTime between '"+nowDate+" 03:00:00' and '"+afterDate+" 03:00:00'",  
        type: 'post',
        async:false,
        success: function (data) {
             // console.log(data);
            var res=$(data).find("DataTable");
            var seatArr=[];
            var nameArr=[];
            $(res).find("shen").each(function(){

                var respo="["+$(this).find("Data").text()+"]";
                var showTime=$(this).find("ShowTime").text().replace("T"," ").split("+")[0];
                var FilmName=$(this).find("FilmName").text();
                var SoldTickets=$(this).find("SoldTickets").text();
                var duration=$(this).find("Duration").text();
                var showCode=$(this).find("ChannelShowCode").text();
                var item={
                    FilmName:FilmName,
                    ShowTime:showTime,
                    SoldTickets:SoldTickets,
                    Duration:duration,
                    ChannelShowCode:showCode
                }
                seatArr.push(respo);
                nameArr.push(item);
                item=null;respo=null;showTime=null;FilmName=null;SoldTickets=null;duration=null;showCode=null;

            })

            // var w=cinemaTimeNowNoCange(nameArr)

            var noShowArr=[];
            var finalInd2;
            var flag=false;

            for(var i=0;i<nameArr.length;i++){
               var showtime=nameArr[i].ShowTime;
               var Duration=nameArr[i].Duration;
               var nowTime=getNowTime();
               var timeCha=getMinuDiff(nowTime,showtime);
               // console.log(timeCha)

               if(timeCha==0){
                    flag=true;
                    finalInd2=i
                    break;
               }else if(timeCha>0&&timeCha<=Duration){
                      finalInd2=i
                      flag=true;
                    break;
               }else if(timeCha<0){
                    var item={
                        chazhi:timeCha,
                        index:i
                    }
                    noShowArr.push(item);
                    item=null;
               }
               showtime=null;Duration=null;nowTime=null;timeCha=null;
            };
            // console.log(noShowArr)
            if(noShowArr.length!=0&&!flag){
                var big=noShowArr[0];
                for(var j=0;j<noShowArr.length;j++){
                    if(big.chazhi<noShowArr[j].chazhi){
                        big=noShowArr[j]
                    }
                }
                finalInd2=big.index
            }
            items["nameArr"]=nameArr[finalInd2];
            items["seatArr"]=seatArr[finalInd2];
            seatArr=null;
            nameArr=null;
            finalInd2=null;
            noShowArr=null;
        }
       
    })
    return items;
}
function cinemaTimeNow(item){
    // console.log(item)
if(item.nameArr){
       
   
    var nameItem=item.nameArr.FilmName;
    var names="";var type="";
    if(nameItem.indexOf("(")>-1){
        names=nameItem.split("(")[0];
        if(nameItem.indexOf(")")>-1){
            
            type=nameItem.split("(")[1].replace(")"," ")
        }else{
           
            type=nameItem.split("(")[1].replace("）"," ")
        }
       

    }else if(nameItem.indexOf("（")>-1){
         names=nameItem.split("（")[0];

       if(nameItem.indexOf(")")>-1){
            
            type=nameItem.split("(")[1].replace(")"," ")
        }else{
           
            type=nameItem.split("（")[1].replace("）"," ")
        }

    }   
    $(".gdcName").html(names);
    $(".gdcType").html(type);
   type=null;nameItem=null;
    

   
    $.ajax({
        type: "post",
        async:true,
        url: "/GWServices.asmx/GetDataTableFromSQLSer",
        data:{sql:"select Imageurl from GW_CinemaFilm where FilmName like ('%"+names+"%')"},
        success:function (dt) {
        //console.log(dt)
            var res=$(dt).find("DataTable");
            $(res).find("shen").each(function(){
                if($(this).find("Imageurl").text()!=""){
                    $(".gdcPoster img").attr("src","" );
                     var Imageurl=$(this).find("Imageurl").text();
                        $(".gdcPoster img").attr("src",Imageurl );
                    Imageurl=null;
                }
               
            });
            
        }
    })
    names=null;
    var Duration=item.nameArr.Duration;
    var nowTime=getNowTime();
    var showTime =item.nameArr.ShowTime;
    var st = dateTimes(showTime);
    var now=dateTimes(nowTime);
    var nts=getMinuDiff(nowTime,showTime);
    if(now>st){
        if (nts >=parseInt(Duration)) {
             $(".gdcSeatsList").find("i").each(function(){
                if($(this).hasClass('icon-zuowei1')){
                    $(this).removeClass("icon-zuowei1").addClass("icon-zuowei")
                }
            })  
            $(".gdcPlayInfor_1").html("");
            $(".gdcPoster p").html("已结束");
            $(".gdcPlayInfor_2").html("已结束");
            $(".progressBarPlay_2").attr("style", "width:100%");
        }else {
            var percent = parseInt((nts / Duration) * 100);
            $(".gdcPoster p").html("正在播放");
            $(".gdcPlayInfor_1").html("当前进度：" + percent + "%");
            $(".progressBarPlay_2").attr("style", "width:" + percent + "%");
            $(".gdcPlayInfor_2").html("已播放：" + nts + " 分钟");
            $(".gdcPoster p").html("正在播放");
            // NowCineam(datas);
             percent=null;
        }
    }else if(now==st){
            $(".gdcPlayInfor_1").html("");
            $(".gdcPoster p").html("即将开始");
            $(".gdcPlayInfor_2").html("即将开始（距离开播时间还有：0 分钟）");
            $(".progressBarPlay_2").attr("style", "width:0%;");
    }else{
            $(".gdcPlayInfor_1").html("");
            $(".gdcPoster p").html("尚未开始");
            var hourse=minTohour(nts);
            $(".gdcPlayInfor_2").html("尚未开始（距离开播时间还有：" +hourse+ "）");
            $(".progressBarPlay_2").attr("style", "width:0%;");
            hourse=null;
    }
   

    names=null;nameItem=null;
    nameArr=null;arr=null;nowTime=null;showTime=null;st=null;now=null;nts=null;Duration=null;
 }
}

function loadSetPic(item,showCode){

    // console.log(item);
    if(item.seatArr=="[]"){
        $.ajax({
                type: "post",
                async:true,
                url: "/GWServices.asmx/GetDataTableFromSQLSer",
                data: "sql=select Seats from GW_CinemaArea where ProjHall_Code="+showCode,
                success: function (data) {
                    // console.log(data)
                    var res=$(data).find("DataTable");
                    $(res).find("shen").each(function(){
                        var seatData=$(this).find('Seats').text();
                        if(seatData!=""){
                             var seats=[];
                             seats[0]="["+seatData+"]";
                             loadSeat(seats[0])
                             seats=null;
                        }

                    })
                   

                }
            });
    }else{
        
        if(item.seatArr){
            

             loadSeat(item.seatArr)
        }
       

    }

   

}
function loadSeat(arr){
    var respon=JSON.parse(arr)
        var num=0;
        var xcoordMax = 0;
        var ycoordMax = 0;
        var ymax=0;
        $(".gdcSeatsList").html("");
        var xcoordMax = 0;
        var ycoordMax = 0;
        for (var i = 0; i < respon.length; i++) {
            var status = "";
            if(respon[i].rowValue!="0"&&respon[i].columnValue!="0"){
                if (respon[i].seatStatus=="ok") {
                    status = "icon-zuowei";
                }
                else {
                    status = "icon-zuowei1";
                }
               if(xcoordMax < parseInt(respon[i].x)) {
                    xcoordMax=respon[i].rowValue;
                    ycoordMax=parseInt(respon[i].y)  
                }
            }
            // console.log(ycoordMax)
            var x = xcoordMax* 24;
            var y = (ycoordMax+1)*24;
            if(ymax<y){
                ymax=y;
            }
            // console.log(x,y)
            var single = "<div class='gdcSeatsSingle'  style='top:" + x + "px;left:" + y + "px;'><i class='iconfont " + status + "'></i></div>";
            $(".gdcSeatsList").append(single);
            single=null;
            
        }

        for (var i = 1; i < parseInt(xcoordMax) + 1; i++) {
            var x = i  * 24;
            var numb = i;
            // console.log(numb)
            if (numb < 10) {
                numb = "0" + i;
            }
            var single = "<div class='gdcSeatsSingle' style='top:" + x + "px;left:0;'><span>" + numb + "<span></div>";
            $(".gdcSeatsList").append(single);
            single=null;
        }
        if (xcoordMax > 13) {
            var scale = (10 - (xcoordMax - 13)) / 10;
            $(".gdcSeatsList").css("transform", "scale(" + scale + ")");
        }
        else {
            var heights = xcoordMax * 24;
            $(".gdcSeatsList").css("height", heights + "px");
            var hgs = $(".gdcSeats").height() - heights;
            $(".gdcSeats").css("height", heights + "px");
        }
       
        $(".gdcSeatsList").css("width", ymax+24 + "px");
        $(".gdcSeats").css("width", ymax+24 + "px");
        num=null;xcoordMax=null;ycoordMax=null;ymax=null;respon=null;x=null;y=null;
}

// //时间格式化
function dateTimes(date) {
    var s = date;
    var ps = s.split(" ");
    var pd = ps[0].split("-");
    var pt = ps.length > 1 ? ps[1].split(":") : [0, 0, 0];
    var st = new Date(pd[0], pd[1] - 1, pd[2], pt[0], pt[1], pt[2]);
    return st;
}
function removeRepeat(arr){
    var newArr=[];
    for(var i=0;i<arr.length;i++){
        if(newArr.indexOf(arr[i])==-1){
            newArr.push(arr[i])
        }
    }
    return newArr;
}
function getSummer(){
    var isSummer;
    var mydate=new Date();
    var mon=mydate.getMonth()+1;
    if(mon>=4&&mon<=9){
        isSummer=true;
    }else{
        isSummer=false
    }
    return isSummer;
}
 
function getNowTime(){
    var myDate=new Date();
    var year=myDate.getFullYear();
    var mon=myDate.getMonth()+1;
    var day=myDate.getDate();
    var hours = myDate.getHours();
    var min = myDate.getMinutes();
    var sec = myDate.getSeconds();
    return year+"-"+mon+"-"+day+" "+hours+":"+min+":"+sec
}
function getMinuDiff(big,small){
    var bigs=big.replace(/\-/g, "/");
    var smalls=small.replace(/\-/g, "/");
    var bigDate=new Date(bigs)
    var smallDate=new Date(smalls)

     return Math.floor(parseInt(bigDate-smallDate)/1000/60)
}
function getAfterDay(AddDayCount){
    var dd = new Date(); 
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
        var y = dd.getFullYear(); 
        var m = dd.getMonth()+1;//获取当前月份的日期 
        var d = dd.getDate(); 
    return y+"-"+m+"-"+d; 
}
function minTohour(num){
    var hour="";
    var time=Math.abs(num)
    // console.log(time)
    if(time<=60){
        hour=time+"  分钟";
    }else if(time>60){
        hour=(time/60).toFixed(1)+"小时"
    }
    return hour
   

}




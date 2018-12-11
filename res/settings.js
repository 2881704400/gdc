var cinemaCode, hallCode;//影院编码,影厅编码
window.onload = function () {
    initSettings();
    // listCinemal();
}

// //影院列表
// function listCinemal() {
//     var sign = $.md5("I4Ty7okNuBfG4URlC0000I4Ty7okNuBfG4URl");
//     $.ajax({
//         type: "post",
//         dataType: 'JSONP',
//         url: "http://omnijoi.cn:6608/api/ticket/v1/queryCinemas.json?channelCode=C0000&sign=" + sign,
//         success: function (dt) {
//             if (dt.code == "001") {
//                 var cinemas = dt.cinemas;
//                 $("#listCinemal ul").html("");
//                 for (var i = 0; i < cinemas.length; i++) {
//                     var newRow = $("<li code='" + cinemas[i].code + "' onclick='onCinemal(this)' codes='" + (i + 1) + "'>" + (i + 1) + "、" + cinemas[i].name + "</li>");
//                     $("#listCinemal ul").append(newRow);
//                 }
//             }
//             else {
//                 console.log(dt.code);
//             }
//         },
//         error: function () {
//             console.log("服务器错误");
//         }
//     });
// }
// //单击影院列表
// function onCinemal(dt) {
//     $("#listCinemal ul li").removeClass("active");
//     $(dt).addClass("active");
//     cinemaCode = $(dt).attr("code");
//     var cinemaCodes = $(dt).attr("codes");

//     //加载影厅列表
//     var sign = $.md5("I4Ty7okNuBfG4URlC0000" + cinemaCode + "I4Ty7okNuBfG4URl");
//     $.ajax({
//         type: "post",
//         dataType: 'JSONP',
//         url: "http://omnijoi.cn:6608/api/ticket/v1/queryHalls.json?channelCode=C0000&cinemaCode=" + cinemaCode + "&sign=" + sign,
//         success: function (dt) {
//             if (dt.code == "001") {
//                 var halls = dt.halls;
//                 $("#listScreens ul").html("");
//                 for (var i = 0; i < halls.length; i++) {
//                     var newRow = $("<li code='" + halls[i].code + "' onclick='onScreens(this)' codes='" + (i + 1) + "'>" + (i + 1) + "、" + halls[i].name + "</li>");
//                     $("#listScreens ul").append(newRow);
//                 }

//                 $("#listUrl ul").html("");
//                 var hn = location.protocol+"//" + location.host;
//                 //var urls = window.location.href;
//                 for (var i = 0; i < halls.length; i++) {
//                     var newRow = $("<li>" + hn + "/?" + cinemaCodes + "#" + (i + 1) + "</li>");
//                     $("#listUrl ul").append(newRow);
//                 }
//             }
//             else {
//                 console.log(dt.code);
//             }
//         },
//         error: function () {
//             console.log("服务器错误");
//         }
//     });

//     //加载影片列表
//     var sign2 = $.md5("I4Ty7okNuBfG4URlC0000" + cinemaCode + "I4Ty7okNuBfG4URl");
//     var date = new Date();
//     var dates = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
//     $.ajax({
//         type: "post",
//         dataType: 'JSONP',
//         url: "http://omnijoi.cn:6608/api/ticket/v1/queryFilms.json?channelCode=C0000&startDate=" + dates + "&sign=" + sign2,
//         success: function (dt) {
//             if (dt.code == "001") {
//                 console.log(dt);
//             }
//             else {
//                 console.log(dt.code);
//             }
//         },
//         error: function () {
//             console.log("服务器错误");
//         }
//     });
// }
// //单击影厅列表打开影厅页面
// function onScreens(dt) {
//     $("#listScreens ul li").removeClass("active");
//     $(dt).addClass("active");
//     var cinemaCodes = "";
//     $("#listCinemal ul").find("li").each(function () {
//         if ($(this).hasClass("active")) {
//             cinemaCodes = $(this).attr("codes");
//         }
//     });
//     var hallCode = $(dt).attr("codes");
//     window.open("/?" + cinemaCodes + "#" + hallCode);
// }

//初始化配置
function initSettings() {
    $("#setUp_1_Name").html(setUp[0].SetName);
    
    $("#setUp_1_Time").val(setUp[0].Time);

    $("#setUp_2_Name").html(setUp[1].SetName);
    if (setUp[1].Show == 1) {
        document.getElementById("setUp_2_Show").checked = true;
    }
    else {
        document.getElementById("setUp_2_Show").checked = false;
    }
}


function onSaves() {
    if (document.getElementById("setUp_1_Show").checked) {
        setUp[0].Show = 1;
    }
    else {
        setUp[0].Show = 1;
    }
    setUp[0].Time = parseInt($("#setUp_1_Time").val());
    if (document.getElementById("setUp_2_Show").checked) {
        setUp[1].Show = 1;
    }
    else {
        setUp[1].Show = 0;
    }
    var obj = JSON.stringify(setUp);
    console.log(obj)
    $.ajax({
        type: "post",
        url: "/GWServices.asmx/UpdataSetUp",
        data: "dataJSON=var setUp \= " + obj,
        success: function (dt) {
            var str = $(dt).children("string").text();
            if (str != "false") {
                alert("设置成功！");
            }
        }
    });
}
var cinemaCode, hallCode;//影院编码,影厅编码
window.onload = function () {
    listCinemal();
}

//影院列表
function listCinemal() {
    var sign = $.md5("I4Ty7okNuBfG4URlC0000I4Ty7okNuBfG4URl");
    $.ajax({
        type: "post",
        dataType: 'JSONP',
        url: "http://omnijoi.cn:6608/api/ticket/v1/queryCinemas.json?channelCode=C0000&sign=" + sign,
        success: function (dt) {
            if (dt.code == "001") {
                var cinemas = dt.cinemas;
                $("#listCinemal ul").html("");
                for (var i = 0; i < cinemas.length; i++) {
                    var newRow = $("<li code='" + cinemas[i].code + "' onclick='onCinemal(this)'>" + cinemas[i].name + "</li>");
                    $("#listCinemal ul").append(newRow);
                }
            }
            else {
                console.log(dt.code);
            }
        },
        error: function () {
            console.log("服务器错误");
        }
    });
}
//单击影院列表
function onCinemal(dt) {
    $("#listCinemal ul li").removeClass("active");
    $(dt).addClass("active");
    cinemaCode = $(dt).attr("code");

    //加载影厅列表
    var sign = $.md5("I4Ty7okNuBfG4URlC0000" + cinemaCode + "I4Ty7okNuBfG4URl");
    $.ajax({
        type: "post",
        dataType: 'JSONP',
        url: "http://omnijoi.cn:6608/api/ticket/v1/queryHalls.json?channelCode=C0000&cinemaCode=" + cinemaCode + "&sign=" + sign,
        success: function (dt) {
            if (dt.code == "001") {
                var halls = dt.halls;
                $("#listScreens ul").html("");
                for (var i = 0; i < halls.length; i++) {
                    var newRow = $("<li code='" + halls[i].code + "' onclick='onScreens(this)'>" + halls[i].name + "</li>");
                    $("#listScreens ul").append(newRow);
                }
            }
            else {
                console.log(dt.code);
            }
        },
        error: function () {
            console.log("服务器错误");
        }
    });

    //加载影片列表
    var sign2 = $.md5("I4Ty7okNuBfG4URlC0000" + cinemaCode + "I4Ty7okNuBfG4URl");
    var date = new Date();
    var dates = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    $.ajax({
        type: "post",
        dataType: 'JSONP',
        url: "http://omnijoi.cn:6608/api/ticket/v1/queryFilms.json?channelCode=C0000&startDate=" + dates + "&sign=" + sign2,
        success: function (dt) {
            if (dt.code == "001") {
                console.log(dt);
            }
            else {
                console.log(dt.code);
            }
        },
        error: function () {
            console.log("服务器错误");
        }
    });
}
//单击影厅列表打开影厅页面
function onScreens(dt) {
    $("#listScreens ul li").removeClass("active");
    $(dt).addClass("active");
    hallCode = $(dt).attr("code");
    window.open("CinemaInfor.html?cinemaCode=" + cinemaCode + "&hallCode=" + hallCode);
}
//function 
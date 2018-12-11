
function RichScan() {
    document.getElementById('ricscan_ipt').addEventListener('change', function () {
        document.getElementById("ricscan_text").innerHTML = "扫描结果：<br/>";
        var reader = new FileReader();
        reader.onload = function (e) {
            qrcode.decode(e.target.result);
            qrcode.callback = function (data) {
                //得到扫码的结果
                document.getElementById("ricscan_text").innerHTML = "扫描结果：<br/>" + data;
            };
            document.getElementById("ricscan_img").src = e.target.result;
        };
        reader.readAsDataURL(this.files[0]);
    }, false);
}
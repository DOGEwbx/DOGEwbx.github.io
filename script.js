function search(){
    var macX = document.getElementById("textMacX").value
    var macY = document.getElementById("textMacY").value
    var timeFrom = document.getElementById("timeFrom").value
    var timeTo = document.getElementById("timeTo").value
    timeFrom = timeFrom.replace(/^(\S+)T([0-9]+):([0-9]+)$/, "$1-$2-$3-00");
    timeTo = timeTo.replace(/^(\S+)T([0-9]+):([0-9]+)$/, "$1-$2-$3-00");
    var httpRequest = new XMLHttpRequest();
    
    //httpRequest.open('GET', 
    //"http://101.200.169.212:8080/device/trace?mac="+macX+"&start="+timeFrom+"&end="+timeTo, true);
    //httpRequest.open("GET","http://www.baidu.com", true)
    httpRequest.open("GET","http://101.200.169.212:10029/?user=ck_r&password=FA341FA&query=SELECT%20DISTINCT%20*%20FROM%20building_trace.gateway_meta%20LIMIT%2010%20FORMAT%20JSON", true)
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200 || true) {
            var json = httpRequest.responseText;
            document.getElementById("textOutput").value = json;
        }
    }
};
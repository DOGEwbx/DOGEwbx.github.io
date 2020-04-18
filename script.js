function search(){
    var startTime = new Date().getTime();
    var macX = document.getElementById("textMacX").value;
    var macY = document.getElementById("textMacY").value;
    var timeFrom = document.getElementById("timeFrom").value;
    var timeTo = document.getElementById("timeTo").value;
    timeFrom = timeFrom.replace(/^(\S+)T([0-9]+):([0-9]+)$/, "$1-$2-$3-00");
    timeTo = timeTo.replace(/^(\S+)T([0-9]+):([0-9]+)$/, "$1-$2-$3-00");
    var httpRequest = new XMLHttpRequest();
    var jsonTrace;
    var jsonFloor;
    
    
    if (macY==''||macY==undefined||macY==null)
    {   
        var resultOrange = [];//in 10 meter
        var resultRed = [];//in 5 meter
        var mac;
        httpRequest.open('GET', 
        "http://101.200.169.212:8080/device/trace?mac="+macX+"&start="+timeFrom+"&end="+timeTo, false);        
        httpRequest.onreadystatechange=function()
        {
            if (httpRequest.readyState == 4 && httpRequest.status == 200)
            {                   
                jsonTrace = JSON.parse(httpRequest.responseText).data[0].trace;
                mac =JSON.parse(httpRequest.responseText).data[0].mac;
            }
        }
        httpRequest.send();
        var floorRequest = new XMLHttpRequest();
        floorRequest.open('GET',"http://101.200.169.212:8080/floor/list",false);       
        floorRequest.onreadystatechange = function ()
        {
            if (floorRequest.readyState == 4 && floorRequest.status == 200)
            {            
                jsonFloor=JSON.parse(floorRequest.responseText).data         
                
            }           
        }
        floorRequest.send();
        //console.log(jsonFloor.length);
        //console.log(jsonTrace.length);
        for (var i = 0 ; i<jsonFloor.length; i++)
        {   
            //console.log(i)
            var jsonY = (jsonFloor[i]);   
            if (jsonY.mac == mac)
            {
                continue;
            }
            for (var j = 0;j<jsonTrace.length;j++)
            {   
                var flag=true;
                var jsonX=(jsonTrace[j]);
                //console.log(jsonY);
                
                var distance = Math.pow(((jsonY.x)-(jsonX.x)),2)+Math.pow(((jsonY.y)-(jsonX.y)),2);
                //console.log(distance);
                if (distance <= 25)
                {   
                    /*console.log(jsonX);
                    console.log(jsonY);
                    console.log(distance);*/
                    jsonY['alert']='red'
                    resultRed.push(jsonY);
                    break;//solution due to the weired error of using break QAQ
                }   
                else if (distance <=100)
                {   
                    jsonY['alert']='orange'
                    resultOrange.push(jsonY);
                    break;
                }          
                
            }  
        }
        console.log(resultRed[0])
        //resultRed=resultRed.join('\n');
        //document.getElementById("textOutput").value = resultRed;// need modification       
        var table=document.getElementById("table");
        while(table.rows.length > 1){
            table.deleteRow();
        }
        for(var i=0;i<resultRed.length;i++){
            var row=table.insertRow(table.rows.length);
            row.style.backgroundColor = "#D94600";
            var c1=row.insertCell(0);
            c1.innerHTML=resultRed[i].mac;
            var c2=row.insertCell(1);
            c2.innerHTML=resultRed[i].name;
            var c3=row.insertCell(2);
            c3.innerHTML=resultRed[i].id;
            var c4=row.insertCell(3);
            c4.innerHTML=resultRed[i].location;
            var c5=row.insertCell(4);
            c5.innerHTML=resultRed[i].step;
            var c6=row.insertCell(5);
            c6.innerHTML=resultRed[i].x;
            var c7=row.insertCell(6);
            c7.innerHTML=resultRed[i].y;
            var c8=row.insertCell(7);
            c8.innerHTML=resultRed[i].alert;
        }
        for(var i=0;i<resultOrange.length;i++){
            var row=table.insertRow(table.rows.length);
            row.style.backgroundColor = "#FF8F59";
            var c1=row.insertCell(0);
            c1.innerHTML=resultOrange[i].mac;
            var c2=row.insertCell(1);
            c2.innerHTML=resultOrange[i].name;
            var c3=row.insertCell(2);
            c3.innerHTML=resultOrange[i].id;
            var c4=row.insertCell(3);
            c4.innerHTML=resultOrange[i].location;
            var c5=row.insertCell(4);
            c5.innerHTML=resultOrange[i].step;
            var c6=row.insertCell(5);
            c6.innerHTML=resultOrange[i].x;
            var c7=row.insertCell(6);
            c7.innerHTML=resultOrange[i].y;
            var c8=row.insertCell(7);
            c8.innerHTML=resultOrange[i].alert;
        }
    }

    else{
        var jsonX;
        var jsonY;
        if (macX==macY){
            document.getElementById("textOutput").value = 'same MAC. Please retype.';
            return;
        }
        //if two peopel's distance smaller than 3 meters and in the difference of timestamp is smaller than 20, they are believed to be close.
        var result=[]
        var XRequest =new XMLHttpRequest();
        XRequest.open('GET', 
        "http://101.200.169.212:8080/device/trace?mac="+macX+"&start="+timeFrom+"&end="+timeTo, false);        
        XRequest.onreadystatechange=function()
        {
            if (XRequest.readyState == 4 && XRequest.status == 200)
            {                   
                jsonX = JSON.parse(XRequest.responseText).data[0].trace;
                
            }
        }
        XRequest.send();
        var YRequest = new XMLHttpRequest();
        YRequest.open('GET',
        "http://101.200.169.212:8080/device/trace?mac="+macY+"&start="+timeFrom+"&end="+timeTo,false);       
        YRequest.onreadystatechange = function ()
        {
            if (YRequest.readyState == 4 && YRequest.status == 200)
            {            
                jsonY=JSON.parse(YRequest.responseText).data[0].trace;         
                
            }           
        }
        YRequest.send();
        //console.log(jsonX.length);
        //console.log(jsonY.length);
        var j=0;
        if(jsonY.length){
            for (var i =0;i<jsonX.length;i++)
            {
                for(j;jsonY[j].step<jsonX[i].step-20 && j<jsonY.length;j++);

                if(Math.abs(jsonX[i].step-jsonY[j].step)<=20)
                {
                    distance=Math.pow(jsonX[i].x-jsonY[j].x,2)+Math.pow(jsonX[i].y-jsonY[j].y,2);
                    if (distance<=9)
                    {
                        var json=
                        {
                                    x: (jsonX[i].x+jsonY[j].x)/2 ,
                                    y: (jsonX[i].y+jsonY[j].y)/2 ,
                                    step_x :jsonX[i].step ,
                                    step_y :jsonY[j].step 

                        };
                        result.push(JSON.stringify(json));
                    }

                }
            }
        }
        else{
            result="No trace of macY found!";
        }
        //console.log(result.length)
        //result=result.join('\n');
        document.getElementById("textOutput").value = result;
    }
    //httpRequest.open('GET', 
    //"http://101.200.169.212:8080/device/trace?mac="+macX+"&start="+timeFrom+"&end="+timeTo, true);
    //httpRequest.open("GET","http://www.baidu.com", true)
    //httpRequest.open("GET","http://101.200.169.212:10029/?user=ck_r&password=FA341FA&query=SELECT%20DISTINCT%20*%20FROM%20building_trace.gateway_meta%20LIMIT%2010%20FORMAT%20JSON", true)
    /*httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = httpRequest.responseText;
            document.getElementById("textOutput").value = json;
        }
    }*/
    var endTime=new Date().getTime();
    console.log(endTime-startTime)
};
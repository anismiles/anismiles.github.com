angular.module('relcyApp')
.filter('hourmins', function(){
    return function(time){
        //Nothing when no time given
        if (!time) return;
        var minIndex = time.indexOf('min');
        if(time.indexOf('hr')>0){
            return time;
        }else if(minIndex>0){
            var minutes = parseInt(time.substring(0,minIndex), 0);
            var hr = Math.floor(minutes/60);
            var hrMins = '';
            if(hr>0)
            hrMins += (hr)+' hr ';
            hrMins = hrMins+(minutes%60)+' min';
            return hrMins; 
        }else{
            var length = parseInt(time, 0);
            var hr = Math.floor(length/60);
            var hrMins = '';
            if(hr>0)
            hrMins += (hr)+' hr ';
            hrMins = hrMins+(length%60)+' min';
            return hrMins;
        }
        
    }
});

module.exports ={
    eq : function (a,b) {
       if(a == b){
           return true
       }
    },
    and : function (a,b){
        if(a && b){
            return a && b;
        }
    },
    gt : function(a,b){
        if(a>b){
            return true
        }
    }
}
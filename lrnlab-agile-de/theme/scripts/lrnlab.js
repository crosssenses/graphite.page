console.log("Loading theme JS")
var isIE = /*@cc_on!@*/false || !!document.documentMode;
$(function(){if (isIE){
    console.log("Detected: IE");
    $(".ms-header .card .card-body").css("cssText", "margin-top: 100px !important;");
    $(".ms-chapter .ms-row-full .ms-col-content").css("cssText", "margin-top: 600px !important;");
}else{
    console.log("Detected: not IE");
}})

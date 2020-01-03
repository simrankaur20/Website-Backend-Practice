//module.exports = getDate;
//module.exporst is a javascript object
//it can have members, to export multiple functions , define members for module.exports
module.exports.getDate = function (){
    var today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    var day = today.toLocaleDateString("en-US", options);
    return day;
}

module.exports.getDay = getDay;
function getDay(){
    var today = new Date();
    let options = {
        weekday: "long",
    }

    var day = today.toLocaleDateString("en-US", options);
    return day;
}
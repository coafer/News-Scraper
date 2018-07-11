var makeDate = function(){
    var d = new Date();
    var formattedDate = "";

    formattedDate += (d.getMonth() + 1) + " ";
    formattedDate += d.getDate() + " ";
    formattedDate += d.getFullYear();
    return formattedDate;
};

module.exports = makeDate;
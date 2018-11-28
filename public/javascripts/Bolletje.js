
function Bolletje() {
    this.color = undefined;
}

Person.prototype.getColor = function() {
    return this.color;
}

Person.prototype.setColor = function(color) {
    this.color = color;
}

function changeColor(elemId) {
    var bol = document.getElementById(elemId);
    if(bol.value === "0") {
        bol.innerHTML="Red";
        bol.value = "1";
    }
    else if(bol.value === "1") {
        bol.innerHTML="Green";
        bol.value = "2";
    }
    else if(bol.value === "2") {
        bol.innerHTML="Blue";
        bol.value = "3";
    }
    else if(bol.value === "3") {
        bol.innerHTML="Yellow";
        bol.value = "4";
    }
    else if(bol.value === "4") {
        bol.innerHTML="Purple";
        bol.value = "5";
    }
    else if(bol.value === "5") {
        bol.innerHTML="Brown";
        bol.value = "6";
    }
    else if(bol.value === "6") {
        bol.innerHTML="Pink";
        bol.value = "7";
    }
    else if(bol.value === "7") {
        bol.innerHTML="Orange";
        bol.value = "8";
    }
    else {
        bol.innerHTML="O";
        bol.value = "0";
        //document.getElementById("sol1").disabled = false;
    }
}
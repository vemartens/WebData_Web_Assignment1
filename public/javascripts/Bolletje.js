
bolletje = function(color) {
    this.color = undefined;
}

bolletje.prototype.getColor = function() {
    return this.color;
}

bolletje.prototype.setColor = function(color) {
    this.color = color;
}

//staat nog los van bolletje
window.changeColor = function(elemId) {
    var colors = ["O", "Red", "Green", "Blue", "Yellow", "Purple", "Brown", "Pink", "Orange"];
    var bol = document.getElementById(elemId);
    if(bol.value === "8")
        bol.value = "-1";
    bol.innerHTML = colors[++bol.value];
}


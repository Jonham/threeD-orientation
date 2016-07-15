// app.js

var info;
var target = JH("#info");
JH.on(window, "deviceorientation", function(e) {
    // console.log(e);
    // target.innerHTML = "Alpha" + e.alpha +
    //               "<br> beta:" + e.beta +
    //               "<br> gamma:" + e.gamma;
    // info = e;
    mouseX = e.alpha - 180;
    mouseY = e.beta;
});

window.onload = function() {
    target.style.display = "none";
};

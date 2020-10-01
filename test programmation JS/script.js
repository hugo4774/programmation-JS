// get canvas related references
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var BB = canvas.getBoundingClientRect();
var offsetX = BB.left;
var offsetY = BB.top;
var WIDTH = canvas.width;
var HEIGHT = canvas.height;

// drag related variables
var dragok = false;
var startX;
var startY;
var closest;
var radius = 60;

// an array of objects that define different rectangles
var rects = [];
rects.push({
    x: 875,
    y: 550,
    width: 60,
    height: 60,
    fill: "red",
    isDragging: false
});
rects.push({
    x: 275,
    y: 550,
    width: 60,
    height: 60,
    fill: "blue",
    isDragging: false
});
rects.push({
    x: 875,
    y: 250,
    width: 60,
    height: 60,
    fill: "yellow",
    isDragging: false
});
rects.push({
    x: 275,
    y: 255,
    width: 60,
    height: 60,
    fill: "green",
    isDragging: false
});
// listen for mouse events
canvas.onmousedown = myDown;
canvas.onmouseup = myUp;
canvas.onmousemove = myMove;

calculateTheClosest();
// call to draw the scene
draw();

function updateText(){
    ctx.font = "24pt Calibri,Geneva,Arial";
    ctx.fillStyle = "black";
    ctx.fillText(closest.fill, WIDTH/2-20, 100);
}
   
// draw a single rect
function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}

function fillCircle(x,y,r,fill)
{
  ctx.beginPath();
  ctx.fillStyle=fill;
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
  ctx.lineWidth = 15;
  ctx.stroke();
}

// clear the canvas
function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

// redraw the scene
function draw() {
    clear();
    ctx.fillStyle = "#FAF7F8";
    rect(0, 0, WIDTH, HEIGHT);
    // redraw each rect in the rects[] array
    for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        fillCircle(r.x,r.y,radius,r.fill);
    }
    ctx.fillStyle = "black";
    fillCircle(WIDTH/2, HEIGHT/2, radius/3,"black");
    
    updateText();
}

// calculate the hypotenuse of a triangle with a and b the adjacent sides
function calcHypotenuse(a, b) {
    return (Math.sqrt((a * a) + (b * b)));
}

// calculate which cercle is the closest of the center
function calculateTheClosest(){
    for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        if(typeof closest == 'undefined'){
            closest = r;
        }  
        var hypotenuse = calcHypotenuse(WIDTH/2 - r.x,HEIGHT/2 - r.y);
        var hypotenuseClosest = calcHypotenuse(Math.abs(WIDTH/2 - closest.x),Math.abs(HEIGHT/2 - closest.y));
        if(hypotenuse<hypotenuseClosest){
            closest=r;
        }
    }
}

// handle mousedown events
function myDown(e) {

    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // get the current mouse position
    var mx = parseInt(e.clientX - offsetX);
    var my = parseInt(e.clientY - offsetY);

    // test each rect to see if mouse is inside
    dragok = false;
    for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        console.log("MX : " + mx + " MY : " + my);
        var hypotenuse = calcHypotenuse(r.x-mx,r.y-my);
        console.log("HYPOTEHNUSE : " + hypotenuse);
        if (hypotenuse <= radius){
            // if yes, set that rects isDragging=true
            dragok = true;
            r.isDragging = true;
        }
    }
    // save the current mouse position
    startX = mx;
    startY = my;
}


// handle mouseup events
function myUp(e) {  
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // clear all the dragging flags
    dragok = false;
    for (var i = 0; i < rects.length; i++) {
        rects[i].isDragging = false;
    }
}


// handle mouse moves
function myMove(e) {
    // if we're dragging anything...
    if (dragok) {

        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();

        // get the current mouse position
        var mx = parseInt(e.clientX - offsetX);
        var my = parseInt(e.clientY - offsetY);

        // calculate the distance the mouse has moved
        // since the last mousemove
        var dx = mx - startX;
        var dy = my - startY;

        // move each rect that isDragging 
        // by the distance the mouse has moved
        // since the last mousemove
        for (var i = 0; i < rects.length; i++) {
            var r = rects[i];
            if (r.isDragging) {
                r.x += dx;
                r.y += dy;
            }
        }
        calculateTheClosest();
        // redraw the scene with the new rect positions
        draw();

        // reset the starting mouse position for the next mousemove
        startX = mx;
        startY = my;

    }
}
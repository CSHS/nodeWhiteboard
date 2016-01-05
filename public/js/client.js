
$(document).ready(function() {
  //setup "global" variables first
  var socket = io.connect("http://localhost:3000");
  //var socket = io();
  var roomID = 1;
  var rain = "rgb(245, 80, 5)";  

  socket.emit('createRoom',roomID);
//send start and end coordinate straight line to other client for NOW.
  var canvas = document.getElementById('canvas_main');
  var canvas2 = $("#canvas_main").offset();
  var mouseIsDown = false;
  var draw = canvas.getContext("2d");
  var mouseX = 0;
  var mouseY = 0;
  var mouseX2 = 0;
  var mouseY2 = 0;
  $('#canvas_main').mousedown(function(event) {
    //mouseX shown below is number needed to buffer out clientX
    //so that the line is drawn right where the cursor is pointing in the canvas when window is full screen.
    //Same principle applies for mouseY.
    mouseX = (event.clientX - (canvas2.left));
    mouseY = event.clientY - (canvas2.top);
    //var mouseX = event.clientX;
    //var mouseY = event.clientY;
    draw.strokeStyle=rain;
    draw.beginPath();
    draw.moveTo(mouseX,mouseY);
    mouseIsDown = true;
  });

   $('#canvas_main').mousemove(function(event) {
      if (mouseIsDown){
          mouseY2 = event.clientY - (canvas2.top);
          mouseX2 = (event.clientX - (canvas2.left));
          draw.lineTo(mouseX2, mouseY2);
          draw.stroke();
          socket.emit("draw",mouseX,mouseY,mouseX2,mouseY2,rain,roomID);
          mouseX = mouseX2;
          mouseY = mouseY2;  
      }
    });

  $('#canvas_main').mouseup(function(event) {
    mouseY2 = event.clientY  - (canvas2.top);
    mouseX2 = (event.clientX - (canvas2.left));
    draw.stroke();
    mouseIsDown = false;
  });

$('.color').click(function() {
    rain = $(this).css('background-color');
});

  socket.on("draw", function(mouseX,mouseY,mouseX2,mouseY2,rain){
    draw.strokeStyle=rain;
    draw.beginPath();
    draw.moveTo(mouseX,mouseY);
    draw.lineTo(mouseX2,mouseY2);
    draw.stroke();
  });

  /*socket.on("disconnect", function(){
  });*/

});
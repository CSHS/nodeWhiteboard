
$(document).ready(function() {
  //setup "global" variables first
  var socket = io.connect("http://localhost:3000");
  //var socket = io();
  var roomID = 1;

  socket.emit('createRoom',roomID);
//send start and end coordinate straight line to other client for NOW.
  var canvas = document.getElementById('canvas_main');
  var mouseIsDown = false;
  var draw = canvas.getContext("2d");
  var mouseX = 0;
  var mouseY = 0;
  var mouseX2 = 0;
  var mouseY2 = 0;
  $('#canvas_main').mousedown(function(event) {
    mouseX = event.clientX - canvas.offsetLeft;
    mouseY = event.clientY - (0.75*canvas.offsetTop);
    //var mouseX = event.clientX;
    //var mouseY = event.clientY;
    draw.moveTo(mouseX,mouseY);
    mouseIsDown = true;
  });

   $('#canvas_main').mousemove(function(event) {
      if (mouseIsDown){
          mouseY2 = event.clientY - (0.75*canvas.offsetTop);
          mouseX2 = event.clientX - canvas.offsetLeft;
          draw.lineTo(mouseX2, mouseY2);
          draw.stroke();
          socket.emit("draw",mouseX,mouseY,mouseX2,mouseY2);
          mouseX = mouseX2;
          mouseY = mouseY2;  
      }
    });

  $('#canvas_main').mouseup(function(event) {
    mouseY2 = event.clientY - (0.3*canvas.offsetTop);
    mouseX2 = event.clientX - canvas.offsetLeft;
    draw.stroke();
    mouseIsDown = false;
  });


  socket.on("draw", function(mouseX,mouseY,mouseX2,mouseY2,roomID){
    draw.moveTo(mouseX,mouseY);
    draw.lineTo(mouseX2,mouseY2);
    draw.stroke();
  });

  /*socket.on("disconnect", function(){
  });*/

});

AFRAME.registerComponent('overlay-menu', {
  schema: {
    //objects: {type: 'string', default: ''},
    //strength: {type: 'number', default: },
    //sound: {type: 'audio'}
    //sticky: {default: true, type: 'boolean'},
    //update_delay: {default: 1, type: 'number'},
    //stuck_item_limit: {default: 5, type: 'number'},
    //alpha: {type: 'number', default: 255},
    //margin: {type: 'number', default: 0},
    //canvasId: {type: 'string', default: ''},

  },

  init: function() {
    //this.canvas = document.getElementById(canvasId);
    //this.canvasContext = canvas.getContext('2d');
    const canvasContext = this.el.canvas.getContext('2d');
    console.log(this);
    console.log(this.el.canvas);
    console.log(canvasContext);
    var ctx = canvasContext;
  },

  tock: function(time, timeDelta, camera) {

    var ctx = this.el.canvas.getContext('2d');
    ctx.beginPath();
    //ctx.rect(40, 40, 80, 40);
    //ctx.strokeStyle = 'white';
    //ctx.stroke();
    ctx.closePath();
  }

});

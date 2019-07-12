AFRAME.registerComponent('spawner', {
  schema: {
    width: {type: 'number', default: 1},
    height: {type: 'number', default: 1},
    depth: {type: 'number', default: 1},
    offset: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
    rotation: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
    mixin: {default: ''},
    class: {default: 'grabbable'},
    spawnVector: {type: 'vec3', default: {x: 0, y: 0, z: -1}},
    spawnMagnitude: {type: 'number', default: 1.0},
    spawnChargeTime: {type: 'number', default: 1000}
  },

  init: function() {
    var data = this.data;
    var el = this.el;
    this.spawn = this.spawn.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.mousePressed = false;
    this.mouseTimeStamp = null;
    this.power = 0.0;
    this.spawnVector = new THREE.Vector3(0, 0, -1);
  },

  play: function() {
    var el = this.el;
    //el.addEventListener('collide', this.onHit);
    el.addEventListener('spawn', this.spawn);
    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('touchstart', this.onMouseDown);
    document.addEventListener('touchend', this.onMouseUp);
  },

  pause: function() {
    var el = this.el;
    //el.removeEventListener('collide', this.onHit);
    el.removeEventListener('spawn', this.spawn);
    document.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('touchstart', this.onMouseDown);
    document.removeEventListener('touchend', this.onMouseUp);
  },


/*
  onHit: function(evt) {
    var hitEl = evt.detail.body.el;
    if(!hitEl.components.grab) {
      console.log("Hit!");
      return;
    }
    if(!hitEl.components.grab.hitEl) {
      console.log("Not holding anything!")
      if(hitEl.components.grab.grabbing) {
        this.el.emit("spawn");
        console.log("Spawned!");
      }
      return;
    }

    //Writing a better? way
    //if(!AFRAME.utils.entity.getComponent(hitEl, 'grab') || AFRAME.utils.entity.getComponent(hitEl, 'grab.hitEl', '.') === Undefined || !AFRAME.utils.entity.getComponent(hitEl, 'grab.grabbing', '.')) {return;}
    //this.el.emit('spawn');
    if(hitEl.components.grab.grabbing) {
      console.log("Holding something!")
    }

    //console.log(hitEl.components.grab);
    //if(hitEl.grabbing) {
    //  this.spawn();
    //}
    //console.log(evt.detail.body.el.id); */
    /*
  },
  */

  spawn: function() {
    var el = this.el;
    /*
    var entity = document.createElement('a-entity');
    var matrixWorld = el.object3D.matrixWorld;
    var position = new THREE.Vector3();
    var rotation = el.getAttribute('rotation');
    var entityRotation;

    position.setFromMatrixPosition(matrixWorld);
    entity.setAttribute('position', position);

    entity.setAttribute('mixin', this.data.mixin);
    entity.setAttribute('class', this.data.class);
    entity.addEventListener('loaded', function() {
      entityRotation = entity.getAttribute('rotation');
      entity.setAttribute('rotation', {
        x: entityRotation.x + rotation.x,
        y: entityRotation.y + rotation.y,
        z: entityRotation.z + rotation.z
      });
    });
    */
    var poolName = 'pool__' + this.mixinName;
    var entity = el.sceneEl.components['pool__ramsclone'].requestEntity();
    entity.setAttribute('class', this.data.class);
    //el.sceneEl.appendChild(entity);
    var matrixWorld = el.object3D.matrixWorld;
    var position = new THREE.Vector3();
    var rotation = el.getAttribute('rotation');
    var entityRotation;

    position.setFromMatrixPosition(matrixWorld);
    entity.setAttribute('position', position);
    entity.setAttribute('mixin', this.data.mixin);
    entity.setAttribute('class', this.data.class);
    entity.addEventListener('loaded', function() {
      entityRotation = entity.getAttribute('rotation');
      entity.setAttribute('rotation', {
        x: entityRotation.x + rotation.x,
        y: entityRotation.y + rotation.y,
        z: entityRotation.z + rotation.z
      });
    });
    entity.play();

    if(entity.body) {
      var v = entity.body.velocity;
      console.log(v);
      // entity.body.velocity.set(
      //     0,
      //     0,
      //     this.power*(-1)
      // );

      var dir = new THREE.Vector3();
      el.object3D.getWorldDirection(dir);
      console.log("Direction: " + dir.x + " " + dir.y + " " + dir.z)
      entity.body.applyLocalForce(
  /* impulse */        new CANNON.Vec3(dir.x*(-1*this.power), dir.y*(-1*this.power) + this.power/2.5, dir.z*(-1*this.power)),
  /* world position */ new CANNON.Vec3(0, 0.2, 0)
);
      console.log(v);
      console.log("Shot pod at " + this.power + "!");
    }

  },

  onMouseDown: function() {
    var el = this.el;
    if(!this.mouseDown) {
      this.mouseTimeStamp = el.sceneEl.time;
    }
    this.mouseDown = true;
    console.log("Mouse Down!");
  },

  onMouseUp: function() {
    var el = this.el;
    this.power = (el.sceneEl.time - this.mouseTimeStamp)/this.data.spawnChargeTime * this.data.spawnMagnitude;
    if( this.power > this.data.spawnMagnitude) this.power = this.data.spawnMagnitude;
    if(this.mouseDown){
      el.emit('spawn');
    }
    this.mouseDown = false;
    console.log("Mouse Up!");
  }
});

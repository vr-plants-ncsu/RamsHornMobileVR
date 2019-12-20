AFRAME.registerComponent('shooter', {
  schema: {
    width: {type: 'number', default: 1},
    height: {type: 'number', default: 1},
    depth: {type: 'number', default: 1},
    offset: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
    rotation: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
    mixin: {default: ''},
    class: {default: 'grabbable'},
    top_spin: {default: 0, type: 'number'},
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
    this.topSpin = this.data.top_spin;
    this.spawnVector = new THREE.Vector3(0, 0, -1);
  },

  play: function() {
    var el = this.el;
    //el.addEventListener('collide', this.onHit);
    el.addEventListener('spawn', this.spawn);
    if(el.sceneEl.isMobile) {
      document.addEventListener('touchstart', this.onMouseDown);
      document.addEventListener('touchend', this.onMouseUp);
    } else {
      document.addEventListener('mousedown', this.onMouseDown);
      document.addEventListener('mouseup', this.onMouseUp);
    }


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

  spawn: function() {
    var el = this.el;
    var power = this.power;
    //Set up variable to guage maximum thrown linear velocity
    var maxPower = this.data.spawnMagnitude;
    //Variable for contribution of linear velocity to thrown angular velocity
    var topSpin = this.topSpin;
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
    //get reference to object pool
    var poolName = 'pool__' + this.data.mixin;
    //request entity from pool
    var entity = el.sceneEl.components[poolName].requestEntity();
    entity.setAttribute('class', this.data.class);

    //set up orientation of thrown object to be relative to player
    var matrixWorld = el.object3D.matrixWorld;
    var position = new THREE.Vector3();
    var worldRotation = new THREE.Quaternion();
    el.object3D.getWorldQuaternion(worldRotation);
    var entityRotation = new THREE.Quaternion();
    var rotation =       new THREE.Quaternion();

    rotation.setFromEuler(  new THREE.Euler(
                              THREE.Math.degToRad(135),
                              THREE.Math.degToRad(225),
                              THREE.Math.degToRad(30) //45 is perfect angle but I wanted it a little offset
                            )
                         );

    entityRotation.copy(worldRotation);
    entityRotation.multiply(rotation);
    position.setFromMatrixPosition(matrixWorld);
    //entity.setAttribute('position', position);
    entity.object3D.position.copy(position);
    entity.object3D.quaternion.set(
      entityRotation.x,
      entityRotation.y,
      entityRotation.z,
      entityRotation.w);
    //entity.setAttribute('mixin', this.data.mixin);
    //entity.setAttribute('sleepy', 'allowSleep: true; linearDamping: 0.1; angularDamping: 0.1');

    //get reference to cannon.js body component
    var body = entity.getAttribute('body');
      //handle if body is being loaded or not
      //*** note: had to fix error where previously requested items weren't accepting new velocity
      if((typeof(entity.body) !== 'undefined' && entity.body.isLoaded == true) || entity.is('shot')) {
        //console.log("body already exists, fire");
        entity.play()
        launch();
      } else {
        //console.log("loading new physics body: ");
        entity.addState('shot');
        entity.play()
        //launch()
        entity.addEventListener('body-loaded', launch);
      }

    //apply thrown linear velocity and angular velocity to object
    function launch() {
      var dir = new THREE.Vector3();
      var leftDir = new THREE.Vector3(-1, 0, 0);
      var worldPos = new THREE.Vector3();

      //store and normalize direction of spawner
      el.object3D.getWorldDirection(dir);
      dir.normalize();

      //calculate world axis to local x axis of spawner
      el.object3D.getWorldPosition(worldPos);
      leftDir = el.object3D.localToWorld(leftDir);
      leftDir = leftDir.sub(worldPos);
      leftDir.normalize();

      //apply initial linear velocity to thrown object
      entity.body.velocity = new CANNON.Vec3(dir.x*(-1*power), dir.y*(-1*power) + power/1.5, dir.z*(-1*power));
      //console.log("Shot Velocity: " + entity.body.velocity);
      // var torque = leftDir;

      var torque = new CANNON.Vec3(
        leftDir.x,
        leftDir.y,
        leftDir.z
      );

      var torquePower = (power/maxPower)*topSpin;
      torque.mult(torquePower, torque);

      //apply initial angular velocity to thrown object (more reliable behavior than applying torque as force)
      entity.body.angularVelocity.set(
        torque.x,
        torque.y,
        torque.z
      );
    }
  },

  onMouseDown: function() {
    var el = this.el;
    if(!this.mouseDown) {
      //make timestamp when mouse was held down to guage "charge time" of throw
      this.mouseTimeStamp = el.sceneEl.time;
    }
    this.mouseDown = true;
    //console.log("Mouse Down!");
  },

  onMouseUp: function() {
    var el = this.el;
    if(this.mouseDown){
      //calcualte throw power based on "charge time" and maximum throw velocity
      this.power = (el.sceneEl.time - this.mouseTimeStamp)/this.data.spawnChargeTime * this.data.spawnMagnitude;
      if( this.power > this.data.spawnMagnitude)
        this.power = this.data.spawnMagnitude;
      //event used to spawn object - probably better to just call "spawn" function, not sure about overhead of event listeners
      el.emit('spawn');
    }
    this.mouseDown = false;
  }
});

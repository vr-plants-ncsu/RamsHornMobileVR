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
    var power = this.power;
    var maxPower = this.data.spawnMagnitude;
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
    var poolName = 'pool__' + this.data.mixin;
    //console.log(poolName);
    var entity = el.sceneEl.components[poolName].requestEntity();
    entity.setAttribute('class', this.data.class);
    //el.sceneEl.appendChild(entity);
    var matrixWorld = el.object3D.matrixWorld;
    var position = new THREE.Vector3();
    //var rotation = el.getAttribute('rotation');
    var worldRotation = new THREE.Quaternion();
    el.object3D.getWorldQuaternion(worldRotation);
    //console.log("rotation: " + rotation.x + ", " + rotation.y + ", " + rotation.z);
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
    var body = entity.getAttribute('body');
    //console.log("body: ");
      if( (typeof(entity.body) !== 'undefined' && entity.body.isLoaded == true) || entity.is('shot')) {
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

      entity.body.velocity = new CANNON.Vec3(dir.x*(-1*power), dir.y*(-1*power) + power/1.5, dir.z*(-1*power));
      //console.log("Shot Velocity: " + entity.body.velocity);
      var torque = leftDir;

      var torquePower = (power/maxPower)*topSpin;

      var cannonTorque = new CANNON.Vec3(
        torque.x*torquePower,
        torque.y*torquePower,
        torque.z*torquePower
      );

      entity.body.torque.vadd(
        /* torque */                            cannonTorque,
        /* weird requirement for pointer here*/ entity.body.torque
      );
      //Important for reducing physics system overehad.. I *think* this is turned off when "stuck", which is kind of a problem
      /*
        Note: fixing "sleepy" probelm w/ stuck objects:

        It may be possible to create "dummy" emitted objects for the "sticky" scenario, and then when a collision
        occurs just create objects in the same place and parent them to the "sticky" object. This would allow them to travel
        with the sticky object's movement without having to calculate physics continuously. Currently the "stuck" objects
        have their "sleepy" attribute forced to false to allow them to still be subjected to the forces of a physical constraint
        to the "sticky" object.

        Ideal solution would be to "deactivate" the physics body and "reactivate" it, avoiding generating new objects. This is
        available through the A-Frame Physics System, using the "pause" function of the body class
      */
      //entity.setAttribute('sleepy', 'allowSleep: true; linearDamping: 0.1; angularDamping: 0.1');
      //entity.play();
    }
    // entity.addEventListener('body-loaded', function() {
    //
    //   var dir = new THREE.Vector3();
    //   var leftDir = new THREE.Vector3(-1, 0, 0);
    //   var worldPos = new THREE.Vector3();
    //   //store and normalize direction of spawner
    //   el.object3D.getWorldDirection(dir);
    //   dir.normalize();
    //
    //   //calculate world axis to local x axis of spawner
    //   el.object3D.getWorldPosition(worldPos);
    //   leftDir = el.object3D.localToWorld(leftDir);
    //   leftDir = leftDir.sub(worldPos);
    //   leftDir.normalize();
    //
    //   entity.body.velocity = new CANNON.Vec3(dir.x*(-1*power), dir.y*(-1*power) + power/1.5, dir.z*(-1*power));
    //   var torque = leftDir;
    //
    //   var torquePower = (power/maxPower)*topSpin;
    //
    //   var cannonTorque = new CANNON.Vec3(
    //     torque.x*torquePower,
    //     torque.y*torquePower,
    //     torque.z*torquePower
    //   );
    //   entity.body.torque.vadd(
    //     /* torque */                            cannonTorque,
    //     /* weird requirement for pointer here*/ entity.body.torque
    //   );
    //   //Important for reducing physics system overehad.. I *think* this is turned off when "stuck", which is kind of a problem
    //   /*
    //     Note: fixing "sleepy" probelm w/ stuck objects:
    //
    //     It may be possible to create "dummy" emitted objects for the "sticky" scenario, and then when a collision
    //     occurs just create objects in the same place and parent them to the "sticky" object. This would allow them to travel
    //     with the sticky object's movement without having to calculate physics continuously. Currently the "stuck" objects
    //     have their "sleepy" attribute forced to false to allow them to still be subjected to the forces of a physical constraint
    //     to the "sticky" object.
    //
    //     Ideal solution would be to "deactivate" the physics body and "reactivate" it, avoiding generating new objects. This is
    //     available through the A-Frame Physics System, using the "pause" function of the body class
    //   */
    //   entity.setAttribute('sleepy', 'allowSleep: true; linearDamping: 0.1; angularDamping: 0.1');
    // });
  },

  onMouseDown: function() {
    var el = this.el;
    if(!this.mouseDown) {
      this.mouseTimeStamp = el.sceneEl.time;
    }
    this.mouseDown = true;
    //console.log("Mouse Down!");
  },

  onMouseUp: function() {
    var el = this.el;
    if(this.mouseDown){
      this.power = (el.sceneEl.time - this.mouseTimeStamp)/this.data.spawnChargeTime * this.data.spawnMagnitude;
      if( this.power > this.data.spawnMagnitude)
        this.power = this.data.spawnMagnitude;
      el.emit('spawn');
    }
    this.mouseDown = false;
    //console.log(THREE.Cache);
    //console.log("Mouse Up!");

  }
});

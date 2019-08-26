AFRAME.registerComponent('shooter', {
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
    this.topSpin = 15.0;
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

    //Get pool of spawned objects
    var poolName = 'pool__' + this.data.mixin;
    //console.log(poolName);

    //Get entity from pool
    var entity = el.sceneEl.components[poolName].requestEntity();

    //Set up entity
    entity.setAttribute('class', this.data.class);
    //el.sceneEl.appendChild(entity);

    //Set up tranform properties ('shooter' orientation multiplied by 'entity' spawn oritentation)
  )
    var matrixWorld = el.object3D.matrixWorld;
    var position = new THREE.Vector3();
    var worldRotation = new THREE.Quaternion();
    el.object3D.getWorldQuaternion(worldRotation);
    var entityRotation = new THREE.Quaternion();
    var rotation =       new THREE.Quaternion();

    //It would be best to store this in data passed to class, rather than hard-coded here
    rotation.setFromEuler(  new THREE.Euler(
                              THREE.Math.degToRad(135),
                              THREE.Math.degToRad(225),
                              THREE.Math.degToRad(30) //45 is perfect angle but I wanted it a little offset
                            )
                          );
    //copy orientation of 'shooter' to object, then multiply by default object rotation to get correct emission orientation
    entityRotation.copy(worldRotation);
    entityRotation.multiply(rotation);

    //Get 'shooter' location as world transform value
    position.setFromMatrixPosition(matrixWorld);
    //entity.setAttribute('position', position);

    //Start emitted object in same position as 'shooter'
    entity.object3D.position.copy(position);
    entity.object3D.quaternion.set(
      entityRotation.x,
      entityRotation.y,
      entityRotation.z,
      entityRotation.w);

    //Make object 'grabbable' (holdover from 'spawner" class)
    entity.setAttribute('class', this.data.class);

    //I think we might want to put everything above in here...
    entity.addEventListener('loaded', function() {
      //entityRotation = entity.object3D.quaternion;
      //entity.setAttribute('rotation', {
      //  x: entityRotation.x + rotation.x,
      //  y: entityRotation.y + rotation.y,
      //  z: entityRotation.z + rotation.z
      //});
      //console.log("rotation: " + entityRotation.x
                  // + ", " + entityRotation.y
                  // + ", " + entityRotation.z
                  // + ", " + entityRotation.w );
      // entity.object3D.rotation.set(
      //   entityRotation.x + rotation.x,
      //   entityRotation.y + rotation.y,
      //   entityRotation.z + rotation.z
      // );
      // entity.object3D.quaternion.copy(
      //   entityRotation
      // );
      //entity.object3D.quaternion.setFromRotationMatrix(matrixWorld);
    });

    //Wait for physcis body to load, then add force to "shoot" emitted object
    entity.addEventListener('body-loaded', function() {
      //probably not necessary...
      if(entity.body) {
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
        //Logs for testing...
        //console.log("Spawner Direction: " + dir.x + ", " + dir.y + ", " + dir.z );
        //console.log(power);
        //entity.body.velocity = new CANNON.Vec3(0, 0, 0);

        //opted to set starting 'velocity' rather than add force - more predictable movement
        entity.body.velocity = new CANNON.Vec3(dir.x*(-1*power), dir.y*(-1*power) + power/1.5, dir.z*(-1*power));
    //     entity.body.applyForce(
    // /* impulse */        new CANNON.Vec3(dir.x*(-1*power), dir.y*(-1*power) + power/1.5, dir.z*(-1*power)),
    // /* local position */ new CANNON.Vec3(0, 0, 0)
    //     );
        var torque = leftDir;
        //torque.applyAxisAngle(dir, THREE.Math.degToRad(0))
        var torquePower = (power/maxPower)*topSpin;
        //console.log("Power: " + power);
        //console.log("Max Power: " + maxPower);
        //console.log("Max Top Spin: " + topSpin);
        //console.log("Top Spin: " + torquePower);
        var cannonTorque = new CANNON.Vec3(
          torque.x*torquePower,
          torque.y*torquePower,
          torque.z*torquePower
        );
        entity.body.torque.vadd(
          /* torque */                            cannonTorque,
          /* weird requirement for pointer here*/ entity.body.torque
        )
      }
      //Important for reducing physics system overehad.. I *think* this is turned off when "stuck", which is kind of a problem
      /*
        Note: fixing "sleepy" probelm w/ stuck objects:

        It may be possible to create "dummy" emitted objects for the "sticky" scenario, and then when a collision
        occurs just create objects in the same place and parent them to the "sticky" object. This would allow them to travel
        with the sticky object's movement without having to calculate physics continuously. Currently the "stuck" objects
        have their "sleepy" attribute forced to false to allow them to still be subjected to the forces of a physical constraint
        to the "sticky" object.
      */
      entity.setAttribute('sleepy', 'allowSleep: true; linearDamping: 0.1; angularDamping: 0.1');
    });

    //activate physics body?
    entity.play();

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
    this.power = (el.sceneEl.time - this.mouseTimeStamp)/this.data.spawnChargeTime * this.data.spawnMagnitude;
    if( this.power > this.data.spawnMagnitude) this.power = this.data.spawnMagnitude;
    if(this.mouseDown){
      el.emit('spawn');
    }
    this.mouseDown = false;
    //console.log(THREE.Cache);
    //console.log("Mouse Up!");

  }
});

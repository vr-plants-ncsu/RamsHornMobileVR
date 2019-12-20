AFRAME.registerComponent('spawner', {
  schema: {
    width: {type: 'number', default: 1},
    height: {type: 'number', default: 1},
    depth: {type: 'number', default: 1},
    offset: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
    rotation: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
    mixin: {default: ''},
    class: {default: 'grabbable'}
  },

  init: function() {
    var data = this.data;
    var el = this.el;
    this.onHit = this.onHit.bind(this);
    this.spawn = this.spawn.bind(this);
    this.pool = 'pool__' + this.data.mixin;
  },

  play: function() {
    var el = this.el;
    el.addEventListener('collide', this.onHit);
    el.addEventListener('spawn', this.spawn);
  },

  pause: function() {
    var el = this.el;
    el.removeEventListener('collide', this.onHit);
    el.removeEventListener('spawn', this.spawn);
  },

  onHit: function(evt) {
    var grabber = evt.detail.body.el;
    if(!grabber.components.grab) {
      console.log("Hit by non-grabber, : " + grabber + ".");
      return;
    }
    if(!grabber.components.grab.hitEl) {
      console.log("Not holding anything!")
      if(grabber.components.grab.grabbing) {
        //this.el.emit("Trying to grab spawner!");
        this.el.emit("spawn");
        console.log("Spawned!")
      }
      return
    }
    if(grabber.components.grab.grabbing) {
      console.log("Holding something: " + grabber.components.grab.hitEl + "!");
    }

    //console.log(hitEl.components.grab);
    //if(hitEl.grabbing) {
    //  this.spawn();
    //}
    //console.log(evt.detail.body.el.id);
  },

  spawn: function() {
    var el = this.el;
    var poolName = 'pool__' + this.data.mixin;
    //var entity = document.createElement('a-entity');
    //here we assume mixin is pooled:

    var entity = el.sceneEl.components[poolName].requestEntity();
    console.log(entity);
    entity.play();
    entity.setAttribute('class', this.data.class);
    var matrixWorld = el.object3D.matrixWorld;
    var position = new THREE.Vector3();
    var worldRotation = new THREE.Quaternion();
    //var rotation = el.getAttribute('rotation');
    var rotation = new THREE.Quaternion();
    rotation = el.object3D.quaternion;
    var entityRotation = new THREE.Quaternion();

    position.setFromMatrixPosition(matrixWorld);
    //matrixWorld.getWorldQuaternion(rotation);

    //optimized below - actually should be further optimized!
    //entity.setAttribute('position', position);
    entity.object3D.position.copy(position);
    entity.object3D.quaternion.copy(rotation);
    if(!entity.loaded){
      entity.addEventListener('loaded', function() {
        entity.object3D.position.copy(position);
        entity.object3D.quaternion.copy(rotation);
        //el.sceneEl.appendChild(entity);
      });
    } else {
      entity.object3D.position.copy(position);
      entity.object3D.quaternion.copy(rotation);
      //el.sceneEl.appendChild(entity);
    }
    if(!entity.body) {
      entity.addEventListener('body-loaded', () => {
        entity.body.velocity = new CANNON.Vec3();
        entity.body.angularVelocity = new CANNON.Vec3();
        //entity.play();
      })
    } else {
      entity.body.velocity = new CANNON.Vec3();
      entity.body.angularVelocity = new CANNON.Vec3();
      //entity.play();
    }
    //el.sceneEl.appendChild(entity);

    //el.sceneEl.appendChild(entity);
  },
});

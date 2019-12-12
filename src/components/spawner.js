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
    var hitEl = evt.detail.body.el;
    if(!hitEl.components.grab) {
      return;
    }
    if(!hitEl.components.grab.hitEl) {
      console.log("Not holding anything!")
      if(hitEl.components.grab.grabbing) {
        this.el.emit("spawn");
        console.log("Spawned!")
      }
      return
    }
    if(hitEl.components.grab.grabbing) {
      console.log("Holding something!")
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

    var entity = el.sceneEl.components[poolName].requestentity();
    entity.setAttribute('class', this.data.class);
    var matrixWorld = el.object3D.matrixWorld;
    var position = new THREE.Vector3();
    var worldRotation = new THREE.Quaternion();
    //var rotation = el.getAttribute('rotation');
    var rotation = new THREE.Quaternion();
    rotation = this.object3D.quaternion;
    var entityRotation = new THREE.Quaternion();

    position.setFromMatrixPosition(matrixWorld);
    matrixWorld.getWorldQuaternion(rotation);

    //optimized below - actually should be further optimized!
    //entity.setAttribute('position', position);
    entity.object3D.position.copy(position);
    entity.object3D.quaternion.copy(rotation);

    //entity.setAttribute('mixin', this.data.mixin);
    entity.addEventListener('loaded', function() {
      entityRotation = entity.getAttribute('rotation');
      entity.object3D.position.copy(position);
      entity.object3D.quaternion.copy(rotation);
    });

    entity.addEventListener('body-loaded', () => {
      var body = entity.getAttribute('body');
      body.velocity = new CANNON.Vec3();
      body.angularVelocity = new CANNON.Vec3();
    })
    //el.sceneEl.appendChild(entity);
  },
});

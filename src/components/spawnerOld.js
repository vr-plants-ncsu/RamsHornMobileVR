AFRAME.registerComponent('spawner', {
  schema: {
    width: {type: 'number', default: 1},
    height: {type: 'number', default: 1},
    depth: {type: 'number', default: 1},
    offset: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
    rotation: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
    mixin: {default: ''}
  },

  init: function() {
    var data = this.data;
    var el = this.el;
    this.onHit = this.onHit.bind(this);
    this.spawn = this.spawn.bind(this);
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

    console.log(hitEl.components.grab);
    //if(hitEl.grabbing) {
    //  this.spawn();
    //}
    console.log(evt.detail.body.el.id);
  },

  spawn: function() {
    var el = this.el;
    var entity = document.createElement('a-entity');
    var matrixWorld = el.object3D.matrixWorld;
    var position = new THREE.Vector3();
    var rotation = el.getAttribute('rotation');
    var entityRotation;

    position.setFromMatrixPosition(matrixWorld);
    entity.setAttribute('position', position);

    entity.setAttribute('mixin', this.data.mixin);
    entity.addEventListener('loaded', function() {
      entityRotation = entity.getAttribute('rotation');
      entity.setAttribute('rotation', {
        x: entityRotation.x + rotation.x,
        y: entityRotation.y + rotation.y,
        z: entityRotation.z + rotation.z
      });
    });
    el.sceneEl.appendChild(entity);
  },
});

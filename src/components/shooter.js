AFRAME.registerComponent('shooter', {
  schema: {
    width: {type: 'number', default: 1},
    height: {type: 'number', default: 1},
    depth: {type: 'number', default: 1},
    offset: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
    rotation: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
    velocity: {type: 'vec3', default: {x: 0, y: 0, z: 1}},
    mixin: {default: ''},
    class: {default: 'grabbable'}
  },

  init: function() {
    var data = this.data;
    var el = this.el;
    //this.onHit = this.onHit.bind(this);
    this.shoot = this.shoot.bind(this);
  },

  play: function() {
    var el = this.el;
    //el.addEventListener('collide', this.onHit);
    //el.addEventListener('spawn', this.spawn);
    el.addEventListener('mousedown', this.shoot);
  },

  pause: function() {
    var el = this.el;
    // el.removeEventListener('collide', this.onHit);
    // el.removeEventListener('shoot', this.shoot);
    el.removeEventListener('mousedown', this.shoot);
  },

  update: function() {

  },

  shoot: function() {
    var el = this.el;
    var entity = sceneEl.components.pool__ramsHorn.requestEntity();
    var matrixWorld = el.object3D.matrixWorld;
    var position = new THREE.Vector3();
    var rotation = el.getAttribute('rotation');
    var entityRotation;

    position.setFromMatrixPosition(matrixWorld);
    entity.setAttribute('position', position);

    //entity.setAttribute('mixin', this.data.mixin);
    //entity.setAttribute('class', this.data.class)
    entity.addEventListener('loaded', function() {
      entityRotation = entity.getAttribute('rotation');
      entity.setAttribute('rotation', {
        x: entityRotation.x + rotation.x,
        y: entityRotation.y + rotation.y,
        z: entityRotation.z + rotation.z
      });
      entity.body.velocity.set(0, 0, -5);
      //el.sceneEl.appendChild(entity);
      entity.play();
    });
  },
});

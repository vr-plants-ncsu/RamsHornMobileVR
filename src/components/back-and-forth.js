AFRAME.registerComponent('back-and-forth', {
  schema: {
    speed: {type: 'number', default: 1},
    direction: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
    distance: {type: 'number', default: 1}
  },

  init: function() {
    var distance = this.distance;
    var direction = new THREE.Vector3(
                  direction.x,
                  direction.y,
                  direction.z
                );
    var temp = this.el.getAttribute('position');
    this.origin = new THREE.Vector3(
                    temp.x,
                    temp.y,
                    temp.z
                  );
    this.destination = new THREE.Vector3(
                        temp.x,
                        temp.y,
                        temp.z
                      );
    this.location = new THREE.Vector3(
                      origin.x,
                      origin.y,
                      origin.z
                    );
    this.distanceTraveled = 0;
    temp.set(
      direction.x*distance,
      direction.y*distance,
      direction.z*distance
    );
    this.destination.add(temp);
  },

  tick: function() {

  }
});

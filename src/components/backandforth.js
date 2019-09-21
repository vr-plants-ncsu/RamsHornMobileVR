AFRAME.registerComponent('back-and-forth', {
  schema: {
    speed: {type: 'number', default: 1},
    direction: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
    distance: {type: 'number', default: 1},
    easing: {type: 'number', default: 0.5}
  },

  init: function() {
    this.startingPosition = new THREE.Vector3
    this.startingPosition.copy(this.el.object3D.position);
  },

  tick: function() {



    // distance = this.data.distance;
    // location = this.location;
    // easingDistance = this.easingDistance;
    // acceleration = this.acceleration;
    // velocity = this.velocity;
    // distanceTraveled = this.distanceTraveled;
    // moveDir = this.moveDir;

    // if( (distance > 0 && distanceTraveled >= distance ) ||
    //     (distance < 0 && -distanceTraveled <= distance ) )
    // {
    //   velocity.multiplyScalar(-1);
    //   acceleration.multiplyScalar(-1);
    //   distaneTraveled = 0;
    // }
    //
    // if(distanceTraveled < easingDistance) {
    //   stepUp();
    // } else if(distanceTraveled >= (distance - easingDistance) ) {
    //   stepDown();
    // }
    //
    // //easing towards maximum velocity
    // function stepUp() {
    //   velocity.add(acceleration);
    // }
    //
    // //easing down to zero velocity
    // function stepDown() {
    //   velocity.sub(acceleration);
    // }
    //
    // //location += velocity
    // this.el.object3D.position.add(velocity);
    // console.log(this.el.object3D.position);
    // this.distanceTravled += velocity.length();

    this.el.object3D.position.set(
        this.startingPosition.x,
        this.startingPosition.y,
        this.startingPosition.z + Math.sin(this.el.sceneEl.time/1000)
    );
    //this.el.object3D.updateMatrixWorld(true);
    //this.el.object3D.children.forEach( function(child) {
    //  child.updateMatrix();
    //  child.updateMatrixWorld(true);
    //})
  }
});

AFRAME.registerComponent('back-and-forth', {
  schema: {
    speed: {type: 'number', default: 1},
    direction: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
    distance: {type: 'number', default: 1},
    easing: {type: 'number', default: 0.5}
  },

  init: function() {
    this.tick = AFRAME.utils.throttleTick(this.tick, 10, this);
    this.direction = new THREE.Vector3(
      this.data.direction.x,
      this.data.direction.y,
      this.data.direction.z
    );
    this.speed = this.data.speed;
    this.distance = this.data.distance;

    this.startingPosition = new THREE.Vector3;
    this.startingPosition.copy(this.el.object3D.position);
    this.nextPosition = new THREE.Vector3;
    this.needsPositionReset = false;
    this.tempOffset = new THREE.Vector3;
    //this.moveDir = "Forward";

    /*
    Relevant formulas used above / proof:
      position: s(t) = 1/2*a*t^2 + v(initial)*t
      Solving for acceleration along easing distance (no initial velocity):
        s(t) = 1/2*a*t^2
        v(t) = a*t
          where x = time to reach top speed and top speed = v(x):
            v(x) = a*x
            s(x) = 1/2*a*x^2 = 1/2*(a*x)*x = 1/2*v(x)*x
          solving for x:
            x = 2*s(x)/v(x) = 2*(easing distance)/(top speed) where:
                                                                        easing distance = total distance / 2 * easing percentage
                                                                        top speed = given maximum velocity
          solve for a(x) where s(x) = easing distance and v(x) = maximum velocity
            v(x) = a*x
            a(x) = v(x)/x = v(x) / ( 2*s(x) / v(x) ) = v(x)^2 / 2*s(x)
            a(x) = (maximum velocity)^2 / 2*(easing distance)
    */
  },

  pause: function() {
    this.needsPositionReset = true;
    this.tempOffset.copy(this.el.object3D.position);
    this.tempOffset.sub(this.startingPosition);
  },

  play: function() {
    if(this.needsPositionReset) {
      this.startingPosition.copy(this.el.object3D.position);
      this.startingPosition.sub(this.tempOffset);
    }
    this.speed = this.data.speed;
    this.distance = this.data.distance;
    this.direction = new THREE.Vector3(
      this.data.direction.x,
      this.data.direction.y,
      this.data.direction.z
    );
  },

  tick: function(t, dt) {

    //distance = this.data.distance;
    //location = this.location;
    //speed = this.data.speed;

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
    this.nextPosition.copy(this.direction);
    this.nextPosition.multiplyScalar(Math.sin(this.el.sceneEl.time/1000*this.speed)*this.distance);
    this.nextPosition.add(this.startingPosition);
    //this.direction.multiplyScalar(Math.sin(this.el.sceneEl.time));
    this.el.object3D.position.set(
      this.nextPosition.x,
      this.nextPosition.y,
      this.nextPosition.z
    );
//console.log(this.direction);
  }
});

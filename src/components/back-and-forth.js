AFRAME.registerComponent('back-and-forth', {
  schema: {
    speed: {type: 'number', default: 1},
    direction: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
    distance: {type: 'number', default: 1},
    easing: {type: 'number', default: 0.5}
  },

  init: function() {
    var distance = this.distance;

    this.tick = AFRAME.utils.throttleTick(this.tick, 10, this);

    //make sure speed is stored as a positive value
    if(this.data.speed < 0)
      this.data.speed = this.data.speed * -1;

    //used to determine second endpoint
    this.direction = new THREE.Vector3(
                  this.data.direction.x,
                  this.data.direction.y,
                  this.data.direction.z
                );
    this.direction.normalize();

    var temp = new THREE.Vector3(
      this.el.object3D.position.x,
      this.el.object3D.position.y,
      this.el.object3D.position.z
    );

    //first endpoint stored as a THREE.Vector3 object
    this.origin = new THREE.Vector3(
                    temp.x,
                    temp.y,
                    temp.z
                  );
    //second endpoint stored as a THREE.Vector3 object
    this.destination = new THREE.Vector3(
                        temp.x,
                        temp.y,
                        temp.z
                      );
    //current location along path stored as a THREE.Vector3 object
    // this.location = new THREE.Vector3(
    //                   origin.x,
    //                   origin.y,
    //                   origin.z
    //                 );

    this.distanceTraveled = 0;
    //calculating correct position for second endpoint
    temp.set(
      this.direction.x*distance,
      this.direction.y*distance,
      this.direction.z*distance
    );
    this.destination.add(temp);

    //easing should be a value between 0 and 1 (percentage)
    if(this.data.easing > 1.0) this.data.easing = 1.0;
    if(this.data.easing < 0.0) this.data.easing = 0.0;

    //acceleration and maximum velocity should be negative if accelerating in negative direction
    if(this.data.distance < 0) {
      this.data.speed = this.data.speed * -1;
    }

    //calculate distance along path on which easing (accleration/deceleration occurs)
    this.easingDistance = this.data.distance/2 * this.data.easing;

    /*avoid dividing by zero; if easing distance is 0, accleration is stored as zero -
      later step functions will understand 0 acceleration means to skip the acceleration
      steps and move at maximum velocity throughout animation
    */
    this.acceleration = new THREE.Vector3(
      this.direction.x,
      this.direction.y,
      this.direction.z
    );
    var speed = this.data.speed;
    if(this.easingDistance != 0) {
      this.acceleration.multiplyScalar(Math.sign(speed)*(speed*speed)/(2*this.easingDistance) );
    } else {
      this.acceleration.set(0, 0, 0);
    }

    this.velocity = new THREE.Vector3(0, 0, 0);
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

  tick: function(t, dt) {

    distance = this.data.distance;
    location = this.location;
    easingDistance = this.easingDistance;
    acceleration = this.acceleration;
    velocity = this.velocity;
    distanceTraveled = this.distanceTraveled;
    moveDir = this.moveDir;

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

    this.el.object3D.position.add(
      new THREE.Vector3(
        Math.sin(this.el.sceneEl.time),
        0,
        0
      )
    );
  }
});

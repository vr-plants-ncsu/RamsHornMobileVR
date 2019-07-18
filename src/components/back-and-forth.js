AFRAME.registerComponent('back-and-forth', {
  schema: {
    speed: {type: 'number', default: 1},
    direction: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
    distance: {type: 'number', default: 1},
    easing: {type: 'number', default: 0.5}
  },

  init: function() {
    var distance = this.distance;

    //make sure speed is stored as a positive value
    if(this.data.speed < 0)
      this.data.speed = this.data.speed * -1;
    }

    //used to determine second endpoint
    var direction = new THREE.Vector3(
                  direction.x,
                  direction.y,
                  direction.z
                );
    var temp = this.el.getAttribute('position');

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
    this.location = new THREE.Vector3(
                      origin.x,
                      origin.y,
                      origin.z
                    );
    this.distanceTraveled = 0;
    //calculating correct position for second endpoint
    temp.set(
      direction.x*distance,
      direction.y*distance,
      direction.z*distance
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
    if(this.easingDistance != 0) {
      this.acceleration = (speed*speed)/(2*this.easingDistance);
    } else {
      this.acceleration = 0;
    }

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

  tick: function() {

  }
});

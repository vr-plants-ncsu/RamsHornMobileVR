//Based off of elements of Don McCurdy's 'grab.js' component
AFRAME.registerComponent('sticky', {
  schema: {
    objects: {default: ''},
    //strength: {type: 'number', default: },
    //sound: {type: 'audio'}
  },

  init: function() {
    var data = this.data;
    var el = this.el;
    this.system = this.el.sceneEl.systems.physics;
    //Elements to handle "stick" events
    this.els = [];
    //Elements that are "stuck" - May not be necessary, taking out for now
    //this.stuckEls = []
    //"Stuck" state to add to stickable elements - used instead of array of els
    this.STUCK_STATE = 'stuck';

    this.nextKey = 0;


    this.sticky = true;
    //Handles elements that collide
    this.hitEl = null;
    this.physics = this.system;

    //Keeps track of constraints - may be be useful for "removing" constraints
    this.constraints = {};
    //this.constraint = null;

    //Bind Event Handlers
    this.onHit = this.onHit.bind(this);
    this.onStick = this.onStick.bind(this);
  },

  play: function() {
    var el = this.el;
    el.addEventListener('collide', this.onHit);
    el.addEventListener('stick', this.onStick);
    //el.addEventListener('makeSound', this.makeSound);
  },

  pause: function() {
    var el = this.el;
    el.removeEventListener('collide', this.onHit);
    el.removeEventListener('stick', this.onStick);
    //el.removeEventListener('makeSound', this.makeSound);
  },

  update: function() {
    let objectEls;

    //Push entities into list of els to interesect
    if (this.data.objects) {
      objectEls = this.el.sceneEl.querySelectorAll(data.objects);
    } else {
      //If objects not defined, stick everything
      objectEls = this.el.sceneEl.children;
    }
    // Convert from NodeList to array
    this.els = Array.prototype.slice.call(objectEls);
  },

  onHit: function(evt) {
    var hitEl = evt.detail.body.el;
    //Check list of els if objects is defined
    if(this.data.objects) {
      this.els.forEach(checkStickable(hitEl));
    } else {
      //If objects is not defined, just check if stuck
      if(!hitEl.is(this.STUCK_STATE)) {
        hitEl.addState(this.STUCK_STATE);
        //probably can get away with emitting from hit element?
        this.el.emit('stick', {el: hitEl});
      }
    }
    //check if one of the
    function checkStickable (el, hitEl) {
      if(el === hitEl && !hitEl.is(this.STUCK_STATE)) {
        hitEl.addState(this.STUCK_STATE);
        this.el.emit('stick', {el: hitEl});
      }
    }

  //  if(hitEl.getAttribute('class') ==
    //}
    //if(!hitEl.components.grab.hitEl) {
      //console.log("Not holding anything!")
      //if(hitEl.components.grab.grabbing) {
        //this.el.emit("spawn");
        //console.log("Spawned!");
      //}
      //return;
    //}

    //Writing a better? way
    //if(!AFRAME.utils.entity.getComponent(hitEl, 'grab') || AFRAME.utils.entity.getComponent(hitEl, 'grab.hitEl', '.') === Undefined || !AFRAME.utils.entity.getComponent(hitEl, 'grab.grabbing', '.')) {return;}
    //this.el.emit('spawn');
    //if(hitEl.components.grab.grabbing) {
    //  console.log("Holding something!")
    //}

    //console.log(hitEl.components.grab);
    //if(hitEl.grabbing) {
    //  this.spawn();
    //}
    //console.log(evt.detail.body.el.id); */
  },

  onStick: function(evt) {
    const hitEl = evt.detail.el;
    constraints = this.constraints;
    let constraint;
    constraint = new CANNON.LockConstraint(this.el.body, hitEl.body);
    //this.constraints.push(constraint);
    constraints[this.nextKey] = constraint;
    this.system.addConstraint(constraints[(this.nextKey)]);
    //hitEl.removeAttribute('sleepy');
    hitEl.setAttribute('sleepy', 'allowSleep: false; linearDamping: 0.0; angularDamping: 0.1');
    //hitEl.setAttribute('body', 'type', 'static');
    hitEl.setAttribute("id", this.nextKey);
    //this.el.object3D.attach(hitEl.object3D);
    //hitEl.object3D.parent = this.el.object3D;

    //hitEl.object3D.position = this.el.object3D.localToWorld(hitEl.object3D.position);
    // var tempPos = new THREE.Vector3(0, 0, 0);
    // var tempRot = new THREE.Quaternion(0, 0, 0, 1);
    // tempPos.copy(hitEl.object3D.position);
    // tempRot.copy(hitEl.object3D.rotation);
    // console.log(tempPos);
    // this.el.object3D.updateMatrix();
    // var matrix = this.el.object3D.matrix;
    // console.log(matrix);
    //this.el.add(hitEl);
    // hitEl.object3D.position = hitEl.object3D.worldToLocal(hitEl.object3D.position);
    // console.log(hitEl.object3D.position);
    this.nextKey++;
  },

  onUnstick: function(evt) {
    const stuckEl = evt.detail.el;
    constraints = this.constraints;
    var key = stuckEl.id;
    if(constraints[key]) {
      this.system.removeConstraint(constraints[key]);
      delete constraints[key];
    }
    stuckEl.setAttribute('sleepy', 'allowSleep: true; linearDamping: 0.1; angularDamping: 0.1');
    //this.el.object3D.remove(stuckEl.object3D);
  },

  makeSound: function() {
    // TODO
    return;
  },

});

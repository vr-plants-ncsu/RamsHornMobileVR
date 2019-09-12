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
    this.stuckEls = [];
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

  tick: function() {
    let objectEls;

    //Push entities into list of els to interesect
    if (this.data.objects) {
      objectEls = this.el.sceneEl.querySelectorAll(this.data.objects);
    } else {
      //If objects not defined, stick everything
      objectEls = this.el.sceneEl.children;
    }
    // Convert from NodeList to array
    this.els = Array.prototype.slice.call(objectEls);
  },

  onHit: function(evt) {
    var el = this.el;
    var stuckState = this.STUCK_STATE;
    var hitEl = evt.detail.body.el;
    //Check list of els if objects is defined
    if(this.data.objects) {
      this.els.forEach(checkStickable);
    } else {
      //If objects is not defined, just check if stuck
      if(!hitEl.is(this.STUCK_STATE)) {
        hitEl.addState(this.STUCK_STATE);
        //probably can get away with emitting from hit element?
        this.el.emit('stick', {el: hitEl});
      }
    }
    //check if one of the
    function checkStickable (element) {
      if(element === hitEl && !hitEl.is(this.STUCK_STATE)) {
        hitEl.addState(stuckState);
        el.emit('stick', {el: hitEl});
      }
    }
  },

  onStick: function(evt) {
    var nextKey = this.nextKey;
    //element to be stuck
    const hitEl = evt.detail.el;
    //array of constraints
    constraints = this.constraints;
    //make new constraint var
    let constraint;
    constraint = new CANNON.LockConstraint(this.el.body, hitEl.body);
    //add constraint to array for tracking
    constraints[this.nextKey] = constraint;
    //add constraint to physics system
    this.system.addConstraint(constraints[(this.nextKey)]);
    hitEl.setAttribute('sleepy', 'allowSleep: false; linearDamping: 0.0; angularDamping: 0.1');
    hitEl.setAttribute("id", this.nextKey);
    this.stuckEls[nextKey] = hitEl;
    nextKey++;
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

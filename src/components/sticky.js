//Based off of elements of Don McCurdy's 'grab.js' component
AFRAME.registerComponent('sticky', {
  schema: {
    objects: {type: 'string', default: ''},
    //strength: {type: 'number', default: },
    //sound: {type: 'audio'}
    sticky: {default: true, type: 'boolean'},
    update_delay: {default: 1, type: 'number'},
    stuck_item_limit: {default: 5, type: 'number'},
  },

  init: function() {
    var data = this.data;
    var el = this.el;
    this.system = this.el.sceneEl.systems.physics;
    //Elements to handle "stick" events
    this.els = [];
    //Elements that are "stuck" - May not be necessary, taking out for now
    this.stuckEls = [];
    this.stuckNum = 0;
    //"Stuck" state to add to stickable elements - used instead of array of els
    this.STUCK_STATE = 'stuck';
    this.UNSTUCK_STATE = 'unstuck';

    this.nextKey = 0;
    this.sticky = this.data.sticky;
    //Handles elements that collide
    this.hitEl = null;
    this.physics = this.system;

    //Keeps track of constraints - may be be useful for "removing" constraints
    this.constraints = {};

    //make variables for data Stuff
    this.delay = parseInt(data.update_delay) * 1000;
    if(this.delay < 0) this.delay = 0;
    this.itemLimit = parseInt(data.stuck_item_limit);
    if(this.itemLimit < 0) this.itemLimit = 0;
    this.timestamp = -1;

    //Bind Event Handlers
    this.onHit = this.onHit.bind(this);
    this.onStick = this.onStick.bind(this);
    this.onUnstick = this.onUnstick.bind(this);
    this.unstickAll = this.unstickAll.bind(this);
    //this.turnOnSticky = this.turnOnSticky.bind(this);
    //this.turnOffSticky = this.turnOffSticky.bind(this);
  },

  play: function() {
    var el = this.el;
    el.addEventListener('collide', this.onHit);
    el.addEventListener('stick', this.onStick);
    el.addEventListener('unstick', this.onUnstick);
    el.addEventListener('unstick-all', this.unstickAll);
    //if(this.sticky) {
      //el.addEventListener('sticky-off', this.turnOffSticky);

    //} else {
    //  el.addEventListener('sticky-on', this.turnOnSticky);
    //}
    //el.addEventListener('makeSound', this.makeSound);
  },

  pause: function() {
    var el = this.el;
    el.removeEventListener('collide', this.onHit);
    el.removeEventListener('stick', this.onStick);
    el.removeEventListener('unstick', this.onUnstick);
    el.removeEventListener('unstick-all', this.unstickAll);
    //el.removeEventListener('sticky-off', this.turnOffSticky);
    //el.removeEventListener('sticky-on', this.turnOnSticky);
    //el.removeEventListener('makeSound', this.makeSound);
  },

  tick: function() {
    // let objectEls;
    //
    // //Push entities into list of els to interesect
    // if (this.data.objects) {
    //   objectEls = this.el.sceneEl.querySelectorAll(this.data.objects);
    // } else {
    //   //If objects not defined, stick everything
    //   objectEls = this.el.sceneEl.children;
    // }
    // // Convert from NodeList to array
    // this.els = Array.prototype.slice.call(objectEls);

    //Check if number of 'stuck' elements is above limit
    if(this.stuckNum >= this.itemLimit && this.itemLimit > 0) {
      //if not currently in 'delay' period (after 'stuckNum' exceeds 'itemLimit'), set timestamp for delay
      if(this.delay > 0 && this.timestamp < 0) {
        //set timestamp to time delay
        this.timestamp = this.el.sceneEl.time;
      }
      //unstick and reset timestamp if time past timestamp exceeds delay (this will always be true for a '0' delay)
      if(this.el.sceneEl.time - this.timestamp > this.delay) {
        this.timestamp = -1;
        this.el.emit('unstick-all', {});
      }
    }
  },

  onHit: function(evt) {
    var el = this.el;
    var stuckState = this.STUCK_STATE;
    var hitEl = evt.detail.body.el;
    // console.log("stuck state: " + this.STUCK_STATE);
    // console.log("stuck state?: " + stuckState);
    //Check list of els if objects is defined
    if(!this.sticky) return;
    if(hitEl.is(this.STUCK_STATE)) return;
    if(this.data.objects) {
      //this.els.forEach(checkStickable);
      var hitElClass = hitEl.getAttribute('class');
      if(hitElClass = this.data.objects) {
        if(!hitEl.is(this.STUCK_STATE) && !hitEl.is(this.UNSTUCK_STATE)) {
          hitEl.addState(this.STUCK_STATE);
          //probably can get away with emitting from hit element?
          this.el.emit('stick', {el: hitEl});
          //this.el.emit('unstick-all', {el: hitEl});
          //this.el.emit('unstick', {el: hitEl});
        }
      }
    } else {
      //If objects is not defined, just check if stuck
      if(!hitEl.is(this.STUCK_STATE) && !hitEl.is(this.UNSTUCK_STATE)) {
        hitEl.addState(this.STUCK_STATE);
        //probably can get away with emitting from hit element?
        this.el.emit('stick', {el: hitEl});
        //this.el.emit('unstick-all', {el: hitEl});
      }
    }
    //check if one of the
    // function checkStickable (element) {
    //   if(element === hitEl && !hitEl.is(this.STUCK_STATE)) {
    //     hitEl.addState(stuckState);
    //     el.emit('stick', {el: hitEl});
    //   }
    // }
  },

  onStick: function(evt) {
    var nextKey = this.nextKey;
    //element to be stuck
    const hitEl = evt.detail.el;
    //array of constraints
    //constraints = this.constraints;
    //console.log(this.constraints);
    //make new constraint var
    let constraint;
    constraint = new CANNON.LockConstraint(this.el.body, hitEl.body);
    //add constraint to array for tracking
    this.constraints[this.nextKey] = constraint;
    //add constraint to physics system
    this.system.addConstraint(this.constraints[(this.nextKey)]);
    //hitEl.setAttribute('sleepy', 'allowSleep: false; linearDamping: 0.0; angularDamping: 0.1');
    hitEl.setAttribute("id", this.nextKey);
    this.stuckEls[this.nextKey] = hitEl;
    //console.log(this);
    //this.el.emit('unstick', {el: hitEl});
    this.nextKey++;
    this.stuckNum++;
  },

  // onStick: function(evt) {
  //   const hitEl = evt.detail.el;
  //   var el = this.el;
  //   //hitEl.object3D.parent = el.object3D;
  //   hitEl.body.type = "static"
  // },

  onUnstick: function(evt) {
    const stuckEl = evt.detail.el;
    constraints = this.constraints;
    if(stuckEl) {
      var key = stuckEl.id;
      //console.log('removing ' + key + "!");
      if(this.constraints[key]) {
        this.system.removeConstraint(this.constraints[key]);
        delete constraints[key];
      } else {
        //do nothing
      }
      this.system.removeConstraint(this.constraints[key]);
      delete constraints[key];
      this.stuckEls[key] = null;
      this.stuckNum--;
      //stuckEl.setAttribute('sleepy', 'allowSleep: true; linearDamping: 0.1; angularDamping: 0.1');
      stuckEl.addState(this.UNSTUCK_STATE);
      stuckEl.removeState(this.STUCK_STATE);
      //this.el.object3D.remove(stuckEl.object3D);
    }
  },

  turnOnSticky: function() {
      this.sticky = true;
      el.removeEventListener('sticky-on', this.turnOnSticky);
      el.addEventListener('sticky-off', this.turnOffSticky);
  },

  turnOffSticky: function() {
      this.sticky = false;
      el.removeEventListener('sticky-off', this.turnOffSticky);
      el.addEventListener('sticky-on', this.turnOnSticky);

  },

  unstickAll: function(evt) {
    // stuckEls = this.stuckEls;
    // this.stuckEls.forEach(function(element) {
    //   this.el.emit('unstick', {el: element});
    // })
    //console.log("Stuck elements: ");
    // console.log(this);
    // console.log(this.stuckEls);
    var el = this.el;
    this.stuckEls.forEach(function(element) {
      el.emit('unstick', {el: element});
      //console.log("*****");
    });
  },

  makeSound: function() {
    // TODO
    return;
  },

});

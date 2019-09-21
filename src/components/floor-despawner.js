AFRAME.registerComponent('floor-despawner', {
  schema: {
    objects: {type: 'string', default: '.grabbable'},
    state_delays: {default: [], type: 'array'},
    default_delay: {type: 'number', default: 0},
    pooled_objects: {type: 'string', default: 'ramsclone'}
  },

  init: function() {

    this.entityTimestampPairs = [];
    this.DESPAWNING_STATE = 'waiting to despawn'
    //Bind Event Handlers
    this.onHit = this.onHit.bind(this);
    this.default_delay = this.data.default_delay;
    this.poolName = 'pool__' + this.data.pooled_objects;
    console.log('floor despawner active');
  },

  play: function() {
    var el = this.el;
    el.addEventListener('collide', this.onHit);
  },

  pause: function() {
    var el = this.el;
    el.removeEventListener('collide', this.onHit);
  },

  tick: function() {
    indexesToSplice = []
    currentTime = this.el.sceneEl.time;
    var el = this.el;
    var poolName = this.poolName;
    var entityTimestampPairs = this.entityTimestampPairs;
    var default_delay = this.default_delay;
    var DESPAWNING_STATE = this.DESPAWNING_STATE;
    this.entityTimestampPairs.forEach(function(etp, index) {
      if(etp.element.is('stuck') || currentTime - etp.timestamp > default_delay*1000) {
          indexesToSplice.push(index);
      }
    });
    entityTimestampPairs = this.entityTimestampPairs;
    indexesToSplice.forEach(function(i) {
      splicedPair = entityTimestampPairs.splice(i, 1)[0];
      splicedPair.element.removeState(DESPAWNING_STATE);
      if(splicedPair.element.is('stuck')) return;
      if(splicedPair.element.is('unstuck')) splicedPair.element.removeState('unstuck');
      el.pause;
      el.sceneEl.components[poolName].returnEntity(splicedPair.element);
    });

    //this.entityTimeStamps
  },

  onHit: function(evt) {
    console.log("Floor hit!");
    hitEl = evt.detail.body.el;
    //if(this.data.objects && this.data.objects == hitEl.getAttribute('class')) return;
    if(!hitEl.is(this.DESPAWNING_STATE)) {
      var timestamp = this.el.sceneEl.time;
      hitEl.addState(this.DESPAWNING_STATE);
      console.log(hitEl + " added to despawn queue!");
      this.entityTimestampPairs.push({ element: hitEl, timestamp: timestamp});
    }
    console.log(this.entityTimestampPairs);
  },

});

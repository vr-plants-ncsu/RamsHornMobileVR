AFRAME.registerComponent('floor-despawner', {
  schema: {
    objects: {type: 'string', default: ''},
    state_delays: {default: [], type: 'array'},
    default_delay: {type: 'number', default: 0},
    pooled_objects: {type: 'boolean', default: true}
  },

  init: function() {

    this.entityTimestampPairs = [];
    this.DESPAWNING_STATE = 'waiting to despawn'
    //Bind Event Handlers
    this.onHit = this.onHit.bind(this);
  },

  tick: function() {
    //for i = 0,
    //this.entityTimeStamps
  },

  onHit: function(evt) {
    hitEl = evt.detail.body.el;
    if(this.data.objects && this.data.objects != hitEl.getAttribute('class')) return;
    if(!hitEl.is(this.DESPAWNING_STATE)) {
      var timestamp = this.el.sceneEl.time;
      this.entityTimestampPairs.push({ element: hitEl, timestamp: timestamp});
    }
  },

});

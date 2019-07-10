/* global AFRAME RAMSHORN */
var PoolHelper = require('../lib/poolHelper.js');
RAMSHORN.SEEDPODS = {};

RAMSHORN.registerSeedPod = function(name, data, definition) {
  if (RAMSHORN.SEEDPODS[name]) {
    throw new Error('');
  }

  RAMSHORN.SEEDPODS[name] = {
    poolSize: data.poolSize,
    components: data.components,
    definition: definition
  };

  console.info('Seed pod registered ', name);
};
AFRAME.registerSystem('seedPod', {

  schema: {}
  init: function () {
    var self = this;
    this.poolHelper = new Poolhelper('seedPod', RAMSHORN.SEEDPODS, this.sceneEl);
    this.activeSeedPods = [];

    //game state junk
  },

  reset: function (entity) {
    var self = this;
    this.activeSeedPods.forEach(function (seedPod) {
      self.returnSeedPod(seedPod.getAttribute('seedPod').name, seedPod);
    });
  },

  returnSeedPod: function (name, entity) {
    this.activeSeedPods.splice(this.activeSeedPods.indexOf(entity), 1);
    this.poolHelper.returnEntity(name, entity);
  },

  getSeedPod: function (name) {
    var self = this;
    var bullet = this.poolHelper.requestEntity(name);
    this.activeSeedPods.push(seedPod);
    return seedPod;
  }
});

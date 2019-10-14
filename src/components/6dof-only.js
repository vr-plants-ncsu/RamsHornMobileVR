AFRAME.registerComponent('6dof-only', {
  schema: {
  },

  init: function() {
    var el = this.el;
    el.sceneEl.addEventListener('loaded', handleSceneLoaded);
    //el.sceneEl.addEventListener('exit-vr', handleEnterVR);
  },

  handleSceneLoaded: function(evt) {
    var el = this.el;
    if(!el.sceneEl.isMobile) {
      el.visible = true;
      el.play();
    } else {
      el.visible = false;
      el.pause();
    }
  },
});

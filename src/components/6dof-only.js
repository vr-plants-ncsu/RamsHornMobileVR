AFRAME.registerComponent('6dof-only', {
  schema: {
  },

  init: function() {
    var el = this.el;

    handleSceneLoaded = handleSceneLoaded.bind(this);
    handleEnterVR = handleEnterVR.bind(this);
    handleExitVR = handleExitVR.bind(this);

    el.sceneEl.addEventListener('loaded', handleSceneLoaded);


    function handleSceneLoaded (event) {
      console.log(this);
      if(!el.sceneEl.isMobile && el.sceneEl.is('vr-mode')) {
        this.el.object3D.visible = true;
        this.el.play();
        el.sceneEl.addEventListener('enter-vr', handleEnterVR);
        el.sceneEl.addEventListener('exit-vr', handleExitVR);
      } else {
        this.el.object3D.visible = false;
        this.el.pause();
      }
    }

    function handleEnterVR (event) {
      console.log(this);
      this.el.play();
      this.el.object3D.visible = true;
    }

    function handleExitVR (event) {
      console.log(this);
      this.el.object3D.visible = false;
      this.el.pause();
    }

    //el.sceneEl.addEventListener('exit-vr', handleEnterVR);
  },
});

AFRAME.registerComponent('6dof-only', {
  schema: {
  },

  init: function() {
    var el = this.el;
    var sceneEl = document.querySelector('a-scene');

    var handleSceneLoaded = handleSceneLoaded.bind(this);
    var handleEnterVR = handleEnterVR.bind(this);
    var handleExitVR = handleExitVR.bind(this);
    sceneEl.addEventListener('enter-vr', handleEnterVR);
    sceneEl.addEventListener('exit-vr', handleExitVR);

    el.sceneEl.addEventListener('loaded', handleSceneLoaded);


    function handleSceneLoaded (event) {
      console.log(this);
      console.log("Name: " + el.id + "Mobile: " + el.sceneEl.isMobile + ", VR-Mode: " + el.sceneEl.is('vr-mode'));
      if(!sceneEl.isMobile && sceneEl.is('vr-mode')) {
        this.el.object3D.visible = true;
        this.el.play();
      } else {
        this.el.object3D.visible = false;
        this.el.pause();
      }
    }

    function handleEnterVR (event) {
      this.el.play();
      this.el.object3D.visible = true;
      console.log("Entering VR... " + el.id + " should be visible now!");
    }

    function handleExitVR (event) {
      this.el.object3D.visible = false;
      console.log("Entering VR... " + el.id + " should not be visible now!");
      this.el.pause();
    }

    //el.sceneEl.addEventListener('exit-vr', handleEnterVR);
  },
});

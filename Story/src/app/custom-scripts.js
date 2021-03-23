define(["dojo/topic"], function(topic) {
  /*
   * Custom Javascript to be executed while the application is initializing goes here
   */

  // The application is ready
  topic.subscribe("tpl-ready", function(){

  /*
   * Set up a click handler on the feature of the map to navigate the story
   */

  //
  // *************************************
  // Configure the webmap id and layer id
  // *************************************
  //
  // First find the webmap id through the URL when you open the map in Map Viewer
  // To get the layer id, paste the webmap id below and open the application,
  //   then open the developer console, all the layers ids will be listed,
  //   find the correct one and paste it below
  // After this setup, clicking the 3rd feature of your layer, will navigate to the third entry
  var WEBMAP_ID = "f3ecaf4767b244489e7f46bbb8232fc9";
  var LAYER_ID = "csv_7673_0";

  var clickHandlerIsSetup = false;

  topic.subscribe("story-loaded-map", function(result){
    if ( result.id == WEBMAP_ID && ! clickHandlerIsSetup ) {
      var map = app.maps[result.id].response.map,
        layer = map.getLayer(LAYER_ID);

      console.log(map.graphicsLayerIds);

      if ( layer ) {
        layer.on("mouse-over", function(e){
          map.setMapCursor("pointer");
          map.infoWindow.setContent("<b>"+e.graphic.attributes.name.split(",")[0]+"</b><br/><i>Click to zoom</i>");
          map.infoWindow.show(e.graphic.geometry);
        });

        layer.on("mouse-out", function(e){
          map.setMapCursor("default");
          map.infoWindow.hide();
        });

        layer.on("click", function(e){
          var index = e.graphic.attributes["__OBJECTID"];

          // Temporarily prevent the new bullet to be focused
          app.isLoading = true;

          topic.publish("story-navigate-entry", index);

          // Set back isLoading
          setTimeout(function(){
            app.isLoading = false;
          }, 100);
        });
      }

      clickHandlerIsSetup = true;
    }
  });
});
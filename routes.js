module.exports = function(app) {

  app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
  });
  app.get('/lib/d3.min.js', function(req, res) {
    res.sendFile(__dirname + '/lib/d3.min.js');
  });
  app.get('/nn-visualisation.js', function(req, res) {
    res.sendFile(__dirname + '/public/nn-visualisation.js');
  });
  app.get('/nn-graphs.js', function(req, res) {
    res.sendFile(__dirname + '/public/nn-graphs.js');
  });

  // EditableGrid
  app.get('/inputdata-editablegrid.js', function(req, res) {
    res.sendFile(__dirname + '/public/inputdata-editablegrid.js');
  });
  app.get('/lib/editablegrid/editablegrid.js', function(req, res) {
    res.sendFile(__dirname + '/lib/editablegrid/editablegrid.js');
  });
  app.get('/lib/editablegrid/editablegrid_renderers.js', function(req, res) {
    res.sendFile(__dirname + '/lib/editablegrid/editablegrid_renderers.js');
  });
  app.get('/lib/editablegrid/editablegrid_editors.js', function(req, res) {
    res.sendFile(__dirname + '/lib/editablegrid/editablegrid_editors.js');
  });
  app.get('/lib/editablegrid/editablegrid_validators.js', function(req, res) {
    res.sendFile(__dirname + '/lib/editablegrid/editablegrid_validators.js');
  });
  app.get('/lib/editablegrid/editablegrid_utils.js', function(req, res) {
    res.sendFile(__dirname + '/lib/editablegrid/editablegrid_utils.js');
  });
  app.get('/assets/css/editablegrid.css', function(req, res) {
    res.sendFile(__dirname + '/public/assets/css/editablegrid.css');
  });

  app.get('/data/neuralnetwork.json', function(req, res) {
    res.sendFile(__dirname + '/data/neuralnetwork.json');
  });
  app.get('/assets/css/bootstrap.css', function(req, res) {
    res.sendFile(__dirname + '/public/assets/css/bootstrap.css');
  });
  app.get('/assets/js/bootstrap.min.js', function(req, res) {
    res.sendFile(__dirname + '/public/assets/js/bootstrap.min.js');
  });
  app.get('/assets/css/style.css', function(req, res) {
    res.sendFile(__dirname + '/public/assets/css/style.css');
  });
  app.get('/assets/css/style-responsive.css', function(req, res) {
    res.sendFile(__dirname + '/public/assets/css/style-responsive.css');
  });
  app.get('/assets/font-awesome/css/font-awesome.css', function(req, res) {
    res.sendFile(__dirname + '/public/assets/font-awesome/css/font-awesome.css');
  });
  app.get('/assets/js/common-scripts.js', function(req, res) {
    res.sendFile(__dirname + '/public/assets/js/common-scripts.js');
  });
  app.get('/assets/img/ajax-loader.gif', function(req, res) {
    res.sendFile(__dirname + '/public/assets/img/ajax-loader.gif');
  });

  // Extra
  app.get('/assets/font-awesome/fonts/fontawesome-webfont.ttf', function(req, res) {
    res.sendFile(__dirname + '/public/assets/font-awesome/fonts/fontawesome-webfont.ttf');
  });
  app.get('/assets/font-awesome/fonts/fontawesome-webfont.woff', function(req, res) {
    res.sendFile(__dirname + '/public/assets/font-awesome/fonts/fontawesome-webfont.woff');
  });

}

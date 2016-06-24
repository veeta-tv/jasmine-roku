jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

var Roku = require('roku');
var net = require('net');
var child_process = require('child_process');
var request = require('request');
var qs = require('querystring');
var ip = require('ip');
var fs = require('fs');

var location = process.env.ROKU_DEV_TARGET
var password = process.env.DEVPASSWORD
var device = new Roku('http://' + location + ':8060/');
var localWebServer = require('local-web-server')
var socket = null;
var listener = null;
var webServerLocation = ip.address();


Roku.prototype.launchWithArgs = function(args, fn) {
  var baseUrl = this.baseUrl;
  this.commandQueue.push(function(callback) {
    var url = baseUrl + 'launch/dev?' + qs.stringify(args);
    request.post(url, function(e, r, b) {
      callback(e)
      fn && fn(e)
    });
  }.bind(this));
};


describe("jasmine-test-channel", function() {

  function launchChannel() {
    console.log('Returning home');
    device.press(Roku.HOME);
    device.delay(1000);
    console.log('Launching channel');
    device.launchWithArgs({
      url: 'http://' + webServerLocation + ':8000/test'
    });
    device.delay(1000);
  }

  function launchWebService() {
    var port = 8000;
    var server_config = { 
      'verbose': true,
      'mocks': [
        {   
          'route': '/test',
          'response': {
            'body': "D397C652"
          }
        }
      ]   
    };
    console.log('Launching web server');
    return localWebServer(server_config).listen(port);
  }

  function keypressWithDelay(key) {
    device.press(key);
    device.delay(200);
  }

  function contraCode() {
    keys = [
      // press welcome screen log in 
      Roku.UP, Roku.UP,
      Roku.DOWN, Roku.DOWN,
      Roku.LEFT, Roku.RIGHT,
      Roku.LEFT, Roku.RIGHT,
      Roku.SELECT, Roku.PLAY
    ];
    keys.map(keypressDelay);
  }

  function installChannel(done) {
    url = 'http://' + location + '/plugin_install';
    params = {
      mySubmit: "Install",
      archive: fs.readFileSync('./spec/testchannel/jasmine-test-channel.zip'),
      passwd: ""
    };

    request.post({ url: url, form: params, auth: { user: 'rokudev', pass: password}}, function(error, response, body) {});
  }

  beforeAll(function(done) {
    console.log(">> Installing test channel");

    // Install the test target channel
    installChannel(done);

    // connect to telnet, consuming the backlog which is immediately written
    // to the client
    console.log(">> Connecting to debug log (telnet 8085)");
    socket = new net.Socket();

    socket.on('data', function(data) {
      // the telnet server writes the last n lines of log on connect. Ignore them here.
      console.log("ignoring " + data.length + " bytes");
    }); 

    socket.connect({ port: 8085, host: location });

    // allow for telnet connection and data reads to happen
    setTimeout(function() {
      socket.removeAllListeners('data');
      done();
    }, 2000);
  });

  afterAll(function() {
    // close the telnet session
    if (socket !== null) {
      socket.destroy();
    }
  });

  afterEach(function() {
    if (listener !== null) {
      listener.close();
      listener = null;
    }
    socket.removeAllListeners('data');
  });

  it("should request the given url and log the response", function(done) {
    listener = launchWebService();
    socket.on('data', function(data) {
      if (data.toString().match('RESP: D397C652') !== null) {
        done();
      }
    }); 
    launchChannel();
  });

});

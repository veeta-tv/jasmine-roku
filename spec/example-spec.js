jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

var RokuTest = require('/Users/christopherthompson/Documents/devel/veeta/roku-open-source/node-roku-test/roku-test');
var ip = require('ip');
var fs = require('fs');
var localWebServer = require('local-web-server')

var device = new RokuTest(process.env.ROKU_DEV_TARGET, process.env.DEVPASSWORD);
var socket = null;
var listener = null;
var webServerLocation = ip.address();
var testAppName = 'dev';  // this will be 'dev' for sideloaded channels
var channelZipFile = __dirname + '/testchannel/jasmine-test-channel.zip';

describe("jasmine-test-channel", function() {

  function launchChannel(args) {
    console.log('Returning home');
    device.press(RokuTest.HOME);
    device.delay(1000);
    console.log('Launching channel');
    device.launchWithArgs(testAppName, args);
    device.delay(1000);
  }

  function launchWebService() {
    var port = 8000;
    var server_config = { 
      'verbose': true,
      'log': {
        'format': 'dev'
      },
      'mocks': [
        // a test route that simply returns a unique string
        {   
          'route': '/test',
          'response': {
            'body': "D397C652"
          }
        },

        // a metadata response, similar to a real Roku metadata backend
        {
          'route': '/metadata',
          'response': {
            'body': JSON.stringify({   
              "stream": {
                "url": "http://" + webServerLocation + ":8000/content/birds_720_300k.mp4",
                "bitrate": 1328.0,
                "quality": true
              },
              "StreamFormat": "mp4",
              "Title": "Birds",
              "Description": "Birds Test Stream"
            }),
          }
        },
      ],

      // stream any content right from a local directory
      'rewrite': {
        'from': '/content/*',
        'to': '/spec/content/$1'
      }
    };
    console.log('Launching web server');
    return localWebServer(server_config).listen(port);
  }

  beforeAll(function(done) {
    console.log(">> Installing test channel");
    device.install(fs.createReadStream(channelZipFile));
    done();
  });

  afterAll(function() {
    device.destroyDebug();
  });

  afterEach(function() {
    // take care to clean up or you'll get EADDRINUSE
    if (listener !== null) {
      listener.close();
      listener = null;
    }
    // whether tests pass or fail, we don't want callbacks hanging around
    device.removeAllListeners('debugData');
    // exit the channel
    device.press(RokuTest.HOME);
  });

  ////////
  //
  // A contrived example test using a pre-canned channel.
  //
  it("should request the given url and log the response", function(done) {
    listener = launchWebService();
    device.on('debugData', function(data) {
      if (data.toString().match('RESP: D397C652') !== null) {
        done();
      }
    }); 
    launchChannel({ url: 'http://' + webServerLocation + ':8000/test' });
  });

  //////
  // Behave a little more like a channel, playing a movie served up locally
  //
  it("should request metadata and stream the content", function(done) {
    listener = launchWebService();
    device.on('debugData', function(data) {
      if (data.toString().match('VIDEO: DONE') !== null) {
        done();
      }
    });
    launchChannel({ metadata: 'http://' + webServerLocation + ':8000/metadata' });
  });

});

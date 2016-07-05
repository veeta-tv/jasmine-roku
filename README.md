# jasmine-roku
Example jasmine tests using node-roku-test for verifying Roku channel behavior


# Running tests

1. Clone this repo

        $ git clone https://github.com/cdthompson/jasmine-roku jasmine-roku
        $ cd jasmine-roku

2. Install dependencies

        $ npm install

3. Set Roku target

        $ export ROKU_DEV_TARGET=192.168.3.100
        $ export DEVPASSWORD=12345

4. Run the pre-canned tests (should work on all currently supported Roku devices)

        $ jasmine


# Applying to a channel

1. Copy package.json and spec/* to the existing channel directory
2. Set the channelZipFile to be tested.  By default this is a precanned channel but should be the output of the channel build.
3. Use launchWebService() as an example of a mocked CMS and its many failure modes (network errors, 500 responses)
4. Add logging to the channel code for key events like screen changes, video playback events, and network errors.
5. Create jasmine tests for scenarios you wish to test.




# License


All code distributed under [MIT]() license.

Includes *Wild water fowl* video from [93 films](http://93films.blogspot.com/) used under [Creative Commons Attribution 3.0 Unported License](https://creativecommons.org/licenses/by/3.0/).




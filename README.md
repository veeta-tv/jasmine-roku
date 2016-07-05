# jasmine-roku
Example jasmine tests using node-roku-test for verifying Roku channel behavior


# Running Examples

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


# Applying to an existing channel

1. Copy package.json and spec/* to the existing channel directory
2. Copy/Edit spec/example-spec.js to:
    a. Set channelZipFile as the right location for your channel zip file
    b. Set web server configuration to behave as you need
    c. Define jasmine tests for your channel



# License


All code distributed under [MIT]() license.

Includes *Wild water fowl* video from [93 films](http://93films.blogspot.com/) used under [Creative Commons Attribution 3.0 Unported License](https://creativecommons.org/licenses/by/3.0/).




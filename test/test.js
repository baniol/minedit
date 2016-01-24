'use strict';

var fs = require('fs');
var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var config = require('./test_config')
var Minedit = require('../lib/minedit');
var minedit = new Minedit(config);

describe('Schedule Tests', function () {

  describe('Saving schedule xml to a local file', function () {

    it('should return a successful persist message', function (done) {
      expect(minedit.config).to.have.property('mainTemplate', 'main.html')
      done();
    });
  });
});

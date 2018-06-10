/*jshint unused:false*/

/**
 * Test: Parser test cases
 */

// node modules
var should = require('should');

// lib modules
var parser = require('../lib/parsers/api_test_case');

describe('Parser: apiTestCase', function() {

    // TODO: Add 1.000 more possible cases ;-)
    var testCases = [
        {
            title: 'Given no test cases supplied then null is returned',
            content: {
                input: '',
            },

            expected: { testCase: null}
        },
        {
            title: 'Given a simple get request to a route with parameters then output is correct',
            content: {
                input: ' Id = 1 Description = \'Get request to some/route with valid params returns success response with correct data\' ' +
                '\nRequest GET \'some/route\' WITH { \'firstParam\' => \'firstParamValue\', \'secondParam\' => \'secondParamValue\' } ' +
                '\nResponse status = 200 json = {some: \'object\'}',
            },

            expected: {
                testCase: {
                    description: 'Get request to some\\route with valid params returns success response with correct data',
                    id: 'GET-some/route-1',
                    route: 'some/route',
                    method: 'GET',
                    params: {
                        firstParam: 'firstParamValue',
                        secondParam: 'secondParamValue'
                    },
                    expected: {
                        status: '200',
                        json: {some: 'object'},
                    }
                }
            }

        },
        {
            title: 'Given docs ask to use a previously supplied sample request and response then output is correct',
            content: {
                input: ' Id = 2 Description = \'Get request to some/route using sample\' ' +
                '\nRequest USE SAMPLE REQUEST ' +
                '\nExpectedResponse USE SUCCESS EXAMPLE'
            },

            expected: {
                testCase: {
                    description: 'Get request to some/route using sample',
                    id: 'GET-some/route-2',
                    route: 'some/route',
                    method: 'GET',
                    params: {
                        firstParam: 'firstParamValue',
                        secondParam: 'secondParamValue'
                    },
                    expected: {
                        status: '200',
                        json: {some: 'object'},
                    }
                }
            }

        },
        {
            title: 'Given docs supply a post request and a verify get request then output is correct',
            content: {
                input: ' Id = 1 Description = \'Post request to some route will give get response from some/route\' ' +
                '\nRequest POST \'some/route\' WITH { \'firstParam\' => \'firstParamValue\', \'secondParam\' => \'secondParamValue\' } ' +
                '\nResponse status = 200 json = null' +
                '\nVerify GET \'some/route\'  WITH { \'firstParam\' => \'firstParamValue\', \'secondParam\' => \'secondParamValue\' } ' +
                '\nExpectedVerifyResponse status = 200 json = {some: \'object\'}'
            },

            expected: {
                testCase: {
                    description: 'Post request to some route will give get response from some/route',
                    id: 'POST-some/route-1',
                    route: 'some/route',
                    method: 'POST',
                    params: {
                        firstParam: 'firstParamValue',
                        secondParam: 'secondParamValue'
                    },
                    expected: {
                        status: 200,
                        json: null,
                    },
                    verify: {
                        route: 'some/route',
                        method: 'POST',
                        params: {
                            firstParam: 'firstParamValue',
                            secondParam: 'secondParamValue'
                        },
                    },
                    expectedVerify: {
                        status: 200,
                        json: {some: 'object'},
                    }
                }
            }
        },
        {
            title: 'Given docs supply a post request and a supplies a test case id to use as verification it then output is correct',
            content: {
                input: ' Id = 2 Description = \'Post request to some route will give get response from some/route\' ' +
                '\nRequest POST \'some/route\' WITH { \'firstParam\' => \'firstParamValue\', \'secondParam\' => \'secondParamValue\' } ' +
                '\nExpectedResponse status = 200 json = null' +
                '\nVerify By TestCase GET-some/route-1'
            },

            expected: {
                testCase: {
                    description: 'Post request to some route will give get response from some/route',
                    id: 'POST-some/route-2',
                    route: 'some/route',
                    method: 'POST',
                    params: {
                        firstParam: 'firstParamValue',
                        secondParam: 'secondParamValue'
                    },
                    expected: {
                        status: 200,
                        json: null,
                    },
                    verify: {
                        id: 'GET-some/route-1',
                    },
                },
            }
        }
    ];

    // create
    it('Should parse test case content correctly', function(done) {
        testCases.forEach(function(testCase) {
            var parsed = parser.parse(testCase.content.input);
            (parsed !== null).should.equal(true, 'Title: ' + testCase.title + ', Source: ' + testCase.content.input);
            if(testCase.expected.testCase === null) {
                (parsed.testCase === null).should.be.true;
            } else {
                parsed.should.eql(testCase.expected);
            }
        });
        done();
    });

});

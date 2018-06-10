var trim     = require('../utils/trim');

/*
'Id = \'1\' Description = \'Get request to some/route with valid params returns success response with correct data\' ' +
'\nRequest GET \'some/route\' WITH { \'firstParam\' => \'firstParamValue\', \'secondParam\' => \'secondParamValue\' } ' +
'\nExpectedResponse status = 200 jsonResponse = \'{some: object}\''
*/

var XRegExp = require('xregexp');


function parse(content, source, defaultGroup) {

    var regex = '^\\s*(?:id)(?<equals>\\s*\\=\\s*)(?<id>[\\w]+)\\s+(?:desc(?:[ription]{7})?)\\k<equals>(?<description>(?<quotes>["\'])(?:(?=(\\\\?)).)*?\\k<quotes>)*(?<newline>\\s*\uFFFF\\s*)(?:\\s*request\\s*)(?<method>GET|POST|PUT|HEAD|DELETE|PATCH|OPTIONS){1}\\s*(?<route>\\k<quotes>(?:(?=(\\\\?)).)*?\\k<quotes>)\\s+(?<hasParams>(?:WITH\\s+){1}(?<params>\\{\\s*(?<keyValuePair>(?<key>\\k<quotes>*[\\w]+\\k<quotes>*)\\s*(?:\\=\\>|:|\\=)\\s*(?<value>\\k<quotes>*[\\w]+\\k<quotes>*)[\\s,]+)+\\}))*\\k<newline>(?:response\\s*)(?:status\\k<equals>)(?<statusCode>[1-5]{1}[\\d]{2})\\s*(?:json\\k<equals>)(?<json>\\{[\\w]+\\s*:\\s*[\\w,\\[\\]\\{\\},:\\s\'"]+\\}$)'
    var paramsRegex = '\{\s*(?<keyValuePair>(?<key>\k<quotes>*[\w]+\k<quotes>*)\s*(?:\=\>|:|\=)\s*(?<value>\k<quotes>*[\w]+\k<quotes>*)[\\s,]+)+\\}';
    var xRegex = XRegExp(regex, 'gmi');
    var xRegexParams = XRegExp(paramsRegex, 'gmi');
    content = trim(content);

    // replace Linebreak with Unicode
    content = content.replace(/\n/g, '\uFFFF');

    var matches = XRegExp.exec(content, xRegex);

    if ( ! matches)
        return {testCase: null};

    // reverse Unicode Linebreaks
    matches.forEach(function (val, index, array) {
        if (val) {
            array[index] = val.replace(/\uffff/g, '\n');
        }
    });

    //TODO
    if(matches.hasParams)
    {
        var paramsMatches = XRegExp.exec(matches.params, xRegexParams);
    }

    var id = matches.method.toUpperCase() + '-' + matches.route + '-' + matches.id;
    // Set global group variable

    var testCase = {
        description: matches.description,
        id: id,
        route: matches.route,
        method: matches.method,
        params: {
            firstParam: 'firstParamValue',
            secondParam: 'secondParamValue'
        },
        expected: {
            status: matches.status,
            json: null,
        }
        //    verify: {
        //    route: 'some/route',
        //    method: 'POST',
        //    params: {
        //        firstParam: 'firstParamValue',
        //        secondParam: 'secondParamValue'
        //    },
        //},
        //expectedVerify: {
        //    status: 200,
        //    jsonResponse: '{some: object}',
        //}
    };

}

/**
 * Exports
 */
module.exports = {
    parse : parse,
    path  : 'local.testCases',
    method: 'insert'
};
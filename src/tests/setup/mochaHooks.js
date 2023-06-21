const fs = require('fs')
const child_process = require('child_process')
const propertiesReader = require('properties-reader')
const axios = require("axios");
const failures = []
const successes = []




exports.mochaHooks = {
    beforeAll: async function () {
        process.env.NODE_NO_WARNINGS="1"

        //kubectl port-forward service/redis-commander 38080:80 -n develeforce-infra
    },
    beforeEach: function() {
        const title = this.currentTest.title;
        console.debug(`mocha parallel - test: ${title} running on process-id: ${process.pid}`)
    },
    afterEach: function () {
        const title = this.currentTest.title;
        const state = this.currentTest.state;
        if (state === 'passed') {
            successes.push(title)
        } else if (state === 'failed') {
            failures.push(title)
        }
    },
    afterAll: function () {
        let mochaFailureCount = 0, mochaSuccessCount = 0, mochaTotalTestCount = 0;

        if (fs.existsSync('./test-results.properties')) {
            const properties = propertiesReader('./test-results.properties');
            mochaFailureCount = (parseInt(properties.get('MOCHA_FAILURES_COUNT')) + failures.length).toString()
            mochaSuccessCount = (parseInt(properties.get('MOCHA_SUCCESS_COUNT')) + successes.length).toString()
            mochaTotalTestCount = (parseInt(properties.get('MOCHA_TOTAL_TEST_COUNT')) + (successes.length + failures.length)).toString()
        }else{

            mochaFailureCount = failures.length.toString()
            mochaSuccessCount = successes.length.toString()
            mochaTotalTestCount = (successes.length + failures.length).toString()
        }

        const fileContent =
            `MOCHA_FAILURES_COUNT=${mochaFailureCount}\n` +
            `MOCHA_SUCCESS_COUNT=${mochaSuccessCount}\n` +
            `MOCHA_TOTAL_TEST_COUNT=${mochaTotalTestCount}\n`

        try {
            fs.writeFileSync('./test-results.properties', fileContent, 'utf8')
        }catch(e){
            console.log("failed to write ./test-results.properties");
        }


        // process.exit(0)
    }
}

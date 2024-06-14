// dotenv
require('dotenv').config();


// fetch
const fetch = require('node-fetch');
const { getDate, getTCConfig } = require('./utils');
//testcollab-sdk
const { TestPlansApi, TestPlanTestCasesApi, TestPlansAssignmentApi } = require('testcollab-sdk');

let config = getTCConfig()

// init apis
const testPlansApi = new TestPlansApi(config);
const testPlanCases = new TestPlanTestCasesApi(config);
const testPlanAssignment = new TestPlansAssignmentApi(config);

// create a new test plan
const createTestPlan = async () => {
    // remove old test plan id file if exists
    require('fs').unlink('tmp/tc_test_plan', () => { });

    try {
        //const response = await testPlansApi.addTestPlan(testPlan);
        console.log('Step 1: Creating a new test plan...')

        const response = await testPlansApi.addTestPlan({
            testPlanPayload: {
                project: process.env.TESTCOLLAB_PROJECT_ID,
                title: 'CI Test: '+getDate(),
                description: 'This is a test plan created using the Node.js SDK',
                status: 1,
                priority: 1,
                testPlanFolder: null,
                customFields: []

            }
        });

        // get the test plan id
        const testPlanId = response.id;
        console.log('Test Plan ID: ' + testPlanId)

        // now we add some test cases to it
        console.log('Step 2: Adding test cases (matching ci tag) to the test plan...')

        const res2 = await testPlanCases.bulkAddTestPlanTestCases({
            testPlanTestCaseBulkAddPayload:
            {
                testplan: testPlanId,
                //testplan: 46044,
                "testCaseCollection": {
                    testCases: [],
                    selector: [
                        {
                            "field": "tags",
                            "operator": "jsonstring_2",
                            "value": "{\"filter\":[[" + process.env.TESTCOLLAB_CI_TAG_ID + "]],\"type\":\"equals\",\"filterType\":\"number\"}"
                        }
                    ]
                }
            }
        });
        //console.log(res2)

        console.log('Step 3: Assign the test plan to a user...')
        // assign the test plan to a user

        const res3 = await testPlanAssignment.assignTestPlan({
            project: process.env.TESTCOLLAB_PROJECT_ID,
            testplan: testPlanId,
            testPlanAssignmentPayload: {
                "executor": "me",
                "assignmentCriteria": "testCase",
                "assignmentMethod": "automatic",
                "assignment": {
                    "user": [2],
                    "testCases": {
                        "testCases": [],
                        "selector": []
                    },
                    "configuration": null
                },
                "project": process.env.TESTCOLLAB_PROJECT_ID,
                "testplan": testPlanId
            }
        })

        console.log(res3)

        // store test plan id in tmp/test_plan
        //console.log('Test Plan ID: ' + testPlanId)
        require('fs').writeFileSync('tmp/tc_test_plan', 'TESTCOLLAB_TEST_PLAN_ID='+testPlanId);

    } catch (error) {
        console.error(error);
    }
};

(async () => {

    // get cli argument
    //const args = process.argv.slice(2);


    await createTestPlan();
})();

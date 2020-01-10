#!/usr/bin/env node
const fs = require("fs");
const glob = require("glob");
const parser = require("junit-xml-parser").parser;

let output = "summary";
if (process.argv.length > 2) {
  output = process.argv[2];
}

let totalTests = 0;
let failedTests = 0;
let failedTestDetails = [];

glob("**/TEST*.xml", async function(err, files) {
  // console.dir(files);
  for (let index = 0; index < files.length; index++) {
    const junitresults = await parser.parse(fs.readFileSync(files[index]));
    //        console.dir(junitresults);
    totalTests += junitresults.suite.summary.tests;
    failedTests += junitresults.suite.summary.failures;
    if (junitresults.suite.summary.failures > 0) {
      for (let tindex = 0; tindex < junitresults.suite.tests.length; tindex++) {
        if (junitresults.suite.tests[tindex].failure != null) {
          failedTestDetails.push(
            junitresults.suite.name +
              "/" +
              junitresults.suite.tests[tindex].name
          );
        }
      }
    }
  }

  if (output === "text") {
    outputText();
  } else if (output === "summary") {
    outputSummary();
  } else {
    if (failedTests > 0) {
      console.log("Failing tests detected, so returning a non-zero exit code");
      process.exit(1);
    }
  }
});

function outputText() {
  console.log("### Test Failures:");
  if (failedTestDetails.length > 0) {
    for (let index = 0; index < failedTestDetails.length; index++) {
      console.log("- " + failedTestDetails[index]);
    }
  } else if (totalTests > 0) {
    console.log("No failing tests, awesome!");
  } else {
    console.log("No tests found.");
  }
}

function outputSummary() {
  console.log("### Testing Summary:");
  console.log(" ");
  console.log("- " + totalTests + " Total test(s)");
  console.log("- " + (totalTests - failedTests) + " Successful test(s)");
  console.log("- " + failedTests + " Failed test(s)");
}

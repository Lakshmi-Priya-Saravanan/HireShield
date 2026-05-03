// background.js - service worker
chrome.runtime.onInstalled.addListener(() => {
    console.log("HireShield Extension Installed.");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "analyzeJob") {
        // Send request to HireShield API Gateway
        fetch("http://localhost:4000/api/fraud/analyze/job", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                description: request.jobData.description,
                company_name: request.jobData.company,
            })
        })
        .then(response => response.json())
        .then(data => sendResponse({ result: data }))
        .catch(error => sendResponse({ error: "Failed to connect to HireShield API" }));
        
        return true; // Keep message channel open for async response
    }
});

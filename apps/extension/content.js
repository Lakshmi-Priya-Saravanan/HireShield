// content.js
function extractJobData() {
    let description = document.body.innerText; // Basic fallback
    let company = "Unknown";
    
    // Naive LinkedIn scraping
    if (window.location.hostname.includes("linkedin.com")) {
        const descElement = document.querySelector(".jobs-description__container");
        if (descElement) description = descElement.innerText;
        
        const companyElement = document.querySelector(".job-details-jobs-unified-top-card__company-name");
        if (companyElement) company = companyElement.innerText;
    }
    
    return { description, company };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "extract") {
        sendResponse(extractJobData());
    }
});

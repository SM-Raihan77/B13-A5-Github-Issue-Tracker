
let allIssues = [];

// Elements
const loader = document.getElementById("loading");
const container = document.getElementById("issueContainer");
const issueCount = document.getElementById("issueCount");
const modal = document.getElementById("issue_modal");
const modalContent = document.getElementById("modal-content");



// Loader Functions
function showLoader() {
    loader.classList.remove("hidden");
}

function hideLoader() {
    loader.classList.add("hidden");
}

// Step-1: Load Issues
async function loadIssues() {

    showLoader();


    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const data = await res.json();


    allIssues = data.data;

    // console.log("Data received:", allIssues);

    displayIssues(allIssues);

    hideLoader();
    // console.log("Issues loaded successfully");

}

// Step-2: Display Issues 
function displayIssues(issues) {

    container.innerHTML = "";
    issueCount.innerText = issues.length;

    issues.forEach(issue => {
        // create card element
        const card = document.createElement("div");



        // border color based on status
        const statusColor = issue.status === "open"
            ? "border-t-green-500 text-green-500"
            : "border-t-purple-400 text-purple-500";



        // base card styles
        card.className = `bg-white border-t-4 ${statusColor} rounded-2xl p-6 flex flex-col justify-between shadow-sm mx-auto mb-6 w-full max-w-md`;

        // priority styles
        const priority = issue.priority?.toLowerCase() || "low";
        const priorityStyles = {
            high: "bg-red-50 text-red-500 border-red-100",
            medium: "bg-yellow-50 text-yellow-600 border-yellow-100",
            low: "bg-green-50 text-green-500 border-green-100"
        };
        const priorityStyle = priorityStyles[priority] || priorityStyles.low;



        // adding content to card
        const issueId = issue.id;
        const authorName = issue.author;
        const date = issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : "No Date";
        const isBug = issue.labels && issue.labels.includes("bug");
        const isDocumentation = issue.labels && issue.labels.includes("documentation");
        // icon color based on status
        const statusIcon = issue.status === "open"
            ? "fa-circle-dot te-500"
            : "fa-circle-check text-purple-500";

        // card content

        card.innerHTML = `
            <div>
                <div class="flex justify-between mb-4">
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-circle-check ${statusIcon}"></i>
                        
                    </div>
                    <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase border ${priorityStyle}">
                        ${priority}
                    </span>
                </div>

                <div class="mb-4 text-center">

                <h3 class="text-lg font-bold mb-2 text-black">${issue.title}</h3>
                <p class="text-sm text-gray-500 mb-4">${issue.description}</p>
                </div>

        <p class="text-xs font-medium p-2 rounded mb-4 text-center 
    ${isBug
                ? 'text-red-600 bg-red-50'
                : isDocumentation
                    ? 'text-yellow-600 bg-yellow-50'
                    : 'text-green-600 bg-green-50'
            }">
    ${issue.labels}
</p>
            <div class="text-xs text-gray-400 border-t pt-3 text-center">
                <p>#${issueId} by ${authorName}</p>
                <p>${date}</p>
            </div>
        `;


        container.appendChild(card);

        // add event listener to open modal on click
        card.addEventListener("click", () => {
            openModal(issue);
        });

    });
}

function openModal(issue) {

    const date = issue.createdAt
        ? new Date(issue.createdAt).toLocaleDateString()
        : "No Date";

    const statusColor =
        issue.status === "open"
            ? "bg-green-100 text-green-600"
            : "bg-purple-100 text-purple-600";

    modalContent.innerHTML = `
        <h2 class="text-xl font-bold text-gray-800 mb-3">${issue.title}</h2>

        <div class="flex items-center gap-3 mb-4">
            <span class="px-3 py-1 text-xs rounded-full ${statusColor}">
                ${issue.status}
            </span>
            <span class="text-sm text-gray-400">
                Opened by ${issue.author} • ${date}
            </span>
        </div>

        <p class="text-gray-500 mb-6">
            ${issue.description}
        </p>

        <div class="flex gap-3 mb-6">
            <span class="px-3 py-1 text-xs bg-red-100 text-red-500 rounded">
                ${issue.labels}
            </span>
        </div>

        <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
                <p class="text-xs text-gray-400">Assignee</p>
                <p class="font-semibold text-gray-700">${issue.author}</p>
            </div>

            <div>
                <p class="text-xs text-gray-400">Priority</p>
                <p class="font-semibold text-red-500 uppercase">${issue.priority}</p>
            </div>
        </div>
    `;

    modal.showModal();
}




// Filter Issues
function filterIssues(status, btn) {

    document
        .querySelectorAll(".tab-btn")
        .forEach(b => b.classList.remove("active-tab"));

    btn.classList.add("active-tab");

    const filtered =
        status === "all"
            ? allIssues
            : allIssues.filter(issue => issue.status === status);

    displayIssues(filtered);
}


// Search Issues
function handleSearch(query) {

    const search = query.toLowerCase();

    const filtered = allIssues.filter(issue =>
        issue.title.toLowerCase().includes(search) ||
        issue.description.toLowerCase().includes(search)
    );

    displayIssues(filtered);
}



loadIssues();




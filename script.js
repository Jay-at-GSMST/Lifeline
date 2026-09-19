let resources = [];

const searchInput = document.querySelector("#searchInput");
const locationInput = document.querySelector("#locationInput");
const searchButton = document.querySelector("#searchButton");
const clearSearch = document.querySelector("#clearSearch");
const results = document.querySelector("#results");

const resourceInfo = document.querySelector("#resourceInfo");
const infoTitle = document.querySelector("#infoTitle");
const infoDescription = document.querySelector("#infoDescription");
const infoCategory = document.querySelector("#infoCategory");
const infoCost = document.querySelector("#infoCost");
const infoLocation = document.querySelector("#infoLocation");
const infoContact = document.querySelector("#infoContact");
const infoWebsite = document.querySelector("#infoWebsite");
const closeInfo = document.querySelector("#closeInfo");

const categoryButtons = document.querySelectorAll("[data-category]");
const showAll = document.querySelector("#showAll");

let selectedCategory = "all";

function displayResources(list){
    document.querySelectorAll(".resource-card").forEach(function(card){
        card.remove();
    });

    const oldMessage = document.querySelector("#noResults");

    if(oldMessage){
        oldMessage.remove();
    }

    if(list.length === 0){
        const message = document.createElement("p");

        message.id = "noResults";
        message.textContent = "No resources found. Try another search or clear the filters.";

        results.appendChild(message);
    }

    list.forEach(function(resource){
        const card = document.createElement("article");
        card.className = "resource-card";

        const title = document.createElement("h3");
        title.textContent = resource.title;

        const description = document.createElement("p");
        description.textContent = resource.description;

        const cost = document.createElement("p");
        cost.textContent = "Cost: " + resource.cost;

        const location = document.createElement("p");
        location.textContent = "Location: " + resource.location;

        const tags = document.createElement("div");
        tags.className = "resource-tags";

        resource.tags.forEach(function(tag){
            const tagElement = document.createElement("span");
            tagElement.className = "resource-tag";
            tagElement.textContent = tag;
            tags.appendChild(tagElement);
        });

        const learnButton = document.createElement("button");
        learnButton.className = "learn-more";
        learnButton.textContent = "LEARN MORE";

        learnButton.addEventListener("click",function(){
            showResourceInfo(resource);
        });

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(cost);
        card.appendChild(location);
        card.appendChild(tags);
        card.appendChild(learnButton);

        results.appendChild(card);
    });
}

function showResourceInfo(resource){
    infoTitle.textContent = resource.title;
    infoDescription.textContent = resource.description;
    infoCategory.textContent = resource.category;
    infoCost.textContent = resource.cost;
    infoLocation.textContent = resource.location;
    infoContact.textContent = resource.contact;

    if(resource.website){
        infoWebsite.href = resource.website;
        infoWebsite.textContent = "Visit website";
        infoWebsite.style.display = "inline";
    }else{
        infoWebsite.removeAttribute("href");
        infoWebsite.textContent = "Website not available";
    }

    resourceInfo.hidden = false;

    resourceInfo.scrollIntoView({
        behavior:"smooth",
        block:"start"
    });
}

function filterResources(){
    const search = searchInput.value.toLowerCase().trim();
    const location = locationInput.value.toLowerCase().trim();

    const filtered = resources.filter(function(resource){
        const searchableText = [
            resource.title,
            resource.description,
            resource.category,
            resource.location,
            resource.keywords.join(" ")
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(search);

        const matchesCategory =
            selectedCategory === "all" ||
            resource.category === selectedCategory;

        const matchesLocation =
            location === "" ||
            resource.location.toLowerCase().includes(location);

        return matchesSearch && matchesCategory && matchesLocation;
    });

    displayResources(filtered);
}

function resetCategoryButtons(){
    categoryButtons.forEach(function(button){
        button.classList.remove("selected");
    });
}

function selectCategory(category){
    selectedCategory = category;

    resetCategoryButtons();

    categoryButtons.forEach(function(button){
        if(button.dataset.category === category){
            button.classList.add("selected");
        }
    });

    filterResources();
}

searchButton.addEventListener("click",function(){
    filterResources();
});

searchInput.addEventListener("input",function(){
    filterResources();
});

locationInput.addEventListener("input",function(){
    filterResources();
});

categoryButtons.forEach(function(button){
    button.addEventListener("click",function(){
        selectCategory(button.dataset.category);
    });
});

showAll.addEventListener("click",function(){
    selectedCategory = "all";
    resetCategoryButtons();
    filterResources();
});

clearSearch.addEventListener("click",function(){
    searchInput.value = "";
    locationInput.value = "";
    selectedCategory = "all";

    resetCategoryButtons();

    resourceInfo.hidden = true;

    filterResources();
});

closeInfo.addEventListener("click",function(){
    resourceInfo.hidden = true;
});

fetch(".vscode/resources.json")
    .then(function(response){
        if(!response.ok){
            throw new Error("Could not load resources.json");
        }

        return response.json();
    })
    .then(function(data){
        resources = data;
        displayResources(resources);
    })
    .catch(function(error){
        console.error(error);

        results.innerHTML = `
            <h2>AVAILABLE RESOURCES</h2>
            <p id="noResults">Resources could not be loaded. Please try again later.</p>
        `;
    });
/* let's go! */
const githubUserHandle = document.getElementById("github-user-handle");
const githubUserLink = document.getElementById("github-user-link");
const githubUserAvatar = document.getElementById("github-user-avatar");
const githubUserRepos = document.getElementById("github-user-repos");
const githubReposLanguages = document.getElementById("github-repos-languages");
const githubReposStars = document.getElementById("github-repos-stars");
const githubRepoName = document.getElementById("github-repo-name");
const githubRepoLink = document.getElementById("github-repo-link");
const githubRepoCreated = document.getElementById("github-repo-created");
const githubRepoOpen = document.getElementById("github-repo-open-issues");
const githubRepoWatchers = document.getElementById("github-repo-watchers");
const githubRepoContributors = document.getElementById("github-repo-contributors");
const inputUserNameGithub = document.getElementById("user-name-github");

let userNameGithub = "AhmedQeshta";



// -------------- *** 🙉  Fetch Data function 🙉 *** ----------------------

const addListener = (selector, eventName, callback) => {
    document.querySelector(selector).addEventListener(eventName, callback);
};

function fetchData(method, url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(null, xhr.responseText);
        } else {
            let errorMessage = xhr.responseText;
            callback(`Error ${url}`, errorMessage);
        }
    };
    xhr.open(method, url, true);
    xhr.send();
}

// -------------------- *** 🙉 Start  helper functions 🙉 *** ----------------------

// -------------------------- get Languages functions  ---------------
const getProgramingLanguages = (arrayOfLanguage) => {
    return arrayOfLanguage
        .map((element) => element.language)
        .reduce((a, b) => {
            return a.concat(!!b && a.indexOf(b) < 0 ? [b] : []);
        }, []);
};

// -------------------------- get count Stars functions  ---------------
const countStars = (arrayOfStars) => {
    return arrayOfStars.reduce((a, b) => {
        return a + b.stargazers_count;
    }, 0);
};

// -------------------------- get Username functions  ---------------
function getUsername(user) {
    return user.login;
}

// -------------------- *** 😉🙋🏻‍♀️ End  helper functions 🙋🏻‍♂️ *** ----------------------



// -------------------- *** 🙉 render Result Dom 🙉 *** ----------------------
const renderResultDom = (responseObject) => {
    githubUserHandle.textContent = responseObject.userDetails.name;
    githubUserLink.href = `https://github.com/${responseObject.userDetails.name}`;
    githubUserAvatar.src = responseObject.userDetails.img;
    githubUserRepos.textContent = responseObject.userDetails.repos;
    githubReposLanguages.textContent =
        responseObject.userDetails.languages.join(", ");
    githubReposStars.textContent = responseObject.userDetails.stars;
    githubRepoName.textContent = responseObject.firstRepo.name;
    githubRepoLink.href = responseObject.firstRepo.url;
    githubRepoCreated.textContent = responseObject.firstRepo.created;
    githubRepoOpen.textContent = responseObject.firstRepo.issues;
    githubRepoWatchers.textContent = responseObject.firstRepo.watchers;
    githubRepoContributors.textContent =
        responseObject.firstRepo.contributors.join(", ");
    return;
};

// -------------- *** 🙉 Function For handle To Dom functions | success handlers 🙉 *** ---------------------

const handelResponseUserDetails = (responseAsJSONString) => {
    let response = JSON.parse(responseAsJSONString);
    console.log(response);

    return {
        userDetails: {
            name: response[0].owner.login,
            img: response[0].owner.avatar_url,
            repos: response.length,
            languages: getProgramingLanguages(response), //I Get this method form Stack over Flow
            stars: countStars(response), //I Get this method form Stack over Flow
        },
        firstRepo: {
            name: response[0].name,
            url: response[0].html_url,
            created: response[0].created_at.substr(0, 10),
            issues: response[0].open_issues,
            watchers: response[0].watchers,
            contributors_url: response[0].contributors_url,
            contributors: [],
        },
    };
};

const handelResponseContributorDetails = (
    responseObject,
    responseAsJSONString,
) => {
    let response = JSON.parse(responseAsJSONString);
    let contributors = response.map(getUsername);
    let firstRepo = Object.assign({}, responseObject.firstRepo, {
        contributors: contributors,
    });
    return Object.assign({}, responseObject, { firstRepo: firstRepo });
};

const getContributors = (details) => {
    let url = details.firstRepo.contributors_url;
    let method = "GET";
    fetchData(method, url, (error, response) => {
        if (error) {
            return;
        }
        renderResultDom(handelResponseContributorDetails(details, response));
        return;
    });
};

const getUserRepoDetails = (userNameGithub) => {
    let URL = `https://api.github.com/users/${userNameGithub}/repos`;
    let method = "GET";
    fetchData(method, URL, (error, response) => {
        if (error) {
            // console.log("Sorry! 😭", error);
            return;
        }
        getContributors(handelResponseUserDetails(response));
        return;
    });
};

getUserRepoDetails(userNameGithub);

addListener(".user-name-github", "keyup", () => {
    setTimeout(() => {
        getUserRepoDetails(inputUserNameGithub.value);
    },1500);
});

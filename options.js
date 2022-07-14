async function handleLogin() {
    var myHeaders = new Headers();
    myHeaders.append("X-API-KEY", (await chrome.storage.sync.get('apiKey')).apiKey);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log(username + " wants to login");
    let url = (await chrome.storage.sync.get('publicURL')).publicURL + username + '.json';
    try {
        let r = await (await fetch(url, requestOptions)).json();
        if (r.master_password === password) {
            document.getElementById('result').textContent = "login successful";
            chrome.storage.sync.set({username});
            chrome.storage.sync.set({password});
        } else
            document.getElementById('result').textContent = "incorrect password";
    } catch (e) {
        console.log(e);
        myHeaders.append("Content-Type", "application/json");
        let raw = JSON.stringify({"master_password": password});
        requestOptions.method = 'PUT';
        requestOptions.body = raw;
        await fetch(url, requestOptions);
        document.getElementById('result').textContent = "user created";
        chrome.storage.sync.set({username});
        chrome.storage.sync.set({password});
    }
}

async function handleAddPassword() {
    let username;
    let password;
    try {
        username = (await chrome.storage.sync.get('username')).username
        password = (await chrome.storage.sync.get('password')).password
    } catch {
        document.getElementById('result').textContent = "please login first";
        return
    }

    var myHeaders = new Headers();
    myHeaders.append("X-API-KEY", (await chrome.storage.sync.get('apiKey')).apiKey);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    let url = (await chrome.storage.sync.get('publicURL')).publicURL + username + '.json';
    let r = await (await fetch(url, requestOptions)).json();

    const website = document.getElementById('website').value;
    const website_username = document.getElementById('username').value;
    const website_password = document.getElementById('password').value;
    r[website] = [website_username, website_password]
    myHeaders.append("Content-Type", "application/json");
    let raw = JSON.stringify(r);
    requestOptions.method = 'PUT';
    requestOptions.body = raw;
    await fetch(url, requestOptions);
    document.getElementById('result').textContent = "new password added";
}


document.getElementById("login").addEventListener("click", handleLogin)
document.getElementById("add_pass").addEventListener("click", handleAddPassword)

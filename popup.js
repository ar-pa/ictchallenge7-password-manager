async function test() {
    let table = document.getElementById("passwords");
    var myHeaders = new Headers();


    myHeaders.append("X-API-KEY", (await chrome.storage.sync.get('apiKey')).apiKey);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    let url = (await chrome.storage.sync.get('publicURL')).publicURL +
        (await chrome.storage.sync.get('username')).username + '.json';
    let r = await (await fetch(url, requestOptions)).json();

    for (let x in r)
        if (x !== 'master_password') {
            const row = table.insertRow()
            row.insertCell().innerHTML = x
            row.insertCell().innerHTML = r[x][0]
            row.insertCell().innerHTML = r[x][1]
        }
}

test()
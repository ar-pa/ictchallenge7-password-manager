/**
 * Updates the passwords for the current user.
 * @param passwords dictionary of passwords
 * @returns {Promise<void>}
 */
async function updatePasswords(passwords) {
    let username;
    let password;
    try {
        username = (await chrome.storage.sync.get('username')).username
        password = (await chrome.storage.sync.get('password')).password
    } catch {
        throw "Login first";
    }

    console.log(passwords)

    passwords['master_password'] = CryptoJS.SHA256(password).toString();
    for (let x in passwords)
        passwords[x][1] = CryptoJS.AES.encrypt(passwords[x][1], password).toString();

    const myHeaders = new Headers();
    myHeaders.append("X-API-KEY", (await chrome.storage.sync.get('apiKey')).apiKey);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: JSON.stringify(passwords),
        redirect: 'follow'
    };
    const url = (await chrome.storage.sync.get('publicURL')).publicURL + username + '.json';
    await fetch(url, requestOptions);
}

/**
 * Checks if user is available and password is correct, then returns the decrypted password list of the user.
 * @throws "Login first" if user is not logged in
 * @throws "No such user" if user is not found
 * @throws "Wrong password"
 * @returns {Promise<*>}
 */
async function getPasswords() {
    let username, password;
    try {
        username = (await chrome.storage.sync.get('username')).username;
        password = (await chrome.storage.sync.get('password')).password;
    } catch {
        throw "Login first";
    }

    const myHeaders = new Headers();
    myHeaders.append("X-API-KEY", (await chrome.storage.sync.get('apiKey')).apiKey);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    let r;
    try {
        const url = (await chrome.storage.sync.get('publicURL')).publicURL + username + '.json';
        r = await (await fetch(url, requestOptions)).json();
    } catch {
        throw "No such user";
    }

    if (r.master_password === CryptoJS.SHA256(password).toString()) {
        delete r['master_password'];
        for (let x in r)
            r[x][1] = CryptoJS.AES.decrypt(r[x][1], password).toString(CryptoJS.enc.Utf8);
        return r;
    } else
        throw "Wrong password";
}

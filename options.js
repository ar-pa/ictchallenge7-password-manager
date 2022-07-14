async function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    chrome.storage.sync.set({username});
    chrome.storage.sync.set({password});
    console.log(username + " wants to login");
    try {
        await getPasswords()
        document.getElementById('result').textContent = "login successful";
    } catch (e) {
        console.log(e);
        if (e === "Wrong password")
            document.getElementById('result').textContent = "incorrect password";
        else if (e === "No such user") {
            await updatePasswords({});
            document.getElementById('result').textContent = "user created";
        }
    }
}

async function handleAddPassword() {
    let passwords;
    try {
        passwords = await getPasswords();
    } catch (e) {
        if (e === "Login first")
            document.getElementById('result').textContent = "please login first";
        return
    }

    const website = document.getElementById('website').value;
    const website_username = document.getElementById('username').value;
    const website_password = document.getElementById('password').value;

    passwords[website] = [website_username, website_password];
    await updatePasswords(passwords);
    document.getElementById('result').textContent = "new password added";
}


document.getElementById("login").addEventListener("click", handleLogin)
document.getElementById("add_pass").addEventListener("click", handleAddPassword)

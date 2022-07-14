async function create_table() {
    const table = document.getElementById("passwords");
    let r;
    try {
        r = await getPasswords()
    } catch (e) {
        console.log(e);
        if (e === "Login First")
            table.insertRow().insertCell().innerHTML = "Something goes wrong. Did you login?";
    }

    for (const x in r) {
        const row = table.insertRow()
        row.insertCell().innerHTML = x
        row.insertCell().innerHTML = r[x][0]
        row.insertCell().innerHTML = r[x][1]
    }
}

create_table()
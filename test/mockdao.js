const users = {
    1: {
        id: 1,
        name: 'UserA',
    },
    2: {
        id: 2,
        name: 'UserB'
    }
}
const emailAddresses = {
    1: {
        address: 'usera@example.com'
    }
}

export function retrieveUsers() {
    for (let user of Object.values(users)) {
        console.log(user);
    }
}


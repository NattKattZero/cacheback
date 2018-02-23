import { DAO } from '../src/js/cache';

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

export class StubDAO extends DAO {
    constructor(t) {
        super();
        this.t = t;
    }

    retrieveItems() {
        this.t.end();
    }

    createItem(item) {
        this.t.end();
    }
    updateItem(item) {
        this.t.end();
    }

    deleteItem(item) {
        this.t.end();
    }
}

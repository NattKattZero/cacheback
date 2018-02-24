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
        this.t.pass('retrieveItems was called');
    }

    createItem(item) {
        this.t.pass('createItem was called');
    }
    updateItem(item) {
        this.t.pass('updateItem was called');
    }

    deleteItem(item) {
        this.t.pass('deleteItem was called');
    }
}

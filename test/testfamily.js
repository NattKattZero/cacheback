import { test } from 'tape';
import { Family } from '../src/js/family';

test('Family.describe', t => {
  const family = new Family();
  family.describe('person', 'id');
  const kinds = family.getKinds();
  t.equal(kinds.size, 1, 'kinds should have 1 item');
  t.equal(kinds.get('person').pk, 'id', 'pk for person kind should be id');
  const personKind = family.getKind('person');
  t.ok(personKind, 'person kind is returned');
  t.equal(personKind.pk, 'id', "person kind's pk is id");
  t.end();
});

test('Family.relate', t => {
  const family = new Family();
  family.describe('person', 'id');
  family.describe('phoneNumber', 'number');
  const person = { id: 1, name: 'superfly' };
  const phoneNumber = { number: '867-5309' };
  family.relate('person', person, 'phoneNumber', phoneNumber);
  const phoneNumbers = family.getRelated('person', person, 'phoneNumber');
  t.ok(phoneNumbers);
  t.equal(phoneNumbers.length, 1, 'phoneNumbers should contain one item');
  t.equal(phoneNumbers[0], '867-5309', 'phone number should be 867-5309');
  t.end();
});

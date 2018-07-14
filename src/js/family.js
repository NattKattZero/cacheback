export class Family {
  constructor() {
    this.kinds = new Map();
    this.relationships = new Map();
  }

  describe(kind, pk) {
    this.kinds.set(kind, { pk });
  }

  getKinds() {
    return this.kinds;
  }

  getKind(kind) {
    return this.kinds.get(kind);
  }

  relate(kind1, item1, kind2, item2) {
    const kind1Desc = this.kinds.get(kind1);
    const kind2Desc = this.kinds.get(kind2);
    if (!this.relationships.has(`${kind1}:${kind2}`)) {
      this.relationships.set(`${kind1}:${kind2}`, new Map());
    }
    if (!this.relationships.has(`${kind2}:${kind1}`)) {
      this.relationships.set(`${kind2}:${kind1}`, new Map());
    }
    const kind1ToKind2Rel = this.relationships.get(`${kind1}:${kind2}`);
    const kind2ToKind1Rel = this.relationships.get(`${kind2}:${kind1}`);
    const pk1 = item1[kind1Desc.pk];
    const pk2 = item2[kind2Desc.pk];
    if (!kind1ToKind2Rel.has(pk1)) {
      kind1ToKind2Rel.set(pk1, []);
    }
    if (!kind2ToKind1Rel.has(pk2)) {
      kind2ToKind1Rel.set(pk2, []);
    }
    kind1ToKind2Rel.set(pk1, [...kind1ToKind2Rel.get(pk1), pk2]);
    kind2ToKind1Rel.set(pk2, [...kind2ToKind1Rel.get(pk2), pk1]);
  }

  getRelated(kind1, item1, kind2) {
    const kind1Desc = this.kinds.get(kind1);
    const kind1ToKind2Rel = this.relationships.get(`${kind1}:${kind2}`);
    return kind1ToKind2Rel.get(item1[kind1Desc.pk]);
  }
}

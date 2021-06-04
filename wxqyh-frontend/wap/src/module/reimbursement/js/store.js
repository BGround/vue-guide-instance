
let store = {
  storage: window.localStorage,
  session: {
    storage: window.sessionStorage,
  }
};

const api = {
  get(key) {
    return deserialize(this.storage.getItem(key));
  },
  set(key, val) {
    this.storage.setItem(key, serialize(val));
    return val;
  },
  remove(key) {
    this.storage.removeItem(key);
  },
  clear() {
    this.storage.clear();
  },
  getAll() {
    let ret = {};

    for (let i = 0; i < this.storage.length; i++) {
      let key = this.storage.key(i);
      let val = this.get(key);
      ret[key] = val;
    }
    return ret;
  }
}

function serialize(val) {
  return JSON.stringify(val);
}

function deserialize(val) {
  if (typeof val !== 'string') {
    return undefined;
  }

  try {
    return JSON.parse(val);
  } catch (e) {
    return val || undefined;
  }
}

Object.assign(store, api);
Object.assign(store.session, api);

export default store;

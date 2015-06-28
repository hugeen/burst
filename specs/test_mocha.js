
import assert from "assert"
import {on} from '../lib/core/event' // importing a module

describe('something', () => { // using the arrow function
  it('that should work', () => {
    assert.equal(-1, [1,2,3].indexOf(5));
  });
});

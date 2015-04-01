import * as events from './events';
import * as utils from './utils';
import * as traversing from './traversing';

var glowingDom = {};
Object.assign(glowingDom, events, utils, traversing);

console.log(glowingDom);
export default glowingDom;

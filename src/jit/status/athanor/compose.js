import './athanor.js';
import {hermeticon} from '../arcana/hermeticon.js';
import {populateStatus} from '../arcana/status.js';
populateStatus(hermeticon);
globalThis.Athanor.mount('hermeticon',hermeticon);
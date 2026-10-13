import './athanor.js';
import {hermeticon} from '../arcana/hermeticon.js';
import {mountLinkedInBoards} from '../arcana/linkedin-boards.js';
mountLinkedInBoards(hermeticon);
globalThis.Athanor.mount('hermeticon',hermeticon);

import App from './App.svelte';
import EventParser from './parse/EventParser';

import { sqlExecutions } from './stores.js';

declare var providedEvents: object[];

const parser = new EventParser();
providedEvents.forEach((event) => parser.parse(event));
// providedEvents.forEach((event) => parser.parse(event));
// providedEvents.forEach((event) => parser.parse(event));
sqlExecutions.set(parser.sqlExecutions);

const app = new App({
    target: document.body,
    props: {},
});

export default app;

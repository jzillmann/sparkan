import { writable } from 'svelte/store';
import type SqlExecution from './parse/SqlExecution';

export const sqlExecutions = writable(new Array<SqlExecution>());

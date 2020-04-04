// If we can't guarantee global state, don't fake it: fail instead.
let globalEnv: typeof window | typeof self | typeof global;
// Use window (web)/self (web worker)/global (node) as appropriate
if (typeof window !== 'undefined') {
	globalEnv = window;
} else if (typeof self !== 'undefined') {
	globalEnv = self;
} else if (typeof global !== 'undefined') {
	globalEnv = global;
} else {
	throw new Error('Could not get global env');
}

export { globalEnv };

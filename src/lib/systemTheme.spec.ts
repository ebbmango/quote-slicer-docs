import { describe, expect, it } from 'vitest';
import {
	deriveManualModeFromUserChoice,
	normalizeManualMode,
	resolveEffectiveMode
} from './systemTheme';

type Mode = 'dark' | 'light';
type State = {
	systemMode: Mode;
	manualMode: Mode | null;
};

function current(state: State): Mode {
	return resolveEffectiveMode(state.systemMode, state.manualMode);
}

function setWebsiteTheme(state: State, mode: Mode): void {
	state.manualMode = deriveManualModeFromUserChoice(state.systemMode, mode);
}

function osChange(state: State, nextSystemMode: Mode): void {
	state.systemMode = nextSystemMode;
	state.manualMode = normalizeManualMode(state.systemMode, state.manualMode);
}

describe('adaptive theme state transitions', () => {
	it('A) system dark + website dark follows OS dark -> light', () => {
		const state: State = { systemMode: 'dark', manualMode: null };
		expect(current(state)).toBe('dark');

		osChange(state, 'light');

		expect(current(state)).toBe('light');
		expect(state.manualMode).toBeNull();
	});

	it('B) user-set light on dark system stays light when OS dark -> light', () => {
		const state: State = { systemMode: 'dark', manualMode: null };

		setWebsiteTheme(state, 'light');
		expect(current(state)).toBe('light');
		expect(state.manualMode).toBe('light');

		osChange(state, 'light');

		expect(current(state)).toBe('light');
		expect(state.manualMode).toBeNull();
	});

	it('C) user-set dark on light system stays dark when OS light -> dark', () => {
		const state: State = { systemMode: 'light', manualMode: null };

		setWebsiteTheme(state, 'dark');
		expect(current(state)).toBe('dark');
		expect(state.manualMode).toBe('dark');

		osChange(state, 'dark');

		expect(current(state)).toBe('dark');
		expect(state.manualMode).toBeNull();
	});

	it('D) system light + website light follows OS light -> dark', () => {
		const state: State = { systemMode: 'light', manualMode: null };
		expect(current(state)).toBe('light');

		osChange(state, 'dark');

		expect(current(state)).toBe('dark');
		expect(state.manualMode).toBeNull();
	});
});

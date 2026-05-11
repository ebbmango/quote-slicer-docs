import { describe, expect, it } from 'vitest';
import {
	RELOAD_GRACE_MS,
	STALE_TAB_MS,
	createSystemState,
	createUserState,
	parseTabRegistry,
	parseThemeState,
	resolveStoredTheme,
	type StoredTabRegistry
} from './themeState';

const NOW = 1_000_000;
const TAB_ID = 'test-tab';

function activeRegistry(): StoredTabRegistry {
	return {
		version: 1,
		tabs: {
			'active-tab': { seenAt: NOW - 1_000 }
		}
	};
}

describe('theme state resolution', () => {
	it('uses the current system mode when storage is empty', () => {
		expect.assertions(4);

		const result = resolveStoredTheme({
			currentSystemMode: 'dark',
			now: NOW,
			isReload: false,
			storedState: null,
			storedRegistry: null,
			writerTabId: TAB_ID
		});

		expect(result.mode).toBe('dark');
		expect(result.state).toEqual(createSystemState('dark', NOW, TAB_ID));
		expect(result.shouldWriteState).toBe(false);
		expect(result.shouldRemoveState).toBe(false);
	});

	it('uses a stored manual theme while active tabs exist', () => {
		expect.assertions(3);

		const storedState = createUserState('light', 'dark', NOW - 10_000, 'other-tab');
		const result = resolveStoredTheme({
			currentSystemMode: 'dark',
			now: NOW,
			isReload: false,
			storedState,
			storedRegistry: activeRegistry(),
			writerTabId: TAB_ID
		});

		expect(result.mode).toBe('light');
		expect(result.state).toBe(storedState);
		expect(result.hasContinuity).toBe(true);
	});

	it('lets the current system mode win when stored system mode is stale', () => {
		expect.assertions(4);

		const storedState = createUserState('light', 'light', NOW - 10_000, 'other-tab');
		const result = resolveStoredTheme({
			currentSystemMode: 'dark',
			now: NOW,
			isReload: false,
			storedState,
			storedRegistry: activeRegistry(),
			writerTabId: TAB_ID
		});

		expect(result.mode).toBe('dark');
		expect(result.state).toEqual(createSystemState('dark', NOW, TAB_ID));
		expect(result.shouldWriteState).toBe(true);
		expect(result.shouldRemoveState).toBe(false);
	});

	it('resets to the system mode when no active tabs remain on a normal navigation', () => {
		expect.assertions(4);

		const storedState = createUserState('dark', 'light', NOW - 10_000, 'closed-tab');
		const result = resolveStoredTheme({
			currentSystemMode: 'light',
			now: NOW,
			isReload: false,
			storedState,
			storedRegistry: { version: 1, tabs: {}, lastEmptyAt: NOW - 1_000 },
			writerTabId: TAB_ID
		});

		expect(result.mode).toBe('light');
		expect(result.hasContinuity).toBe(false);
		expect(result.shouldWriteState).toBe(false);
		expect(result.shouldRemoveState).toBe(true);
	});

	it('preserves stored state during a recent reload after the last tab unloaded', () => {
		expect.assertions(3);

		const storedState = createUserState('dark', 'light', NOW - 10_000, 'reloading-tab');
		const result = resolveStoredTheme({
			currentSystemMode: 'light',
			now: NOW,
			isReload: true,
			storedState,
			storedRegistry: { version: 1, tabs: {}, lastEmptyAt: NOW - RELOAD_GRACE_MS + 1 },
			writerTabId: TAB_ID
		});

		expect(result.mode).toBe('dark');
		expect(result.state).toBe(storedState);
		expect(result.hasContinuity).toBe(true);
	});

	it('does not preserve stored state after the reload grace window expires', () => {
		expect.assertions(3);

		const storedState = createUserState('dark', 'light', NOW - 10_000, 'old-tab');
		const result = resolveStoredTheme({
			currentSystemMode: 'light',
			now: NOW,
			isReload: true,
			storedState,
			storedRegistry: { version: 1, tabs: {}, lastEmptyAt: NOW - RELOAD_GRACE_MS - 1 },
			writerTabId: TAB_ID
		});

		expect(result.mode).toBe('light');
		expect(result.hasContinuity).toBe(false);
		expect(result.shouldRemoveState).toBe(true);
	});

	it('treats corrupt stored values as absent and uses the current system mode', () => {
		expect.assertions(3);

		const result = resolveStoredTheme({
			currentSystemMode: 'dark',
			now: NOW,
			isReload: false,
			storedState: parseThemeState('{"version":1,"mode":"dark"'),
			storedRegistry: parseTabRegistry('{"version":1,"tabs":'),
			writerTabId: TAB_ID
		});

		expect(result.mode).toBe('dark');
		expect(result.state).toEqual(createSystemState('dark', NOW, TAB_ID));
		expect(result.shouldRemoveState).toBe(false);
	});

	it('prunes stale tab records before deciding whether storage has continuity', () => {
		expect.assertions(5);

		const storedState = createUserState('dark', 'light', NOW - 10_000, 'stale-tab');
		const result = resolveStoredTheme({
			currentSystemMode: 'light',
			now: NOW,
			isReload: false,
			storedState,
			storedRegistry: {
				version: 1,
				tabs: {
					'stale-tab': { seenAt: NOW - STALE_TAB_MS - 1 }
				}
			},
			writerTabId: TAB_ID
		});

		expect(result.mode).toBe('light');
		expect(result.hasContinuity).toBe(false);
		expect(result.shouldRemoveState).toBe(true);
		expect(result.shouldWriteRegistry).toBe(true);
		expect(result.registry.lastEmptyAt).toBe(NOW);
	});

	it('lets later sleeping tabs adopt the first tab’s system reconciliation', () => {
		expect.assertions(3);

		const reconciledState = createSystemState('dark', NOW - 1_000, 'first-awake-tab');
		const result = resolveStoredTheme({
			currentSystemMode: 'dark',
			now: NOW,
			isReload: false,
			storedState: reconciledState,
			storedRegistry: activeRegistry(),
			writerTabId: TAB_ID
		});

		expect(result.mode).toBe('dark');
		expect(result.state).toBe(reconciledState);
		expect(result.shouldWriteState).toBe(false);
	});
});

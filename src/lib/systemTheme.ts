import { browser } from '$app/environment';
import { createSubscriber } from 'svelte/reactivity';
import type { ThemeName } from './types';
import {
	LEGACY_THEME_STATE_KEY,
	THEME_STATE_KEY,
	parseThemeState,
	resolveTheme,
	systemThemeState,
	toTheme,
	userThemeState,
	type StorageLike,
	type StoredThemeState
} from './themeState';

function withStorage<T>(callback: (storage: StorageLike) => T, fallback: T): T {
	try {
		return callback(window.localStorage);
	} catch {
		return fallback;
	}
}

function applyDocumentTheme(themeName: ThemeName) {
	document.documentElement.classList.toggle('dark', themeName === 'dark');
	document.documentElement.style.colorScheme = themeName;
}

export function adaptiveTheme() {
	if (!browser) {
		return {
			get current(): ThemeName {
				return 'light';
			},
			set current(_theme: ThemeName) {}
		};
	}

	const media = window.matchMedia('(prefers-color-scheme: dark)');
	const getSystemTheme = () => toTheme(media.matches);

	const read = () =>
		withStorage((storage) => {
			const current = parseThemeState(storage.getItem(THEME_STATE_KEY));
			if (current) return current;

			const legacy = parseThemeState(storage.getItem(LEGACY_THEME_STATE_KEY));
			if (legacy) {
				try {
					storage.setItem(THEME_STATE_KEY, JSON.stringify(legacy));
				} catch {
					// Preserve the read even if migration write is blocked.
				}
			}
			return legacy;
		}, null);
	const write = (state: StoredThemeState) =>
		withStorage((storage) => storage.setItem(THEME_STATE_KEY, JSON.stringify(state)), undefined);

	const initial = resolveTheme(read(), getSystemTheme());
	let currentTheme: ThemeName = initial.theme;
	let notify = () => {};

	applyDocumentTheme(currentTheme);
	if (initial.fresh) write(initial.state);

	const set = (state: StoredThemeState, { persist = true } = {}) => {
		const changed = state.theme !== currentTheme;
		currentTheme = state.theme;
		applyDocumentTheme(currentTheme);
		if (persist) write(state);
		if (changed) notify();
	};

	// Re-read storage and reconcile against the current OS preference. Used on
	// load, on cross-tab writes, and whenever a tab may have missed events while
	// hidden. Only persists when the resolved state is fresh (a first visit or an
	// OS drift) so cross-tab writes are adopted without echoing back.
	const reconcile = ({ persist = true } = {}) => {
		const { state, fresh } = resolveTheme(read(), getSystemTheme());
		set(state, { persist: persist && fresh });
	};

	const subscribe = createSubscriber((update) => {
		notify = update;

		const onMedia = () => set(systemThemeState(getSystemTheme()));
		const onStorage = (event: StorageEvent) => {
			if (event.key !== THEME_STATE_KEY) return;
			reconcile({ persist: false });
		};
		const onReturn = () => reconcile();

		media.addEventListener('change', onMedia);
		window.addEventListener('storage', onStorage);
		document.addEventListener('visibilitychange', onReturn);
		window.addEventListener('pageshow', onReturn);
		window.addEventListener('focus', onReturn);

		return () => {
			media.removeEventListener('change', onMedia);
			window.removeEventListener('storage', onStorage);
			document.removeEventListener('visibilitychange', onReturn);
			window.removeEventListener('pageshow', onReturn);
			window.removeEventListener('focus', onReturn);
		};
	});

	return {
		get current(): ThemeName {
			subscribe();
			return currentTheme;
		},

		set current(themeName: ThemeName) {
			set(userThemeState(themeName, getSystemTheme()));
		}
	};
}

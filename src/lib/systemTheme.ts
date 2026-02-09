import { createSubscriber } from 'svelte/reactivity';
import { browser } from '$app/environment';

type Mode = 'dark' | 'light';
type MaybeMode = Mode | null;

const LEGACY_INVERT_KEY = 'theme-invert';
const MANUAL_MODE_KEY = 'theme-manual-mode';

function toMode(systemIsDark: boolean): Mode {
	return systemIsDark ? 'dark' : 'light';
}

function opposite(mode: Mode): Mode {
	return mode === 'dark' ? 'light' : 'dark';
}

function parseMode(value: string | null): MaybeMode {
	if (value === 'dark' || value === 'light') return value;
	return null;
}

export function normalizeManualMode(systemMode: Mode, manualMode: MaybeMode): MaybeMode {
	if (!manualMode) return null;
	return manualMode === systemMode ? null : manualMode;
}

export function deriveManualModeFromUserChoice(systemMode: Mode, desiredMode: Mode): MaybeMode {
	return normalizeManualMode(systemMode, desiredMode);
}

export function resolveEffectiveMode(systemMode: Mode, manualMode: MaybeMode): Mode {
	return normalizeManualMode(systemMode, manualMode) ?? systemMode;
}

function readStoredManualMode(systemMode: Mode): MaybeMode {
	const storedManualMode = parseMode(localStorage.getItem(MANUAL_MODE_KEY));
	if (storedManualMode) return storedManualMode;

	// Legacy fallback: "invert=true" means "opposite of current system mode".
	const legacyInvert = localStorage.getItem(LEGACY_INVERT_KEY) === 'true';
	return legacyInvert ? opposite(systemMode) : null;
}

function persistStoredThemeState(systemMode: Mode, manualMode: MaybeMode): MaybeMode {
	const normalizedManualMode = normalizeManualMode(systemMode, manualMode);
	const effectiveMode = resolveEffectiveMode(systemMode, normalizedManualMode);
	const invert = effectiveMode !== systemMode;

	if (normalizedManualMode) {
		localStorage.setItem(MANUAL_MODE_KEY, normalizedManualMode);
	} else {
		localStorage.removeItem(MANUAL_MODE_KEY);
	}

	// Keep legacy key in sync for backward compatibility and prepaint fallback.
	localStorage.setItem(LEGACY_INVERT_KEY, String(invert));
	return normalizedManualMode;
}

export function adaptiveTheme() {
	if (!browser) {
		return {
			get current(): Mode {
				return 'light';
			},
			set current(_mode: Mode) {}
		};
	}

	const media = window.matchMedia('(prefers-color-scheme: dark)');
	let systemMode = toMode(media.matches);
	let manualMode = readStoredManualMode(systemMode);
	manualMode = persistStoredThemeState(systemMode, manualMode);

	let notify = () => {};

	const subscribe = createSubscriber((update) => {
		notify = update;

		const handler = (e: MediaQueryListEvent) => {
			systemMode = toMode(e.matches);
			manualMode = persistStoredThemeState(systemMode, manualMode);
			update();
		};

		const onStorage = (e: StorageEvent) => {
			if (e.key === MANUAL_MODE_KEY) {
				manualMode = normalizeManualMode(systemMode, parseMode(e.newValue));
				update();
				return;
			}

			// Legacy cross-tab sync support for older tabs still writing invert.
			if (e.key === LEGACY_INVERT_KEY && localStorage.getItem(MANUAL_MODE_KEY) === null) {
				const legacyInvert = e.newValue === 'true';
				manualMode = legacyInvert ? opposite(systemMode) : null;
				update();
			}
		};

		media.addEventListener('change', handler);
		window.addEventListener('storage', onStorage);

		return () => {
			media.removeEventListener('change', handler);
			window.removeEventListener('storage', onStorage);
		};
	});

	return {
		get current(): Mode {
			subscribe();
			return resolveEffectiveMode(systemMode, manualMode);
		},

		set current(mode: Mode) {
			manualMode = deriveManualModeFromUserChoice(systemMode, mode);
			manualMode = persistStoredThemeState(systemMode, manualMode);
			notify();
		}
	};
}

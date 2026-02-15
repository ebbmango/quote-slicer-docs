import { createSubscriber } from 'svelte/reactivity';
import { browser } from '$app/environment';

type Mode = 'dark' | 'light';
type MaybeMode = Mode | null;
type ThemeMessage =
	| { type: 'request'; source: string }
	| { type: 'state'; source: string; manualMode: MaybeMode };

const LEGACY_INVERT_KEY = 'theme-invert';
const MANUAL_MODE_KEY = 'theme-manual-mode';
const THEME_CHANNEL = 'theme-sync';

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

function getTabId(): string {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID();
	}
	return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
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
	const storedManualMode = parseMode(sessionStorage.getItem(MANUAL_MODE_KEY));
	if (storedManualMode) return storedManualMode;

	// Legacy fallback: "invert=true" means "opposite of current system mode".
	const legacyInvert = sessionStorage.getItem(LEGACY_INVERT_KEY) === 'true';
	return legacyInvert ? opposite(systemMode) : null;
}

function persistStoredThemeState(systemMode: Mode, manualMode: MaybeMode): MaybeMode {
	const normalizedManualMode = normalizeManualMode(systemMode, manualMode);
	const effectiveMode = resolveEffectiveMode(systemMode, normalizedManualMode);
	const invert = effectiveMode !== systemMode;

	if (normalizedManualMode) {
		sessionStorage.setItem(MANUAL_MODE_KEY, normalizedManualMode);
	} else {
		sessionStorage.removeItem(MANUAL_MODE_KEY);
	}

	// Keep legacy key in sync for backward compatibility and prepaint fallback.
	sessionStorage.setItem(LEGACY_INVERT_KEY, String(invert));
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
	const tabId = getTabId();
	const channel = typeof BroadcastChannel === 'function' ? new BroadcastChannel(THEME_CHANNEL) : null;

	let notify = () => {};
	const broadcastState = () => {
		if (!channel) return;
		const message: ThemeMessage = { type: 'state', source: tabId, manualMode };
		channel.postMessage(message);
	};

	const subscribe = createSubscriber((update) => {
		notify = update;

		const handler = (e: MediaQueryListEvent) => {
			systemMode = toMode(e.matches);
			manualMode = persistStoredThemeState(systemMode, manualMode);
			broadcastState();
			update();
		};

		const onMessage = (event: MessageEvent<ThemeMessage>) => {
			const message = event.data;
			if (!message || message.source === tabId) return;

			if (message.type === 'request') {
				broadcastState();
				return;
			}

			if (message.type !== 'state') return;
			const nextManualMode = normalizeManualMode(systemMode, message.manualMode);
			if (nextManualMode === manualMode) return;

			manualMode = persistStoredThemeState(systemMode, nextManualMode);
			update();
		};

		media.addEventListener('change', handler);
		channel?.addEventListener('message', onMessage);
		channel?.postMessage({ type: 'request', source: tabId } satisfies ThemeMessage);

		return () => {
			media.removeEventListener('change', handler);
			channel?.removeEventListener('message', onMessage);
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
			broadcastState();
			notify();
		}
	};
}

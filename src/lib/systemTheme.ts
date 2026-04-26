import { createSubscriber } from 'svelte/reactivity';
import { browser } from '$app/environment';

type Mode = 'dark' | 'light';
type ThemeMessage =
	| { type: 'request'; source: string }
	| { type: 'state'; source: string; value: Mode };

const THEME_CHANNEL = 'theme-sync';

function toMode(systemIsDark: boolean): Mode {
	return systemIsDark ? 'dark' : 'light';
}

function getTabId(): string {
	// browser-support dependant
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID();
	}
	return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function adaptiveTheme() {
	// ssr guard
	if (!browser) {
		return {
			get current(): Mode {
				return 'light';
			},
			set current(_mode: Mode) {}
		};
	}

	const media = window.matchMedia('(prefers-color-scheme: dark)');
	let currentMode = toMode(media.matches);
	const tabId = getTabId();
	const channel =
		typeof BroadcastChannel === 'function' ? new BroadcastChannel(THEME_CHANNEL) : null;

	let notify = () => {};

	const broadcastState = () => {
		if (!channel) return;
		const message: ThemeMessage = { type: 'state', source: tabId, value: currentMode };
		channel.postMessage(message);
	};

	const subscribe = createSubscriber((update) => {
		notify = update;

		const handler = (e: MediaQueryListEvent) => {
			currentMode = toMode(e.matches);
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
			if (message.value === currentMode) return;

			currentMode = message.value;
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
			return currentMode;
		},

		set current(mode: Mode) {
			if (mode === currentMode) return;
			currentMode = mode;
			broadcastState();
			notify();
		}
	};
}

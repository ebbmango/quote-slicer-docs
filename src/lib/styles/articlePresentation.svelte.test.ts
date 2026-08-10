import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import './index.css';

let fixture: HTMLElement;
let originalHtmlClass: string;
let originalColorScheme: string;

function element<T extends Element>(selector: string): T {
	const match = fixture.querySelector<T>(selector);
	if (!match) throw new Error(`Missing fixture element: ${selector}`);

	return match;
}

beforeEach(() => {
	originalHtmlClass = document.documentElement.className;
	originalColorScheme = document.documentElement.style.colorScheme;
	document.documentElement.className = 'js';
	document.documentElement.style.colorScheme = 'light';

	fixture = document.createElement('section');
	fixture.style.setProperty('--theme-color-transition-duration', '37ms');
	fixture.innerHTML = `
		<article data-plain>
			<p><code>plain code</code></p>
		</article>
		<article class="article-presentation" data-default>
			<h1>Default article</h1>
			<p><a href="#default">Default link</a></p>
			<p><code data-inline-code>inline code</code></p>
			<blockquote data-blockquote>Quote with <code data-blockquote-code>code</code></blockquote>
			<aside class="parenthetical">
				<p>Aside with <code data-parenthetical-code>code</code></p>
			</aside>
			<pre class="shiki"><code><span data-shiki-token style="--shiki-light: #151515; --shiki-dark: #efefef">const answer = 42;</span></code></pre>
		</article>
		<article class="article-presentation article-presentation--longform" data-longform>
			<h2>Long-form article</h2>
			<p><a href="#longform">Long-form link</a></p>
			<p><a href="#code-link" data-code-link><code>code link</code></a></p>
			<aside class="parenthetical">
				<p>
					Aside with
					<a href="#parenthetical-code-link" data-parenthetical-code-link><code>code link</code></a>
				</p>
			</aside>
			<aside class="not-article-presentation"><p data-metadata>Metadata</p></aside>
		</article>
	`;
	document.body.append(fixture);
});

afterEach(() => {
	fixture.remove();
	document.documentElement
		.getAnimations({ subtree: true })
		.forEach((animation) => animation.cancel());
	document.documentElement.className = originalHtmlClass;
	document.documentElement.style.colorScheme = originalColorScheme;
});

describe('article presentation', () => {
	it('owns prose styling without leaking to plain articles', () => {
		const article = element<HTMLElement>('[data-default]');
		const articleStyle = getComputedStyle(article);
		const defaultLinkStyle = getComputedStyle(element('[data-default] a'));
		const plainCodeStyle = getComputedStyle(element('[data-plain] code'));
		const inlineCodeStyle = getComputedStyle(element('[data-inline-code]'));
		const blockquoteStyle = getComputedStyle(element('[data-blockquote]'));
		const blockquoteCodeStyle = getComputedStyle(element('[data-blockquote-code]'));
		const parentheticalCodeStyle = getComputedStyle(element('[data-parenthetical-code]'));
		const shikiStyle = getComputedStyle(element('pre.shiki'));
		const shikiCodeStyle = getComputedStyle(element('pre.shiki code'));

		expect(articleStyle.fontSize).toBe('20px');
		expect(articleStyle.fontWeight).toBe('300');
		expect(defaultLinkStyle.fontStyle).toBe('normal');
		expect(defaultLinkStyle.fontWeight).toBe('500');
		expect(defaultLinkStyle.textDecorationLine).toBe('underline');
		expect(plainCodeStyle.backgroundColor).toBe('rgba(0, 0, 0, 0)');
		expect(inlineCodeStyle.backgroundColor).toBe('rgb(237, 237, 237)');
		expect(blockquoteCodeStyle.color).toBe(blockquoteStyle.color);
		expect(blockquoteCodeStyle.fontSize).toBe('18px');
		expect(blockquoteCodeStyle.fontWeight).toBe('400');
		expect(parentheticalCodeStyle.backgroundColor).toBe('rgb(224, 224, 224)');
		expect(shikiStyle.backgroundColor).toBe('rgb(61, 61, 61)');
		expect(shikiStyle.overflowX).toBe('auto');
		expect(shikiCodeStyle.display).toBe('grid');
		expect(getComputedStyle(article.firstElementChild!).marginTop).toBe('0px');
		expect(getComputedStyle(article.lastElementChild!).marginBottom).toBe('0px');
	});

	it('keeps long-form links and metadata in their own contexts', () => {
		const longformLinkStyle = getComputedStyle(element('[data-longform] a:not([data-code-link])'));
		const codeLink = element<HTMLElement>('[data-code-link]');
		const codeLinkStyle = getComputedStyle(codeLink);
		const codeLinkCodeStyle = getComputedStyle(element('[data-code-link] code'));
		const metadataStyle = getComputedStyle(element('[data-metadata]'));

		expect(longformLinkStyle.fontStyle).toBe('italic');
		expect(longformLinkStyle.fontWeight).toBe('300');
		expect(longformLinkStyle.textDecorationLine).toBe('none');
		expect(codeLinkStyle.fontWeight).toBe('400');
		expect(codeLinkCodeStyle.fontWeight).toBe('400');
		expect(codeLinkCodeStyle.color).toBe(codeLinkStyle.color);
		expect(codeLinkStyle.transitionDuration).toBe('0.11s');
		expect(metadataStyle.marginTop).toBe('0px');
		expect(metadataStyle.marginBottom).toBe('0px');
	});

	it('lets the nearest inline-code context define the shared renderer', () => {
		const codeLink = element<HTMLElement>('[data-code-link]');
		const codeLinkCodeStyle = getComputedStyle(element('[data-code-link] code'));
		const parentheticalCodeLink = element<HTMLElement>('[data-parenthetical-code-link]');
		const parentheticalCodeLinkStyle = getComputedStyle(parentheticalCodeLink);
		const parentheticalCodeLinkCodeStyle = getComputedStyle(
			element('[data-parenthetical-code-link] code')
		);

		expect(parentheticalCodeLinkCodeStyle.backgroundColor).toBe('rgb(252, 233, 252)');
		expect(parentheticalCodeLinkCodeStyle.backgroundColor).toBe(codeLinkCodeStyle.backgroundColor);
		expect(parentheticalCodeLinkCodeStyle.color).toBe(parentheticalCodeLinkStyle.color);
		expect(parentheticalCodeLinkCodeStyle.color).toBe(getComputedStyle(codeLink).color);
		expect(parentheticalCodeLinkCodeStyle.fontWeight).toBe('400');
		expect(parentheticalCodeLinkCodeStyle.transitionDuration).toBe('0.11s');
	});

	it('enables theme motion only during an explicit theme change', () => {
		const article = element<HTMLElement>('[data-default]');
		const heading = element<HTMLElement>('[data-default] h1');
		const inlineCode = element<HTMLElement>('[data-inline-code]');
		const codeLink = element<HTMLElement>('[data-code-link]');
		const shikiToken = element<HTMLElement>('[data-shiki-token]');

		expect(getComputedStyle(article).transitionDuration).toBe('0s');
		expect(getComputedStyle(heading).transitionDuration).toBe('0s');
		expect(getComputedStyle(inlineCode).transitionDuration).toBe('0s');
		expect(getComputedStyle(codeLink).transitionDuration).toBe('0.11s');
		expect(getComputedStyle(shikiToken).transitionDuration).toBe('0s');

		document.documentElement.classList.add('theme-transitioning');

		const articleStyle = getComputedStyle(article);
		const articleTransitionProperties = articleStyle.transitionProperty.split(', ');
		expect(articleTransitionProperties).toEqual(
			expect.arrayContaining([
				'--tw-prose-body',
				'--tw-prose-headings',
				'--tw-prose-bold',
				'--tw-prose-code',
				'--article-inline-code-background',
				'--article-link-color'
			])
		);
		expect(articleTransitionProperties).not.toContain('color');
		expect(
			articleStyle.transitionDuration.split(', ').every((duration) => duration === '0.037s')
		).toBe(true);

		for (const descendant of [heading, inlineCode, codeLink]) {
			expect(getComputedStyle(descendant).transitionProperty).toBe('none');
		}

		const shikiTokenStyle = getComputedStyle(shikiToken);
		expect(shikiTokenStyle.transitionProperty).toBe('--shiki-theme-color');
		expect(shikiTokenStyle.transitionDuration).toBe('0.037s');
	});

	it('runs every article color token on one transition timeline', async () => {
		fixture.style.setProperty('--theme-color-transition-duration', '500ms');

		const root = document.documentElement;
		const article = element<HTMLElement>('[data-default]');
		const heading = element<HTMLElement>('[data-default] h1');
		const inlineCode = element<HTMLElement>('[data-inline-code]');
		const codeLink = element<HTMLElement>('[data-code-link]');
		const shikiToken = element<HTMLElement>('[data-shiki-token]');
		const lightHeadingColor = getComputedStyle(heading).color;

		root.classList.add('theme-transitioning');
		getComputedStyle(article);
		root.classList.add('dark');
		root.style.colorScheme = 'dark';

		await new Promise<void>((resolve) => {
			requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
		});

		const transitionFor = (target: Element, property: string) =>
			target
				.getAnimations()
				.find((animation) => (animation as CSSTransition).transitionProperty === property) as
				| CSSTransition
				| undefined;

		const synchronizedTransitions = [
			transitionFor(root, '--page-foreground'),
			transitionFor(article, '--tw-prose-body'),
			transitionFor(article, '--tw-prose-headings'),
			transitionFor(article, '--tw-prose-bold'),
			transitionFor(article, '--tw-prose-code'),
			transitionFor(article, '--article-inline-code-background'),
			transitionFor(article, '--article-link-color'),
			transitionFor(shikiToken, '--shiki-theme-color')
		];

		expect(synchronizedTransitions.every(Boolean)).toBe(true);

		const progress = synchronizedTransitions.map(
			(transition) => transition!.effect?.getComputedTiming().progress ?? Number.NaN
		);
		expect(progress.every(Number.isFinite)).toBe(true);
		expect(Math.max(...progress) - Math.min(...progress)).toBeLessThan(0.001);
		expect(getComputedStyle(heading).color).not.toBe(lightHeadingColor);

		for (const descendant of [heading, inlineCode, codeLink]) {
			expect(transitionFor(descendant, 'color')).toBeUndefined();
		}
	});

	it('resolves article tokens for dark mode', () => {
		document.documentElement.className = 'js dark';
		document.documentElement.style.colorScheme = 'dark';

		const articleStyle = getComputedStyle(element('[data-default]'));
		const inlineCodeStyle = getComputedStyle(element('[data-inline-code]'));
		const blockquoteStyle = getComputedStyle(element('[data-blockquote]'));
		const blockquoteCodeStyle = getComputedStyle(element('[data-blockquote-code]'));
		const parentheticalStyle = getComputedStyle(element('.parenthetical'));
		const shikiStyle = getComputedStyle(element('pre.shiki'));

		expect(articleStyle.getPropertyValue('--article-inline-code-weight').trim()).toBe('300');
		expect(inlineCodeStyle.fontWeight).toBe('300');
		expect(inlineCodeStyle.backgroundColor).toBe('rgb(61, 61, 61)');
		expect(blockquoteCodeStyle.color).toBe(blockquoteStyle.color);
		expect(parentheticalStyle.backgroundColor).toBe('rgb(36, 36, 36)');
		expect(shikiStyle.backgroundColor).toBe('rgb(36, 36, 36)');
	});
});

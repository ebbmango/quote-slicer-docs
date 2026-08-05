import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import './index.css';

let fixture: HTMLElement;
let originalHtmlClass: string;

function element<T extends Element>(selector: string): T {
	const match = fixture.querySelector<T>(selector);
	if (!match) throw new Error(`Missing fixture element: ${selector}`);

	return match;
}

beforeEach(() => {
	originalHtmlClass = document.documentElement.className;
	document.documentElement.className = 'js';

	fixture = document.createElement('section');
	fixture.style.setProperty('--theme-color-transition-duration', '0ms');
	fixture.innerHTML = `
		<article data-plain>
			<p><code>plain code</code></p>
		</article>
		<article class="article-presentation" data-default>
			<h1>Default article</h1>
			<p><a href="#default">Default link</a></p>
			<p><code data-inline-code>inline code</code></p>
			<aside class="parenthetical">
				<p>Aside with <code data-parenthetical-code>code</code></p>
			</aside>
			<pre class="shiki"><code><span>const answer = 42;</span></code></pre>
		</article>
		<article class="article-presentation article-presentation--longform" data-longform>
			<h2>Long-form article</h2>
			<p><a href="#longform">Long-form link</a></p>
			<p><a href="#code-link" data-code-link><code>code link</code></a></p>
			<aside class="not-article-presentation"><p data-metadata>Metadata</p></aside>
		</article>
	`;
	document.body.append(fixture);
});

afterEach(() => {
	fixture.remove();
	document.documentElement.className = originalHtmlClass;
});

describe('article presentation', () => {
	it('owns prose styling without leaking to plain articles', () => {
		const article = element<HTMLElement>('[data-default]');
		const articleStyle = getComputedStyle(article);
		const defaultLinkStyle = getComputedStyle(element('[data-default] a'));
		const plainCodeStyle = getComputedStyle(element('[data-plain] code'));
		const inlineCodeStyle = getComputedStyle(element('[data-inline-code]'));
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
		expect(codeLinkStyle.transitionDuration).toBe('0.11s, 0s, 0s');
		expect(metadataStyle.marginTop).toBe('0px');
		expect(metadataStyle.marginBottom).toBe('0px');
	});

	it('resolves article tokens for dark mode', () => {
		document.documentElement.className = 'js dark';

		const articleStyle = getComputedStyle(element('[data-default]'));
		const inlineCodeStyle = getComputedStyle(element('[data-inline-code]'));
		const parentheticalStyle = getComputedStyle(element('.parenthetical'));
		const shikiStyle = getComputedStyle(element('pre.shiki'));

		expect(articleStyle.getPropertyValue('--article-inline-code-weight').trim()).toBe('300');
		expect(inlineCodeStyle.fontWeight).toBe('300');
		expect(inlineCodeStyle.backgroundColor).toBe('rgb(61, 61, 61)');
		expect(parentheticalStyle.backgroundColor).toBe('rgb(36, 36, 36)');
		expect(shikiStyle.backgroundColor).toBe('rgb(36, 36, 36)');
	});
});

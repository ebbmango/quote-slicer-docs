<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import HighlightWord from '../components/HighlightWord.svelte';
	import HighlightWordDemo from './HighlightWordDemo.svelte';

	const { Story } = defineMeta({
		title: 'Components/HighlightWord',
		component: HighlightWord,
		tags: ['autodocs'],
		argTypes: {
			active: { control: 'boolean' },
			delay: { control: 'number' },
			duration: { control: 'number' },
			padding: { control: 'text' },
			fillColor: { control: 'color' },
			activeTextColor: { control: 'color' },
			inactiveTextColor: { control: 'color' }
		},
		args: {
			text: 'reactive',
			active: false,
			delay: 300,
			duration: 300,
			padding: '3px',
			fillColor: '#ff0037',
			activeTextColor: '#ffffff',
			inactiveTextColor: '#000000'
		}
	});
</script>

<Story name="Playground" />

<Story name="Active" args={{ active: true, delay: 0 }} />

<Story name="Externally Controlled" args={{ text: 'mapped' }}>
	{#snippet template(args)}
		<HighlightWordDemo text={args.text} delay={args.delay} duration={args.duration} />
	{/snippet}
</Story>

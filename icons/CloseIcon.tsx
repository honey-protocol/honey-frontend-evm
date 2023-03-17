export const CloseIcon = (props: { color?: string }) => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M2 2L14 14M14 2L2 14"
			stroke={props.color ?? '#111111'}
			strokeWidth="2.4"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

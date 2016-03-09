"use strict";

var Page = (props) => (
		<Layout active="index" title={ props.title }>
		<div>
			<h1>{ props.title }</h1>
			<Shared.ChildComponent>Test</Shared.ChildComponent>
		</div>
	</Layout>
);


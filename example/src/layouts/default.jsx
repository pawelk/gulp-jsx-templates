var Layout = props => <html>
	<head>
	<title>{ props.title ? props.title : 'Hello' }</title>
	</head>
	<body>
	<Shared.Nav pages={ data.pages } active={ props.active } />
		{ props.children }
	</body>
	</html>;

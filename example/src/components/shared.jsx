
var ChildComponent = props => <span>Shared child component { props.children }</span>;

var Nav = props => {
	var pages = Object.keys( props.pages );
	return (<nav>
	<ul>
	{ pages.map( page => <li key={ page }><a href={ `${page}.html` } className={ props.active == page ? "active" : ""}>{ props.pages[ page ].title }</a></li> )}
	</ul>
	</nav>);
};
		

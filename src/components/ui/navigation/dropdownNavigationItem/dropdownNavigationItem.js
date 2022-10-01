import React from 'react';
import { NavLink } from 'react-router-dom';

const DropdownNavigationItem = (props) => (
	<li>
		<NavLink 
			to={props.link}
			className='dropdown-item'>
			<i className={ props.icon + ' fs-4' } />
			{ props.children }
		</NavLink>
	</li>
);

export default DropdownNavigationItem;
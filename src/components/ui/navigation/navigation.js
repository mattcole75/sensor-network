import React from 'react';
import NavigationItem from './navigationItem/navigationItem';
import DropdownNavigationItem from './dropdownNavigationItem/dropdownNavigationItem';

const navigationItems = (props) => (
	
		<nav>
			<ul className='nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0'>
				
                <NavigationItem link='/' icon='bi-house-door'>Home</NavigationItem>

				{ props.isAuthenticated
					? <div  className='dropdown text-end'>
						<a href='/' className='nav-link text-white dropdown-toggle' id='dropdownUser1' data-bs-toggle='dropdown' aria-expanded='false'>
							<i className='bi-activity fs-3 d-block text-sm-center'></i>
							Menu
						</a>
						
						<ul className='dropdown-menu text-small' aria-labelledby='dropdownUser1'>
							<DropdownNavigationItem link='/dashboard' icon='bi-speedometer2'>  Dashboard</DropdownNavigationItem>
							<DropdownNavigationItem link='/sensors' icon='bi-robot'>  Sensors</DropdownNavigationItem>
							<DropdownNavigationItem link='/points' icon='bi-alt'>  Points</DropdownNavigationItem>
						</ul>
					</div>
					: null
				}

				<div  className='dropdown text-end'>
					<a href='/' className='nav-link text-white dropdown-toggle' id='dropdownUser1' data-bs-toggle='dropdown' aria-expanded='false'>
						<i className='bi-person fs-3 d-block text-sm-center'></i>
						Profile
					</a>
					<ul className='dropdown-menu text-small' aria-labelledby='dropdownUser1'>
						{/* <DropdownNavigationItem link='/account' icon='bi-person'> Account</DropdownNavigationItem> */}
						{/* <DropdownNavigationItem link='/users' icon='bi-people'> Users</DropdownNavigationItem> */}
                        {/* <li><hr className='dropdown-divider'/></li> */}
						{ !props.isAuthenticated
							? <DropdownNavigationItem link='/login' icon='bi-person-check'> Login</DropdownNavigationItem>
							: null
						}
						{ props.isAuthenticated
							? <DropdownNavigationItem link='/logout' icon='bi-person-x'> Logout</DropdownNavigationItem>
							: null
						}
						{/* <DropdownNavigationItem link='/signup' icon='bi-person-plus'> Sign-up</DropdownNavigationItem> */}
					</ul>
				</div>
			</ul>
		</nav>
);

export default navigationItems;

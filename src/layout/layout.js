import React from 'react';
import {useSelector} from 'react-redux';
import Header from '../components/ui/header/header';
import Footer from '../components/ui/footer/footer';


const Layout = (props) => {

    const isAuthenticated = useSelector(state => state.auth.idToken !== null);

    return (
        <React.Fragment>
            <Header isAuthenticated={isAuthenticated} />
            <main>
                {props.children}
            </main>
            <Footer />
        </React.Fragment>
    );
};

export default Layout;
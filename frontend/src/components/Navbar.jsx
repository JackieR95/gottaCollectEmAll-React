/*
Written by: Jacqueline Rael
Date: 12/08/2025
Lab: Final Lab
*/

// Import navigation helpers from React Router
import { Link, useLocation } from 'react-router-dom';
// Imports pokeBallLogo from assets to display in navbar
import pokeBallLogo from '../assets/images/pokeBallLogo.png'

// Navigation bar with active route highlighting, translated from html code to react
function Navbar() {
    const location = useLocation();

    return (
        <nav className="navbar navbar-expand-lg">
            <Link className="navbar-brand" to="/">
                <img src={pokeBallLogo} alt="Pokéball" width="30" height="30" className="d-inline-block align-text-top" />
                Gotta Collect 'Em All
            </Link>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                        to="/"
                    >
                        My Collection
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        className={`nav-link ${location.pathname === '/cards' ? 'active' : ''}`}
                        to="/cards"
                    >
                        Cards
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        className={`nav-link ${location.pathname === '/sets' ? 'active' : ''}`}
                        to="/sets"
                    >
                        Sets
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar

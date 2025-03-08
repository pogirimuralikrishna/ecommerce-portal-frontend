import Cookie from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './index.css'
import { use } from 'react';


const Header = (props) => {
    const navigate = useNavigate()
    const jwtToken = Cookie.get('jwtToken')
    const loginButtonClicked = (e) => {
        props.login()
    }
    const signUpButtonClicked = (e) => {
        props.signUp()
    }
    const logoutButtonClicked = () => {
        Cookie.remove('jwtToken')
        navigate('/')
    }
    const homeButtonClicked = () => {
        navigate('/home')
    }
    const productsButtonClicked = () => {
        navigate('/product')
    }
    return (
        <nav className="navbar">
            <p>Destion</p>
            {
                jwtToken ?  
                <div>
                <button onClick={homeButtonClicked}>Home</button>    
                <button onClick={homeButtonClicked}>Invoices</button>
                <button onClick={productsButtonClicked}>Products</button>
                <button onClick={logoutButtonClicked}>Logout</button>
                </div>   
                :
                <div>
                    <button onClick={signUpButtonClicked}>Register</button>
                    <button onClick={loginButtonClicked}>Login</button>
                </div>  
            }
              
        </nav>
    )
}




export default Header
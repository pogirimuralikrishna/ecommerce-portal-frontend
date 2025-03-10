
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {useState } from 'react';
import Authentication from './components/Authentication'
import Home from './components/Home'
import NotFound from  './components/NotFound'
import { UserContext } from './context/context';
import './App.css'
import Header from './components/Header';
import ProductList from './components/ProductList';

const API_URL = process.env.REACT_APP_API_URL;



function App() {
    const [, setApiUrl] = useState('https://ecommerce-portal-backend.onrender.com/owner')
    const [isNewUser, changeUserStatus] = useState(true)
    const switchToLogin = () => {
        changeUserStatus(false)
    }
    const switchToSignUp = () => {
        changeUserStatus(true)
    }
    return (
        <BrowserRouter>
         <UserContext.Provider value={API_URL}>
                <Header login = {switchToLogin} signUp = {switchToSignUp}/>    
                <Routes>
               
                    <Route path='/' element={<Authentication existingUser={isNewUser}/>}/>
                    <Route path='/home' element={<Home />}/>
                    <Route path='/product' element={<ProductList/>}/>
                    <Route path='*' element={<NotFound />}/>
                 
                </Routes>
        </UserContext.Provider>       
        </BrowserRouter>
    )
}


export default App
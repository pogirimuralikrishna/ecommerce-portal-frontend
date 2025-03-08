import { useContext, useState } from "react"
import Cookies from "js-cookie";
import { UserContext } from "../../context/context"
import { useNavigate } from "react-router-dom";
import './index.css'

const Authentication = ({existingUser}) => {
    const API_URL = useContext(UserContext)
    const navigate = useNavigate(); // Get the navigate function
    const [username, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()  // need to prevent default browser behav
        const userDetails =  existingUser ? { username,email, password} :  { email, password}
        const endPoint  = existingUser ? '/signup' : '/login'
        const onSubmitSuccess = (data) => {
            if (data.jwtToken){
                Cookies.set('jwtToken', data.jwtToken, {expires: 7}) // set Cookie
            }
            navigate('/home')
        }
        
       try{
        const response = await fetch(`${API_URL}${endPoint}`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userDetails)
          });
          const data = await response.json();
          if (response.ok){
                onSubmitSuccess(data)
          }
          else{
            console.log(data)
          }
       }
       catch(e){
        console.log(e)
       }
        
    }
    const onChangeUserName = (e) => {
        setUserName(e.target.value)
    }
    const onChangeEmail = (e) => {
        setEmail(e.target.value)
    }
    const onChangePassword = (e) => {
        setPassword(e.target.value)
    }
    return(
        <div className="authentication-page">
            
            
            {existingUser? 
            <form onSubmit={handleSubmit}>
                <div className="form-feild">
                    <label className="label">USERNAME</label>
                    <br/>
                    <input value={username} onChange={onChangeUserName} type='text'/>
                    <p></p>
                </div>   
                <div className="form-feild">
                    <label className="label">EMAIL</label>
                    <br/>
                    <input value={email} onChange={onChangeEmail} type='text'/>
                    <p></p>
                </div>    
                <div className="form-feild">
                    <label className="label">PASSWORD</label>
                    <br/>
                    <input value={password} onChange={onChangePassword} type='text' />
                    <p></p>
                </div>
                <button type='submit'>Submit</button>
            </form> 
            :  
            <form onSubmit={handleSubmit}>   
                <div className="form-feild">
                    <label className="label">EMAIL</label>
                    <br/>
                    <input value={email} onChange={onChangeEmail} type='text'/>
                    <p></p>
                </div>    
                <div className="form-feild">
                    <label className="label">PASSWORD</label>
                    <br/>
                    <input value={password} onChange={onChangePassword} type='text' />
                    <p></p>
                </div>
                <button type='submit'>Submit</button>
            </form> 
            }
        </div>
    )
}

export default Authentication
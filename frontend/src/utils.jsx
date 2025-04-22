//this file use for through error in entire project
// i create two function 
// 1. success(msg)
// 2. handleError(msg)

// The react-toastify library is used in React applications to display notifications (toasts) 
// when an event occurs, such as successful signup, login errors, or form validation messages.
import {toast} from 'react-toastify';

//{success, error, warning, info}
// toast.success("Signup successful!");
// toast.error("Invalid credentials!");
// toast.warning("Password is too weak!");
// toast.info("Check your email for verification.");

export const handleSuccess = (msg)=>{
    toast.success(msg,{
        position:'top-right'
    });
}

export const handleError = (msg)=>{
    toast.error(msg,{
        position:'top-right'
    });
}
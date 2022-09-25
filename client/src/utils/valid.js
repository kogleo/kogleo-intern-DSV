const valid = ({username, email, password, fullname}) => {
    const err = {}
    if (username || email || password || fullname){
        if(!username) {
            err.username = "Please add your user name."
        }else if(username.replace(/ /g, '').length > 25){
            err.username = "Username is up to 16 characters long."
        }

        if(!fullname) {
            err.fullname = "Please add your fullname."
        }else if(fullname.length > 25){
            err.fullname = "Your full name is up to 25 characters long."
        }
    
        if(!email) {
            err.email = "Please add your email."
        }else if(!validateEmail(email)){
            err.email = "Email format is incorrect."
        }
    
        if(password.length < 6){
            err.password = "Password must be at least 6 characters."
        }
        else{
            err.password = ""
        }
    }
    


    return {
        errMsg: err,
        errLength: Object.keys(err).length
    }
}

function validateEmail(email) {
    // eslint-disable-next-line
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
  
export default valid
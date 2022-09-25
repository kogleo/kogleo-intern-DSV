import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../redux/actions/globalTypes'
import { Snackbar} from '@mui/material';
import MuiAlert from '@mui/material/Alert';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function CustomizeAlert(){
    const { alert } = useSelector(state => state)
    const dispatch = useDispatch()
    const vertical = "top"
    const horizontal = "right"

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        dispatch({type: GLOBALTYPES.ALERT, payload: {}})
    };

    // function TransitionRight(props) {
    //     return <Slide {...props} direction="left" />;
    // }
    return(
        <div>
            {/* {alert.loading && <Loading />} */}
            {alert.error && 
            <Snackbar open autoHideDuration={3000} onClose={handleClose} 
            anchorOrigin={{ vertical, horizontal }}
            >
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                {alert.error}
            </Alert>
            </Snackbar>}
            {alert.success && 
            <Snackbar open autoHideDuration={3000} onClose={handleClose} 
            anchorOrigin={{ vertical, horizontal }}
            >
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    {alert.success}
                </Alert>
            </Snackbar>}
        </div>
        
    )
}
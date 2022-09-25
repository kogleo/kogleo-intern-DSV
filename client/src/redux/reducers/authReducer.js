import { GLOBALTYPES } from '../actions/globalTypes'

const initialState = {isAuth: false}

const authReducer = (state = initialState, action) => {
    switch (action.type){
        case GLOBALTYPES.AUTH:
            return action.payload;
        // case GLOBALTYPES.SET_ISAUTH:
        //     return {isAuth: action.payload.isAuth}
        default:
            return state;
    }
}


export default authReducer
import { configureStore } from '@reduxjs/toolkit'
import FollowingsReducer from '../reducers/FollowingsSlice'
import UserIdReducer from '../reducers/UserIdSlice'

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default configureStore({
    reducer:{
        following: FollowingsReducer,
        userIdReducer: UserIdReducer
    }
})



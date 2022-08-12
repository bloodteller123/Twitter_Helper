import { configureStore } from '@reduxjs/toolkit'
import FollowingsReducer from '../reducers/FollowingsSlice'

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default configureStore({
    reducer:{
        following: FollowingsReducer
    }
})



import { createSlice } from '@reduxjs/toolkit'

const UserIdSlice = createSlice({
    name: 'userId',
    initialState: '',
    reducers:{
        setUserId(state,action){
            return action.payload.id
        },
        resetUserId(state,action){
            return action.payload.emptyId
        }
    }
})

export const {setUserId, resetUserId} = UserIdSlice.actions
export const selectUserId = (state) => state.userIdReducer

export default UserIdSlice.reducer
import { createSlice } from '@reduxjs/toolkit'



const followingSlice = createSlice({
    name: 'followings',
    initialState:{
        followings_list: []
    },
    reducers:{
        addFollowing(state, action) {
            state.followings_list.push(action.payload.user)
        },
        removeFollowing(state, action){
            return state.followings_list.filter(following => 
                following.id_str!==action.payload.user.id_str)
        }
    }
})

export const { addFollowing, removeFollowing} = followingSlice.actions

export const selectFollowings = (state) => state.followings.followings_list

export default followingSlice.reducer
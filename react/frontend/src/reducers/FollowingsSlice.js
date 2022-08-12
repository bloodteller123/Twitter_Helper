import { createSlice } from '@reduxjs/toolkit'



const followingSlice = createSlice({
    name: 'followings',
    initialState:{
        followings_list: []
    },
    // initialState: [],
    reducers:{
        addFollowing(state, action) {
            const user = action.payload.user
            
            if(state.followings_list.filter(f => f.id_str === user.id_str).length===0)
                state.followings_list.push(user)
        },
        removeFollowing(state, action){
            const id = action.payload.user.id_str
            let filtered =  state.followings_list.filter(following => 
                following.id_str!==id)
            // https://stackoverflow.com/questions/73299440/redux-toolkit-state-becomes-undefined-after-performing-filter-on-a-empty-state-a/73300110#73300110
            state.followings_list = filtered
        }
    }
})

export const { addFollowing, removeFollowing} = followingSlice.actions

// state.X where X should be conssitent with {reducer:{X: some reducer}} in configureStore ??
export const selectFollowings = (state) => state.following.followings_list

export default followingSlice.reducer
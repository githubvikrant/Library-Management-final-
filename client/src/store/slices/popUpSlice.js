import {createSlice} from "@reduxjs/toolkit"

const popupSlice = createSlice({
    name:"popup",
    initialState:{
       settingPopup:false,
       addBookPopup:false,
       editBookPopup:false,
       readBookPopup:false,
       recordBookPopup:false,
       returnBookPopup:false,
       addNewAdminPopup:false,
    },
    reducers:{
        toggleSettingPopup(state){
            state.settingPopup = !state.settingPopup;
        },
        toggleAddBookPopup(state){
            state.addBookPopup = !state.addBookPopup;
        },
        toggleEditBookPopup(state){
            state.editBookPopup = !state.editBookPopup;
        },
        toggleReadBookPopup(state){
            state.readBookPopup = !state.readBookPopup;
        },
        toggleRecordBookPopup(state){
            state.recordBookPopup = !state.recordBookPopup;
        },
        toggleAddNewAdminPopup(state){
            state.addNewAdminPopup = !state.addNewAdminPopup;
        },
        toggleReturnBookPopup(state){
            state.returnBookPopup = !state.returnBookPopup;
        },
        closeAllPopup(state){
            state.settingPopup = false;
            state.addBookPopup = false;
            state.editBookPopup = false;
            state.readBookPopup = false;
            state.recordBookPopup = false;
            state.returnBookPopup = false;
            state.addNewAdminPopup = false;
        
        },
    }
})

export const {
    closeAllPopup,
    toggleAddBookPopup,
    toggleEditBookPopup,
    toggleAddNewAdminPopup,
    toggleReadBookPopup,
    toggleRecordBookPopup,
    toggleReturnBookPopup,
    toggleSettingPopup,
} = popupSlice.actions;

export default popupSlice.reducer;


import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import AuthenticationReducer from "./authentication_reducer";
import RegistrationReducer from "./registration_reducer";
import GetNotesReducer from "./get_notes_reducer";
import AddNoteReducer from "./add_note_reducer";
import UserDetailsReducer from "./get_user_details_reducer";
import DeleteNoteReducer from "./delete_note_reducer";
import EditNoteReduce from "./edit_note_reducer";
import GetGroupsReducer from "./get_groups_reducer";
import CreateGroupReducer from "./create_group_reducer";
import UserStatsReducer from "./get_user_stats_reducer";
import GetFeedsReducer from "./get_feeds_reducer";
import GetUsersReducer from "./get_users_reducer";
import EditGroupReducer from "./edit_group_reducer";
import GenerateCheatsheetReducer from "./generate_cheatsheet_reducer";
import GetGroupStatsReducer from "./get_group_stats_reducer";
import { INVALIDATE } from '../actions/invalidate_action'

const appReducer = combineReducers({
    form: formReducer,
    authentication: AuthenticationReducer,
    register: RegistrationReducer,
    getNotes: GetNotesReducer,
    addNote: AddNoteReducer,
    deleteNote: DeleteNoteReducer,
    editNote: EditNoteReduce,
    userDetails: UserDetailsReducer,
    getGroups: GetGroupsReducer,
    createGroup: CreateGroupReducer,
    userStats: UserStatsReducer,
    feeds: GetFeedsReducer,
    getUsers: GetUsersReducer,
    editGroup: EditGroupReducer,
    generateCheatsheet: GenerateCheatsheetReducer,
    groupStats: GetGroupStatsReducer
});

const rootReducer = (state, action) => {
    if (action.type === INVALIDATE) {
        state = undefined
    }

    return appReducer(state, action)
}

export default rootReducer;

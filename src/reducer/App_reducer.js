import { createAction, handleActions } from 'redux-actions';
import {firestore, firebaseAuth} from '../config/FirebaseConfig';
import { connect } from 'net';

// action type
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const LOGIN_EMAIL = 'LOGIN_EMAIL'
const IS_UPLOADING = 'IS_UPLOADING';
const IS_FAVORITE = 'IS_FAVORITE';
const BOARD_SAVE = 'SAVE';
const BOARD_REMOVE = 'REMOVE';
const BOARD_UPDATE = 'UPDATE';
const BOARD_UPDATE_NUM = "UPDATE_NUM";  // 글 삭제후 번호를 당기기 위한 action
const BOARD_LIST = 'LIST';

// actions 생성
export const login = createAction(LOGIN);
export const logout = createAction(LOGOUT);
export const login_email = createAction(LOGIN_EMAIL);
export const isUploading = createAction(IS_UPLOADING);
export const isFavorite = createAction(IS_FAVORITE);
export const board_save = createAction(BOARD_SAVE);
export const board_remove = createAction(BOARD_REMOVE);
export const board_update = createAction(BOARD_UPDATE);
export const board_update_num = createAction(BOARD_UPDATE_NUM);
export const board_list = createAction(BOARD_LIST);

export const firebase_login = (email, pw) =>{
    return firebaseAuth.signInWithEmailAndPassword(email, pw);
  }
  export function firebase_logout () {
    return (dispatch) => {
      firebaseAuth.signOut();
      dispatch(logout());
    }  
  }
  
  export const firebase_register = (email, pw) =>{
    return firebaseAuth.createUserWithEmailAndPassword(email, pw).then(function() {
      var uid = firebaseAuth.currentUser.uid;
      var user = {
        uid: uid,
        userid: email,
        usernm: email,
        usermsg: ''
      };
      firestore.collection('users').doc(uid).set(user);
      login(uid, email);
    })
  }

export const firestore_board_save = (data) => {
    return (dispatch, getState) => {
        const doc=firestore.collection("boards").doc();
        const nowDate =new Date();
        const dd = nowDate.getDate();
        const mm = nowDate.getMonth()+1;
        const yyyy = nowDate.getFullYear();
        const obj={
            ...data,
            id: doc.id,
            date: nowDate,
            visibleDate: mm+"월 "+dd+"일 "+yyyy+"년"
        };  
        // data.id=doc.id;
        // data.date=Date.now();
        return doc.set(obj).then(() => {
            dispatch(board_save(obj));
        })
    }
}

export const firestore_board_remove = (itemId) => {
    return (dispatch) => {
        return firestore.collection("boards").doc(itemId).delete().then(() => {
            dispatch(board_remove(itemId));
        })
    }
}

export const firestore_board_list = (email) => {
    return (dispatch) => {
        if(typeof(email) == "undefined") {
            email="";
        }
        return firestore.collection("boards").where("email", "==", email).orderBy("date", "desc").get().then((querySnapshot) => {
            let rows=[];
            querySnapshot.forEach((doc) => {
                rows.push(doc.data());
            });
            dispatch(board_list(rows));
        });
    }
}

export const firestore_board_update = (obj) => {
    return (dispacth) => {
        return firestore.collection("boards").doc(obj.id).update({ 
            title: obj.title,
            writer: obj.writer
        }).then(() => {
            dispacth(board_update(obj));
        })
    }
}

export const firestore_board_isFavorite = (obj) => {
    return (dispacth) => {
        return firestore.collection("boards").doc(obj.id).update({ 
            isFavorite: obj.isFavorite
        }).then(() => {
            dispacth(isFavorite(obj));
        })
    }
}

// 초기 state
const initialState ={
    uid: null,
    boards: [],
    isUploading: false,
    email: null
};

// actions 정의
export default handleActions({
    [LOGIN]: (state, { payload: uid}) => {
        return {...initialState, uid: uid};
    },
    [LOGOUT]: () => {
        return initialState;
    },
    [BOARD_SAVE]: (state, {payload: obj}) => {
        let boards = state.boards;
        return {...state, boards: boards.concat(obj)}
    },
    [BOARD_REMOVE]: (state, {payload: itemId}) => {
        let boards = state.boards;
        return {...state, boards: boards.filter(boards => boards.id !== itemId)}
    },
    [BOARD_UPDATE]: (state, { payload: data}) => {
        let boards = state.boards;
        return {boards: boards.map(board => board.id === data.id ? ({...board, title: data.title, email: data.email, content: data.content}): board)}
    },
    [BOARD_LIST]: (state, {payload: data}) => {
        return {...state, boards: data}
    },
    [LOGIN_EMAIL]: (state, {payload: data}) => {
        return {...state, email: data}
    },
    [IS_UPLOADING]: (state, {payload: data}) => {
        return {...state, isUploading: data}
    },
    [IS_FAVORITE]: (state, {payload: data}) => {
        let boards = state.boards;
        return {boards: boards.map(board => board.id === data.id ? ({...board, isFavorite: data.isFavorite}): board)}
    }
}, initialState);
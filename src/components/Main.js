import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Menu from './menu/Menu';
import BoardList from './BoardList2';
import BoardInsert from './BoardInsert';
import BoardDelete from './BoardDelete';
import CircularIndeterminate from './mycom/CircularIndeterminate';
import ItemMaps from './mycom/ItemMaps';
import Home from './Home';
import UserProfile from './UserProfile';
import SignIn from './SignIn'; 
import {login} from '../reducer/App_reducer';
import {firebaseAuth} from '../config/FirebaseConfig';
import {firestore_board_list} from '../reducer/App_reducer';
import { login_email } from '../reducer/App_reducer';
// css import
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: { 
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
    // height: 800,
    backgroundColor : '#FE929F',
  },
  toolbar: theme.mixins.toolbar,
           
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 0,
    paddingTop: 10,
    height: '105vh',    
    backgroundColor : '#FCD3D1',
  },
  typography: {
    useNextVariants: true,
  },
});

function PrivateRoute ({component: Component, uid, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => uid !==null
        ? <Component {...props} />
        : <Redirect to={{pathname: '/Home', state: {from: props.location}}} />}
    />
  )
}

function PublicRoute ({component: Component, uid, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => uid === null
        ? <Component {...props} />
        : <Redirect to='/' />}
    />
  )
}

class Main extends React.Component {

  componentDidMount () {
    if(localStorage.email != null ) {
      this.removeListener = firebaseAuth.onAuthStateChanged((user) => {
        if (user) {
            this.props.login(user.uid);
            this.props.firestore_board_list();      
            this.props.login_email(localStorage.email);     
        } else this.props.login(null);
      })
    }
  }

  componentWillUnmount () {
    this.removeListener()
  }
  
  render() {
    const { classes, uid } = this.props;
    return (
        <Router>
          <div className={classes.root}>
          <PublicRoute uid={uid} path="/Home" component={Home}/>
          { this.props.isUploading ? <CircularIndeterminate /> : "" }
            <Menu/>
              <main className={classes.content}>
              <div className={classes.toolbar} />
              <Switch>
                <PrivateRoute uid={uid} exact path="/" component={BoardList}/>
                <PrivateRoute uid={uid} path="/BoardList" component={BoardList}/>
                <PrivateRoute uid={uid} path="/BoardInsert" component={BoardInsert}/>
                <PrivateRoute uid={uid} path="/BoardDelete" component={BoardDelete}/>
                <PrivateRoute uid={uid} path="/ItemMaps/:addr" component={ItemMaps}/>
                <PrivateRoute uid={uid} path="/UserProfile" component={UserProfile}/>
                
                <PublicRoute uid={uid} path="/SignIn" component={SignIn}/>
                <PublicRoute uid={uid} component={NoMatch}/>
              </Switch>
            </main>
          </div>
        </Router>
    );
  }
}

const NoMatch = ({ location }) => (
  <div>
   
  </div>
);

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

let mapStateToProps = (state) => {
    return {
      uid: state.uid,
      boards: state.boards,
      isUploading: state.isUploading,
      email: state.email,
    };
}

const mapDispatchToProps = dispatch => ({
  login: uid => dispatch(login(uid)),
  firestore_board_list: () =>  dispatch(firestore_board_list()),
  login_email: email => dispatch(login_email(email)),
})

export default connect(mapStateToProps, mapDispatchToProps) (withStyles(styles)(Main));

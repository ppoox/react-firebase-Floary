import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { firestore, storage, firebaseAuth } from '../config/FirebaseConfig';
//import {show_snackbar} from '../reducer/App_reducer';
import imageTool from './mycom/ImageTool';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: '50px',
    width: 100,
    height: 40,
    backgroundColor: '#FE929F',
    color: '#FFF',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  button2: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: '50px',
    width: 120,
    height: 40,
    backgroundColor: '#FE929F',
    color: '#FFF',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  image: {
    width: 100, 
    height:100
  },
 
});

class UserProfile extends React.Component {
    state = {
        DialogOpen: false,
        userid: '', usernm: '', usermsg: '', userphoto: '', photourl: ''
    };

    componentDidMount() {
      const _this = this;
      firestore.collection("users").doc(this.props.uid).get()
          .then(doc => {
              const user = doc.data();
              _this.setState({
                  userid: user.userid, usernm: user.usernm, usermsg: user.usermsg, userphoto: user.userphoto, photourl: ''
              });

              if (!user.userphoto) return;
              
              storage.child('userPhoto/'+ user.userphoto).getDownloadURL()
                .then(function(url) {
                  _this.setState({photourl: url});                  
                }).catch(function(error) {
                  console.log(error);
                });              
          });
    }

    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
      };

    handleSubmit = (e) => {
        e.preventDefault();

        const user = this.state;
        let data = {
          userid: user.userid, usernm: user.usernm, usermsg: user.usermsg, userphoto: user.userphoto
        };
        const _this = this;

        if (this.photofile.value) {
          imageTool(this.photofile.files[0], (imageurl) =>  {
            storage.child('userPhoto/'+ this.props.uid).putString(imageurl.replace('data:image/jpeg;base64,',''), 'base64').then(function(snapshot ) {
              _this.setState({..._this.state, userphoto: _this.props.uid});
              data.userphoto = _this.props.uid;
        
              firestore.collection('users').doc(_this.props.uid).set(data);
  
              storage.child('userPhoto/'+ _this.props.uid).getDownloadURL()
                .then(function(url) {
                  _this.setState({photourl: url});                  
                })
            }); 
          })
        } else {
          firestore.collection('users').doc(this.props.uid).set(data);
        }
        //this.props.dispatch(show_snackbar({ message: 'Saved your input.', snackbarOpen: true }) );
    }

    handleDialogOpen = () => {
        this.setState({ DialogOpen: true });
    };
    
    handleDialogClose = () => {
        this.setState({ DialogOpen: false });
    };    

    handleDialogSave = () => {
        let pw1 = this.pw1.value.trim();
        let pw2 = this.pw2.value.trim();

        if (pw1==='') {alert("input your new password"); return;}
        if (pw2==='') {alert("input your conform password"); return;}
        if (pw1!==pw2) {alert("not match new password and conform"); return;}
       
        const _this = this;
        firebaseAuth.currentUser.updatePassword(pw1).then(function() {
            _this.setState({ DialogOpen: false});
            // _this.props.dispatch(show_snackbar({ message: 'Changed password.', snackbarOpen: true }) );
        }).catch(function(error) {
          alert(error);
        });
    };   

  render() {
    const { classes } = this.props;
    const { DialogOpen, photourl } = this.state;

    return (
      <div>
        <form className={classes.container} noValidate autoComplete="off" onSubmit={this.handleSubmit}>
          <input ref={(node) => this.photofile = node} accept="image/*" className={classes.input} style={{ display: 'none' }}  id="raised-button-file"  type="file"/>
          <label htmlFor="raised-button-file">
          <Tooltip title="click to Change">		  
          {photourl
            ?<img className={classes.image} src={photourl} alt="User"/>
            :<PersonIcon className={classes.image}/>
          }
          </Tooltip>
          </label>
          <TextField label="Email Address" className={classes.textField} value={this.state.userid} margin="normal" fullWidth/>
          <TextField label="Name" className={classes.textField} value={this.state.usernm} onChange={this.handleChange('usernm')} margin="normal" fullWidth/>
          <TextField label="Status Message" className={classes.textField} value={this.state.usermsg} onChange={this.handleChange('usermsg')} margin="normal" fullWidth/>

          <Button type="submit" variant="contained" color="primary" size="large" className={classes.button}>저장</Button>
          <Button variant="contained" className={classes.button2}  onClick={this.handleDialogOpen}>비밀번호 변경</Button>
        </form>

        <Dialog open={DialogOpen} onClose={this.handleClose} aria-labelledby="form-dialog-title" >
          <DialogTitle id="form-dialog-title">비밀번호 변경</DialogTitle>
          <DialogContent>
            <DialogContentText>
               please enter your new password to change.
            </DialogContentText>
            <TextField inputRef={(node) => this.pw1 = node} label="Password"type="password" fullWidth autoFocus/>
            <TextField inputRef={(node) => this.pw2 = node} label="Confirm" type="password" fullWidth/>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} color="primary">취소</Button>
            <Button onClick={this.handleDialogSave} color="primary">저장</Button>
          </DialogActions>
        </Dialog>
      </div>  
    );
  }
}

UserProfile.propTypes = {
  classes: PropTypes.object.isRequired,
};

let mapStateToProps = (state) => {
  return {
    uid: state.uid
  };
}

export default connect(mapStateToProps) (withStyles(styles)(UserProfile));
import React from 'react';
import SignIn from './SignIn';
// css import
import HomeImg from '../resources/home_image.jpg';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
//import { Animated } from 'react-animated-css';

const styles = theme => ({
    root: {
      flexGrow: 1,
      position: 'absolute',
      zIndex: 9999,
      width: '100%',
      height: '100%',
      backgroundImage: 'url('+HomeImg+')',
      textAlign: 'center',
      color: '#fff',
    },
  });
const startBtn = {
    marginTop: 30,
}
const h1 ={
    marginTop: '20%',
}

class Home extends React.Component {
    state = {
        open: false,
      };
      componentDidMount () {
      }
      handleClickOpen = () => {
        this.setState({ open: true });
      };
    
      handleClose = () => {
        this.setState({ open: false });
      };
    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                            {/* <Animated animationIn="fadeInDownBig" animationOut="fadeOut" isVisible={true}> */}
                                <h1 style={h1}>당신의 추억을 
                                <br />지금 기록해보세요!</h1>
                                <Button variant="outlined" color="inherit" size="large" onClick={this.handleClickOpen} style={startBtn}>
                                시작하기
                                </Button>
                            {/* </Animated> */}
                            <Dialog
                            open={this.state.open}
                            onClose={this.handleClose}
                            aria-labelledby="form-dialog-title" >
                            <SignIn handleClose={this.handleClose}/>
                            </Dialog>
                    </Grid>
                </Grid>
            </div>  
        )
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
export default withStyles(styles)(Home);
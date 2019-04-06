import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  root: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 9999,
    backgroundColor: '#cecece',
    opacity: 0.3,
    padding: 300,
    
  },
  progress: {
    //margin: theme.spacing.unit * 2,
  },
});

class CircularIndeterminate extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <CircularProgress className={classes.progress} size={150} color="secondary"/>
      </div>
    );
  }
}

CircularIndeterminate.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CircularIndeterminate);
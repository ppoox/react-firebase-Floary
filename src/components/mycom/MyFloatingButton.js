import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit * 2,
  },
  absolute: {
    position: 'absolute',
    bottom: theme.spacing.unit * 4,
    right: theme.spacing.unit * 4,
  },
});

function MyFloatingButton(props) {
  const { classes } = props;
  return (
    <div>
      <Tooltip title="new Post">
        <Fab color="secondary" className={classes.absolute} onClick={props.handleClick}>
          <AddIcon />
        </Fab>
      </Tooltip>
    </div>
  );
}

MyFloatingButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MyFloatingButton);
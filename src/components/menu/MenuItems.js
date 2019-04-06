import React from 'react';
import {NavLink} from 'react-router-dom' 
import PropTypes from 'prop-types';
// css import
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PhotoIcon from '@material-ui/icons/Photo';
import PersonIcon from '@material-ui/icons/Person';

const styles = theme => ({
  item: {
     textDecoration: 'none'
  }
});

function MenuItems(props) {
  const { classes } = props;
  return (
  <div>
    <NavLink to="/BoardList" className={classes.item} activeClassName="active">    
        <ListItem button>
          <ListItemIcon>
            <PhotoIcon />
          </ListItemIcon>
          <ListItemText primary="사진첩" />
        </ListItem>
    </NavLink>
    <NavLink to="/UserProfile" className={classes.item} activeClassName="active">    
        <ListItem button >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="회원정보" />
        </ListItem>
    </NavLink>
  </div>
  );
}

MenuItems.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuItems);
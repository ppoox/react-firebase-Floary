import React from 'react';
import { firestore_board_remove } from '../../reducer/App_reducer';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
// import BoardDelete from '../BoardDelete';
// css import
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    IconStyle: {
        //color: grey[200],
    }
});

const options = [
  '삭제',
  '수정',
];

const ITEM_HEIGHT = 48;

class ItemMenu extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleItemMenu = (option) => {
    if(option === '삭제') {
      this.props.dispatch(firestore_board_remove(this.props.itemId));
      this.setState({ anchorEl: null });
    }else if(option === '수정') {
      this.setState({ anchorEl: null });
    }
    
  }

  render() {
    const {classes} = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    return (
      <div>
        <IconButton
          aria-label="More"
          aria-owns={open ? 'long-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
          className={classes.IconStyle}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={this.handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.0,
              width: 150,
            },
          }}
        >
          {options.map(option => (
            <MenuItem key={option} onClick={()=>this.handleItemMenu(option)}>
              {option}
            </MenuItem>
            
          ))}
        </Menu>
      </div>
    );
  }
}

export default connect()(withStyles(styles)(ItemMenu));
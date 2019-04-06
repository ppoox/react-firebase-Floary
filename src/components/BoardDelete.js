import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class DeleteBoard extends React.Component {
  state = {
    open: true,
  };

//   handleClickOpen = () => {
//     this.setState({ open: true });
//   };

  handleClose = () => {
    this.setState({ open: false });
    this.props.history.push("/BoardList");
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Floary"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              게시글을 정말 삭제하시겠습니까?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              아니오
            </Button>
            <Button onClick={this.handleDelete} color="primary" autoFocus>
              예
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default DeleteBoard;
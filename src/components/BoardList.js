import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ItemMenu from './mycom/ItemMenu';
// css import
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
//import DeleteIcon from '@material-ui/icons/Close';
import pink from '@material-ui/core/colors/pink';
import Typography from '@material-ui/core/Typography';
import MyFloatingButton from './mycom/MyFloatingButton';
import grey from '@material-ui/core/colors/grey';

const styles = theme => ({
    root: {
      flexGrow: 1,
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
      backgroundColor : pink[100],
    },
    title: {

    },
    gridList: {
      // width: 900,
      // height: 725,
    },
    gridListTile: {
      margin: 0,
    },
    deleteIcon: {
      color: grey[200],
    },
  });

// Table에서의 actions들을 담은 class
class TitlebarGridList extends React.Component {
  state={
      cols:2,
      email: "",
  }

  // componentDidMount() {
  //   let thisBind=this;

  //   // 화면 크기 조정에 따른 cols값 수정
  //   window.addEventListener("resize", function(e) {
  //       let width = e.target.innerWidth;
  //       if(width >= 960) {
  //         thisBind.setState({
  //           cols: 2,
  //         }) 
  //       }else if (width < 960) {
  //         thisBind.setState({
  //           cols: 1,
  //         }) 
  //       }
  //   });
  // }

  render() {
    const { classes } = this.props;
    return (
        <div className={classes.root}>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <GridList cellHeight={400} className={classes.gridList} spacing={20}>
              <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }} className={classes.gridListTile} >
                <ListSubheader component="div"> 
                  <Typography component="h1" variant="display1" color="inherit" noWrap className={classes.title}>
                    사진첩
                  </Typography>
                </ListSubheader>
              </GridListTile>
              {this.props.boards.map((tile, index) => (
                <GridListTile key={index} >
                  <img src={tile.imgUrl} alt={tile.title} />
                  <GridListTileBar
                    title={tile.title}
                    subtitle={<span>by: {tile.email}</span>}
                    actionIcon={
                    <ItemMenu>
                       {/* <Link to="/BoardDelete"><DeleteIcon className={classes.deleteIcon}/></Link> */}
                    </ItemMenu>
                    }
                  />
                </GridListTile>
               ))}
            </GridList>
            <Link to="/BoardInsert" ><MyFloatingButton /></Link>
            </Grid>
          </Grid>
        </div>
    );
  }
}
  
TitlebarGridList.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  const mapStateToProps = (state) => {
    return {
      boards: state.boards,
      uid: state.uid,
      email: state.email,
    }
  }

export default connect(mapStateToProps)(withStyles(styles)(TitlebarGridList));
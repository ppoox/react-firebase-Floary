import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ItemMenu from './mycom/ItemMenu';
import { firestore_board_isFavorite } from '../reducer/App_reducer';
// css import
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MyFloatingButton from './mycom/MyFloatingButton';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
//import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import PersonIcon from '@material-ui/icons/Person';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing.unit*2,
    marginLeft: theme.spacing.unit*2,
  },
  gridList: {
    width: 1000,
    height: 725,
  },
  grid: {
    marginBottom: theme.spacing.unit*3,
  },
  card: {
    marginLeft: theme.spacing.unit*1,
    marginRight: theme.spacing.unit*1,
    maxWidth: 300,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    // backgroundColor: red[500],
  },
  favorIcon: {
    color: "#fff",
  },
});

// Table에서의 actions들을 담은 class
class TitlebarGridList extends React.Component {
  state={
      cols:2,
      email: "",
      expanded: false,
  }
  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  componentDidMount() {
    // 스크롤링 이벤트 추가
    // window.addEventListener("scroll", this.handleScroll);
  }
  componentWillUnmount() {
    // 언마운트 될때에, 스크롤링 이벤트 제거
    // window.removeEventListener("scroll", this.handleScroll);
  }

  // handleScroll = () => {
  //   const { innerHeight } = window;
  //   const { scrollHeight } = document.body;
  //   // IE에서는 document.documentElement 를 사용.
  //   console.log(innerHeight);
  //   console.log(scrollTop);
  //   const scrollTop =
  //     (document.documentElement && document.documentElement.scrollTop) ||
  //     document.body.scrollTop;
  //   // 스크롤링 했을때, 브라우저의 가장 밑에서 100정도 높이가 남았을때에 실행하기위함.
  //   if (scrollHeight - innerHeight - scrollTop < 100) {
  //     console.log("Almost Bottom Of This Browser");
  //   }
  // };

  handleFavoriteBtn = (id, isFavorite) => {
    const obj = {
      id: id,
      isFavorite: isFavorite,
    }
    this.props.dispatch(firestore_board_isFavorite(obj));
  }

  render() {
    const { classes } = this.props;
    
    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <GridList cellHeight={400} className={classes.gridList} spacing={8}>
            {this.props.boards.map((card, index) => (
              <Grid item xs={12} md={4} key={index} className={classes.grid}>
              <Card className={classes.card}>
              <CardHeader
                avatar={
                  <Avatar aria-label={index} className={classes.avatar}>
                    <PersonIcon />
                  </Avatar>
                }
                action={
                  <ItemMenu itemId={card.id}>
                    <MoreVertIcon />
                  </ItemMenu>
                }
                title={card.title}
                subheader={card.visibleDate}
              />
              <CardMedia
                className={classes.media}
                image={card.imgUrl}
                title={card.title}  // 마우스 가져다 대면 나오는 타이틀
              />
              <CardContent>
                <Typography component="p">
                  {card.content}
                </Typography>
              </CardContent>
              <CardActions className={classes.actions} disableActionSpacing>
                {card.isFavorite ? 
                  <IconButton aria-label="Add to favorites" onClick={()=>this.handleFavoriteBtn(card.id, false)}>
                    <FavoriteIcon color="secondary"/>
                  </IconButton>
                : <IconButton aria-label="Add to favorites" onClick={()=>this.handleFavoriteBtn(card.id, true)}>
                    <FavoriteIcon />
                  </IconButton>
                }
                <IconButton aria-label="Share">
                  <ShareIcon />
                </IconButton>
                { card.addr !== "" ?  
                <IconButton aria-label="maps">
                  <Link to={'/ItemMaps/'+card.addr}>
                    <i className="material-icons">
                      place
                    </i>
                  </Link>
                </IconButton> : ""
                }
                {/* <IconButton
                  className={classnames(classes.expand, {
                    [classes.expandOpen]: this.state.expanded,
                  })}
                  onClick={this.handleExpandClick}
                  aria-expanded={this.state.expanded}
                  aria-label="Show more"
                >
                  <ExpandMoreIcon />
                </IconButton> */}
              </CardActions>
              <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography paragraph>
                  
                  </Typography>
                  <Typography paragraph>
                    문단2
                  </Typography>
                  <Typography>
                    문단3
                  </Typography>
                </CardContent>
              </Collapse>
              </Card>
              </Grid>
            ))}
          </GridList>
        </Grid>
        
        <Link to="/BoardInsert" ><MyFloatingButton /></Link>
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
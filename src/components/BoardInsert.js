/*global daum*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {firestore_board_save, isUploading} from '../reducer/App_reducer';
import firebase from '../config/FirebaseConfig';
import { Link } from 'react-router-dom';
// css import
import Button from '@material-ui/core/Button';
import NoImage from '../resources/no_image.png';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    root: {
        marginLeft: '10%',
        width: '60%',
        height: '110vh',
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: '100%',
    },
    dense: {
        marginTop: 10,
    },
    menu: {
        width: 200,
    },
    fileName: {
        display: 'inline-block',
        marginLeft: 20,
        marginBottom: 10,
    },
    buttonCss: {
        width: 100,
        height: 40,
        backgroundColor: '#FE929F',
        color: '#FFF',
        fontWeight: 'bold',
        textDecoration: 'none',
        marginBottom: 15,
    },
});


class BoardInsert extends Component{
    state = {
        files:[],
    }
    componentDidMount() {
        document.getElementById('file').style.opacity=0;
        document.getElementById('showImg').style.cursor="pointer";
    }

    handleImageClick = () => {
        document.getElementById('file').click();
    }

    // 파일 인풋 변경
    handleFileChange = (event) => {
        var files = event.target.files;
        const fileType=files[0].type.split("/");

        if(fileType[0] !== "image") {
            alert("image 형식이 아닙니다.");
            return false
        }
        
        if (FileReader && files && files.length) {
            var fr = new FileReader();
    
            fr.onload = function () {
                document.getElementById('showImg').src = fr.result;
            }
            fr.readAsDataURL(files[0]);
            // 이미지 리사이징 실행
            //this.handleImgResizing();
            document.getElementById('fileName').innerHTML=files[0].name;
        }
    }

    // 이미지 리사이징 (사용 x)
    handleImgResizing = () => {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        var img = new Image();
        
        img.onload = function () {
            // set size proportional to image
            canvas.height = canvas.width * (img.height / img.width);
            
            // step 1 - resize to 50%
            var oc = document.createElement('canvas'),
                octx = oc.getContext('2d');
            oc.width = img.width * 0.5;
            oc.height = img.height * 0.5;
            octx.drawImage(img, 0, 0, oc.width, oc.height);

            // step 2
            octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);

            // step 3, resize to final size
            ctx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5,
            0, 0, canvas.width, canvas.height);
        }
        // const img=require('../resources/no_image.png');
        img.src=document.getElementById('showImg').src;
    }

    insertAddrBtn = () => {
        new daum.Postcode({
            oncomplete: function(data) {
                document.getElementById("addr").value=data.address;
            }
        }).open();
    }

    // 글 등록 ( 폼 전송 )
    insertSubmit= (e) => {
        e.preventDefault();
        
        const title = e.target.title.value;
        const addr = e.target.addr.value;
        const content = e.target.content.value;
        const email = this.props.email
        const file=e.target.file.files[0];

       if(title === "") {
            alert("제목을 입력해주세요.");
            return false;
        }else if(content === "") {
            alert("내용을 입력해주세요.");
        }else if(typeof(file) == 'undefined') {
            alert("등록된 사진이 없습니다.");
            return false;
        }

        const reader = new FileReader();
        reader.onloadend = (e) => {
            this.props.dispatch(isUploading(true));

            const blob = new Blob([e.target.result], { type: file.type });
            const storageUrl = 'images/'+file.name;
            const storageRef = firebase.storage().ref(storageUrl);
            const uploadTask = storageRef.put(blob);

            // 업로드시 진행률에 따른 변화를 감지하기위한 이벤트
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, 
            (snapshot) => {
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        //console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        //console.log('Upload is running');
                        break;
                }
            }, (error) => {
                switch (error.code) {
                    case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;

                    case 'storage/canceled':
                    // User canceled the upload
                    break;

                    case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
                }
            }, () => {
                // 로드가 성공적으로 완료되면 이때부터 다운로드 url을 가져올수 있음
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                 
                    const obj={
                        name:file.name,
                        storageUrl:'images/'+file.name
                    }
                    this.setState({
                        files:this.state.files.concat(obj)
                    })
                    const data={
                        title: title,
                        content: content,
                        email: email,
                        addr: addr,
                        imgUrl: downloadURL,
                    }

                    this.props.dispatch(firestore_board_save(data));
                    this.props.dispatch(isUploading(false));
                    this.props.history.push("/BoardList");
                });
            });
        }
        reader.onerror = (e) => {
            //console.log("Failed file read: " + e.toString());
        };
        reader.readAsArrayBuffer(file);
    }

    render(){
        const { classes } = this.props;
        return(
            
            <div className={classes.root} id="insertDiv">
                <form onSubmit={this.insertSubmit}>
                   <span><h3>게시글 작성</h3></span>
                    <TextField
                    id="title"
                    label="제목"
                    className={classes.textField}
                    type="title"
                    name="title"
                    autoComplete="제목"
                    margin="normal"
                    variant="filled"
                    />
                    <br />
                    <TextField
                    id="content"
                    label="내용"
                    className={classes.textField}
                    type="content"
                    name="content"
                    autoComplete="내용"
                    margin="normal"
                    variant="filled"
                    />
                    <br />
                    <p>주소를 등록하시면 추억의 장소를 지도에서 확인하실 수 있습니다.</p>
                    <Button className={classes.buttonCss} variant="contained" type="button" onClick={this.insertAddrBtn}>주소 등록</Button>
                    <input type="hidden" name="addr" id="addr" defaultValue=""/>
                    <br />
                    <img src={NoImage} width="40%" height="33%" id="showImg" onClick={this.handleImageClick} alt="for upload" />
                    <strong className={classes.fileName}>파일이름 : </strong><p id="fileName" className={classes.fileName}></p>
                    <input type="file" name="file" id="file" onChange={this.handleFileChange}/>
                    <br />
                    <Button className={classes.buttonCss} variant="contained" type="submit">저장</Button>
                    &nbsp; &nbsp; &nbsp; 
                    <Link to="/BoardList"><Button className={classes.buttonCss} variant="contained" type="button">취소</Button></Link>
                    {/* <canvas id="canvas" src={NoImage}></canvas> */}
                </form>
            </div>
        )
    }
}

// BoardInsert.propTypes = {
//     data: PropTypes.object.isRequired,
//     title: PropTypes.string.isRequired,
//     email: PropTypes.textarea.isRequired
// };

const mapStateToProps = (state) => {
    return {
        isUploading: state.isUploading,
        email: state.email,
    }
  }
export default connect(mapStateToProps)(withStyles(styles)(BoardInsert));
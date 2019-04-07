## React_Firebase_Floary

### Floary

React와 Firebae를 이용하여 삶의 흐름을 이미지로 담아나가는 사진 다이어리      

### React

router를 이용한 페이지 이동, redux를 이용한 state 상태 관리, ducks방식의 reducer

필요한 설치 : react-router-dom, react-redux, redux-logger, redux-thunk       
           
### Material-UI

google에서 제공하는 UI로 react와 잘 어울린다

필요한 설치 : @material-ui/core, @material-ui/icons       
         
### Firebase

firebase와 연결하여 firebase에서 제공하는 Authentication을 이용하여 로그인한다.

일반 데이터는 firestore에 저장되고 파일의 경우 firebasse storage에 저장된다.

또한 firebase에서 제공하는 hosting 기능을 통하여 build 및 배포를 하고 있다.
         
### API

(1) 주소를 입력받기 위해 카카오 주소 API를 사용하고 있다.

(2) 입력받은 주소를 지도에 나타내기 위해 카카오 지도 API를 사용하고 있다.


### 현재 구현되어 있는 기능

회원가입/로그인, 사진첩 등록/삭제, 주소API, 이미지 파일 업로드, 좋아요, 지도API, 회원정보 조회
            
### 구현 해야할 기능

회원가입 폼 추가, 사진첩 수정, 회원정보 프로필 이미지, 반응형 디테일, 더미 컴포넌트와 기능 컴포넌트 분리
            


edit. v001 2019-04-07

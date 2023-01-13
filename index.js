const express = require("express");
const app = express();
const ejs = require("ejs");
const fs = require("fs");

let posts = []; // 글 데이터

// 파일 읽기
const readFile = fs.readFileSync("postDB.json", "utf-8");
// 오브젝트 코드로 변환
//읽은 json 파일을 문자로 알아볼 수 있게 변환

const jsonData = JSON.parse(readFile);
console.log(jsonData);
// DB.json --> 배열 읽음
posts = [...jsonData];
// 빈 배열 = json 파일 추가됨 / [...] < '...' = 숨겨진 배열 대신 쓰기
// postS에 배열값 추가

// ejs를 view 엔진으로 설정
app.set("view engine", "ejs");

// 정적파일 경로 지정,  express를 사용하기 위해 필요한 코드
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우팅(경로 연결)을 해줘야 화면에 나타남
// home
app.get("/", function (요청, 응답) {
  응답.render("pages/index.ejs", { posts });
  // {} < 여기 index.js에서 선언한 변수 < 쓰기 위해서 프엔으로 보내주기
});

// about
app.get("/about", function (req, res) {
  res.render("pages/about.ejs");
});

// 글쓰기 요청 /create
app.post("/create", function (req, res) {
  // const 변수 = req.body.input에서 name명 적기(name=서버에 보낼 이름)
  const 글 = req.body.post;
  posts.push(글); // posts 배열에 글 추가
  console.log("posts = ", posts);
  // 배열을 DB로 바꿔서 읽어줌
  // DB file에 글 저장
  fs.writeFileSync("postDB.json", JSON.stringify(posts));
  res.redirect("/"); // 홈으로 이동
});

// 글 삭제 요청 / delete
// form의 action 값과 일치하는 라우팅을 만들었다. /delete/:id 를 사용하면 :id 자리에 들어오는 숫자 값이 req.params.id의 값으로 전달된다.
app.post("/delete/:id", function (req, res) {
  const id = req.params.id;
  console.log(id);
  // 이제 posts 배열의 특정 배열의 값을 삭제한다. 그 다음에  fs.writeFileSync("postDB.json", JSON.stringify(posts));  와   res.redirect("/");  를 함수에 적용하여 DB 문서에도 삭제된 posts 정보를 반영하면 된다.
  posts.splice(id, 1);
  fs.writeFileSync("postDB.json", JSON.stringify(posts));
  res.redirect("/");
});

// 서버 연결
const port = 3001;
app.listen(port, () => {
  console.log(`server running at ${port}`);
});
// 서버 연결할 때, 라이브 서버X / 주소창에 localhost:port번호 입력 / 새로고침 / nodemon으로 실시간 수정되는거 보기

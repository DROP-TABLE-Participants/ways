<p align="center">
    <img alt="logo" width=300px src="https://github.com/DROP-TABLE-Participants/ways/assets/63718749/94226c23-004a-41e0-abad-fa1f5b5dbfd0">
</p>

<h1 align="center">Team Drop Table Participants</h1>

<p align = "center">
    <img alt="GitHub contributors" src="https://img.shields.io/github/contributors/DROP-TABLE-Participants/ways?style=for-the-badge">
    <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/DROP-TABLE-Participants/ways?style=for-the-badge">
    <img src="https://img.shields.io/github/languages/count/DROP-TABLE-Participants/ways?style=for-the-badge">
</p>

## 💻 About
<h2 align="center">Ways - Organized shopping</h2>

## 🗂️ Tech Stack:
### Front-end
<p align="left">
    <a href="https://react.dev/"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png" alt="React logo" width=48px /></a>
    <a href="https://sass-lang.com/"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Sass_Logo_Color.svg/1280px-Sass_Logo_Color.svg.png" alt="SASS logo" width=48px /></a>
    <a href="https://threejs.org/"><img src="https://global.discourse-cdn.com/standard17/uploads/threejs/original/2X/e/e4f86d2200d2d35c30f7b1494e96b9595ebc2751.png" alt="Three.js logo" width=48px /></a>
</p>

### Back-end
<p align="left">
    <a href="https://www.python.org/"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1869px-Python-logo-notext.svg.png" alt="Python logo" width=48px /></a>
    <a href="https://fastapi.tiangolo.com/"><img src="https://cdn.worldvectorlogo.com/logos/fastapi.svg" alt="FastApi logo" width=48px /></a>
    <a href="https://www.postgresql.org/"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/993px-Postgresql_elephant.svg.png" alt="PostgreSQL logo" width=48px /></a>
    <a href="https://redis.io/"><img src="https://www.svgrepo.com/show/303460/redis-logo.svg" alt="Redis logo" width=48px /></a>
</p>

### Miscellaneous
<p align="Left">
    <a href="https://code.visualstudio.com/"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/1024px-Visual_Studio_Code_1.35_icon.svg.png" alt="VS code logo" width=48px /></a>
    <a href="https://www.jetbrains.com/pycharm/"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/PyCharm_Icon.svg/1200px-PyCharm_Icon.svg.png" alt="PyCharm logo" width=48px /></a>
    <a href="https://github.com/"><img src="https://img.icons8.com/nolan/344/github.png" alt="GitHub logo" width=52px /></a>
    <a href="https://azure.microsoft.com/en-us/"><img src="https://img.icons8.com/fluency/344/azure-1.png" alt="Azure logo" width=48px /></a>
    <a href="https://www.figma.com/"><img src="https://img.icons8.com/color/344/figma--v1.png" alt="Figma logo" width=48px/></a>
    <a href="https://www.docker.com/"><img src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/97_Docker_logo_logos-512.png" alt="Docker logo" width=48px /></a>
    <a href="https://swagger.io/"><img src="https://static-00.iconduck.com/assets.00/swagger-icon-1024x1024-09037v1r.png" alt="Swagger logo" width=48px /></a>
</p>

## Our Team 👨‍💻 <a name = "team"></a>
Stoyan Ivanov, Kalin Chervenkov, Atanas Pozharliev, Boris Savov, Yoanna Simeonova

## 📥 Installation & Set Up
<p> To install our project on your machine you just need to clone it and run it using docker and npm</p>

<hr>

<h3><B>Cloning the repository:</B></h3>

Pasting this line of code in **your favourite Terminal**:
<pre>git clone https://github.com/DROP-TABLE-Participants/ways.git</pre>
<p>You have successfully cloned the repository! 🥳</p>

<hr>

<h3><B>Running the App:</B></h3>

<pre>
docker compose up

# Running the migrations
docker-compose exec server poetry run aerich init -t data.data.TORTOISE_ORM

docker-compose exec server poetry run aerich migrate
docker-compose exec server poetry run aerich upgrade
</pre>
<pre>
cd client
npm install
npm run dev
</pre>


<pre>
Frontend is at localhost:CLIENT_PORT
Backend is at localhost:SERVER_PORT
</pre> 
<hr>

<h3><B>Website domain:</B></h3>

<pre>https://ways.codingburgas.bg/</pre>

<hr>

<p>You have successfully accessed our app! 👏👏👏</p>

<hr>

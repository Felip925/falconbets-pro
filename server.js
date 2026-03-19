const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let users = [];
let games = [];

// 🧠 TIMES REAIS
const teams = [
  "Flamengo","Palmeiras","Corinthians","São Paulo",
  "Barcelona","Real Madrid","Manchester City","Liverpool",
  "PSG","Bayern Munich","Juventus","Chelsea"
];

// 🎲 GERAR JOGOS AUTOMÁTICOS
function generateGames(){
  games = [];

  for(let i=0; i<10; i++){
    let home = teams[Math.floor(Math.random()*teams.length)];
    let away = teams[Math.floor(Math.random()*teams.length)];

    if(home !== away){
      games.push({
        id: i+1,
        home,
        away,
        odd: (Math.random()*2+1).toFixed(2)
      });
    }
  }

  console.log("Jogos atualizados 🔥");
}

// atualiza a cada 30 segundos
setInterval(generateGames, 30000);
generateGames();

// ROTAS
app.get("/", (req,res)=>{
  res.send("Falconbets rodando 🦅");
});

app.get("/games",(req,res)=> res.json(games));

app.post("/register",(req,res)=>{
  users.push({ username:req.body.username, balance:100 });
  res.json({ ok:true });
});

app.post("/bet",(req,res)=>{
  const { username, amount, gameId } = req.body;

  let user = users.find(u=>u.username===username);
  let game = games.find(g=>g.id===gameId);

  if(!user || !game) return res.sendStatus(400);
  if(user.balance < amount) return res.send("Saldo insuficiente");

  user.balance -= amount;
  res.json({ ok:true, balance:user.balance });
});

app.listen(3000,()=>console.log("rodando"));

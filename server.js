const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

let users = [];
let games = [];

// 🔑 COLOQUE SUA API KEY AQUI
const API_KEY = "Dhcp1020@";

// BUSCAR JOGOS REAIS
async function updateGames(){
  try{
    const response = await axios.get("https://v3.football.api-sports.io/fixtures", {
      headers: {
        "x-apisports-key": API_KEY
      },
      params: {
        date: new Date().toISOString().split("T")[0]
      }
    });

    games = response.data.response.slice(0,10).map((g, i)=>({
      id: i+1,
      home: g.teams.home.name,
      away: g.teams.away.name,
      odd: (Math.random()*2+1).toFixed(2)
    }));

    console.log("Jogos atualizados:", games.length);

  } catch(e){
    console.log("Erro API:", e.message);
  }
}

// atualiza sempre
setInterval(updateGames, 60000);
updateGames();

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

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let users = [];

// ⚽ JOGOS
let games = [
  { id:1, league:"Champions League", home:"Real Madrid", away:"Manchester City", time:"16:00", odd:2.10 },
  { id:2, league:"Champions League", home:"Barcelona", away:"PSG", time:"16:00", odd:1.95 },
  { id:3, league:"Brasileirão", home:"Flamengo", away:"Palmeiras", time:"21:30", odd:2.30 },
  { id:4, league:"Brasileirão", home:"Corinthians", away:"São Paulo", time:"18:30", odd:2.00 }
];

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

// 👑 ADMIN
const ADMIN_PASSWORD = "123456";

app.post("/admin/login",(req,res)=>{
  if(req.body.password === ADMIN_PASSWORD){
    return res.json({ ok:true });
  }
  res.status(401).send("Senha errada");
});

app.get("/admin/users",(req,res)=>{
  res.json(users);
});

app.post("/admin/balance",(req,res)=>{
  const { username, amount } = req.body;

  let user = users.find(u=>u.username===username);
  if(!user) return res.send("Usuário não encontrado");

  user.balance += Number(amount);
  res.json({ ok:true, balance:user.balance });
});

app.post("/admin/odd",(req,res)=>{
  const { gameId, odd } = req.body;

  let game = games.find(g=>g.id===gameId);
  if(!game) return res.send("Jogo não encontrado");

  game.odd = odd;
  res.json({ ok:true });
});

// 🚀 FINAL (ESSENCIAL)
app.listen(3000,()=>console.log("rodando"));

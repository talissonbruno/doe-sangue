// configurando o servidor
const express = require("express")
const server = express()

//configurar o servidor para apresentar arquivos estaticos
server.use(express.static('public'))

//habilitar body do formulario
server.use(express.urlencoded({extended:true}))

//configurar a conexao com banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'bruno',
    host:'localhost',
    port: 5432,
    database: 'doe'
})

//configurado a  template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,//boolean ou booleano aceita 2 valores, verdadeiro ou falso
})
// lista de doadores: vetor ou array
 /*const donors = [
    {
        name: "Diego Fernando",
        blood: "AB+"
    },
    {
        name: "Cleiton Souza",
        blood: "B+"
    },
    {
        name: "Robson Marques",
        blood: "O+"
    },
    {
        name: "Maryk Brito",
        blood: "A-"
    },
]*/

//configurar a presentação da pagina 
server.get("/", function(req, res) {
    db.query("SELECT * FROM donors", function(err, result){
        if(err) return res.send("Erro de banco de dados.")

        const donors = result.rows;
        return res.render("index.html", {donors})
    })
})

server.post("/", function(req, res){
    //pegar dados  do formulario.
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name  =="" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatorios.")
    }
   
    //coloca valores dentro do banco de dados
    const query = `INSERT INTO donors ("name","email","blood") VALEUS ($1, $2, $3);` 
	
    const values = [name, email, blood]

    db.query(query, values, function(err){
        //fluxo de erro
        if (err) return res.send("Erro no banco de dados.")

        //fluxo ideal
        return res.redirect("./") 
    })
})

//ligar o servidor e  permitir o acesso na porta 3000
server.listen(3000, function(){
    console.log("Iniciei o servidor")
})
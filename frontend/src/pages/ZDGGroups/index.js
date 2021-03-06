import React, { useEffect, useState } from "react";
import openSocket from "socket.io-client";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Tabs from "../../components/Tabs";
import './index.css';

const http = require('https');

const init = {
  host: process.env.REACT_APP_BACKEND_URL.split("//")[1],
  path: '/zdgGroups',
  method: 'POST',
  headers: {
    'content-type': 'application/json; charset=utf-8'
  }
};

const init2 = {
	host: process.env.REACT_APP_BACKEND_URL.split("//")[1],
	path: '/zdgGroupsDescription',
	method: 'POST',
	headers: {
	  'content-type': 'application/json; charset=utf-8'
	}
  };

const init3 = {
	host: process.env.REACT_APP_BACKEND_URL.split("//")[1],
	path: '/zdgGroupsCreate',
	method: 'POST',
	headers: {
	  'content-type': 'application/json; charset=utf-8'
	}
  };

const callback = function(response) {
  let result = Buffer.alloc(0);
  response.on('data', function(chunk) {
    result = Buffer.concat([result, chunk]);
  });
  
  response.on('end', function() {
    console.log(result.toString());
  });
};

async function ZDGSetGroups (subject, iD) {
	const req = http.request(init, callback);
	const body = '{"subject":"'+ subject + '","ticketwhatsappId":' + iD + '}';
	await req.write(body);
	req.end();
}

async function ZDGSetGroupsDescription (description, iD) {
	const req = http.request(init2, callback);
	const body = '{"description":"'+ description + '","ticketwhatsappId":' + iD + '}';
	await req.write(body);
	req.end();
}

async function zdgGroupsCreate (title, contact, iD) {
	const req = http.request(init3, callback);
	const contactWPP = contact + "@c.us";
	const body = '{"title":"' + title + '","contact":"' + contactWPP + '","ticketwhatsappId":' + iD + '}';
	await req.write(body);
	req.end();
}

const initGet = {
	host: process.env.REACT_APP_BACKEND_URL.split("//")[1],
	path: '/whatsappzdg'
  };
  
async function GETSender() {
	http.get(initGet, function(res) {
		res.on("data", function(wppID) {
		  alert("ID inst??ncia ativa: " + wppID) ;
		});
	  }).on('error', function(e) {
		alert("Erro: " + e.message);
	  });
}

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(4)
	},

	paper: {
		padding: theme.spacing(2),
		display: "flex",
		alignItems: "center",
	},

	settingOption: {
		marginLeft: "auto",
	},
	margin: {
		margin: theme.spacing(1),
	},
}));


const ZDGGroups = () => {
	const classes = useStyles();
	const [inputs, setInputs] = useState({});

	const handleChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setInputs(values => ({...values, [name]: value}))
	}
	
	const handleSubmit = (event) => {
		event.preventDefault();
		alert('Os dados est??o sendo atualizados! Clique ok para continuar...');
		if (inputs.titulo !== undefined && inputs.descricao === undefined && inputs.tituloNovo === undefined && inputs.contatoGrupo === undefined) {
			alert('Todos os t??tulos dos grupos que voc?? ?? admin est??o sendo atualizados! Aguarde...');
			setTimeout(function() {
				ZDGSetGroups(inputs.titulo, inputs.id);
				},5000 + Math.floor(Math.random() * 10000))
		}
		else if (inputs.titulo === undefined && inputs.descricao !== undefined && inputs.tituloNovo === undefined && inputs.contatoGrupo === undefined) {
			alert('Todos as descri????es dos grupos que voc?? ?? admin est??o sendo atualizados! Aguarde...');
			setTimeout(function() {
				ZDGSetGroupsDescription(inputs.descricao, inputs.id);
				},5000 + Math.floor(Math.random() * 10000))
		}
		else if (inputs.titulo !== undefined && inputs.descricao !== undefined && inputs.tituloNovo === undefined && inputs.contatoGrupo === undefined) {
			alert('Todos as descri????es e t??tulos dos grupos que voc?? ?? admin est??o sendo atualizados! Aguarde...');
			setTimeout(function() {
				ZDGSetGroupsDescription(inputs.descricao, inputs.id);
				},5000 + Math.floor(Math.random() * 10000))
			setTimeout(function() {
				ZDGSetGroups(inputs.titulo, inputs.id);
				},5000 + Math.floor(Math.random() * 10000))
		}
		else if (inputs.titulo === undefined && inputs.descricao === undefined && inputs.tituloNovo !== undefined && inputs.contatoGrupo !== undefined) {
			alert('Os grupos est??o sendo criados! Aguarde...');
			setTimeout(function() {
				zdgGroupsCreate(inputs.tituloNovo, inputs.contatoGrupo, inputs.id);
				},5000 + Math.floor(Math.random() * 10000))
		}
		else if (inputs.titulo === undefined && inputs.descricao === undefined && inputs.tituloNovo === undefined && inputs.contatoGrupo === undefined) {
			alert('Preencha os campos corretamente, nenhuma a????o foi executada.');
			return;
		}
	}
	
	useEffect(() => {
		const socket = openSocket(process.env.REACT_APP_BACKEND_URL);
		return () => {
			socket.disconnect();
		};
	}, []);

	return (
		<div className={classes.root}>  
			<Container className={classes.container} maxWidth="sm">
			<Tabs>
			<div label="Atualiza????o dos Grupos">
			<h1>Atualiza????o de Grupos</h1>
			<form onSubmit={handleSubmit}>
				<label>T??tulo<br/>
				<input 
					type="text" 
					name="titulo" 
					value={inputs.titulo || ""} 
					onChange={handleChange}
					//required="required"
				/>
				</label><br/><br/>
				<label>Descricao<br/>
				<input 
					type="text" 
					name="descricao" 
					value={inputs.descricao || ""} 
					onChange={handleChange}
					//required="required"
				/>
				</label><br/><br/>
				<label>ID de Disparo<br/>
				<input 
					type="text" 
					name="id" 
					value={inputs.id || ""} 
					onChange={handleChange}
					required="required"
				/>
				</label><br/><br/>	
				<input 
				style={{ color:"white", backgroundColor:"#2576d2", borderColor:"#2576d2", borderRadius: "4px", padding: "10px" }}
				type="button" 
				value="Mostrar ID de Disparo"
				onClick={GETSender}
				/>
				<br/><br/>	
				<input 
				style={{ color:"white", backgroundColor:"	#f50057", borderColor:"#f50057", borderRadius: "4px", padding: "10px" }}
				type="submit" 
				value="Atualizar Grupos"
				/>
			</form>
			</div>
			<div label="Cria????o dos Grupos">
			<h1>Cria????o de Grupos</h1>
			<form onSubmit={handleSubmit}>
				<label>T??tulo do Novo Grupo<br/>
				<input 
					type="text" 
					name="tituloNovo" 
					value={inputs.tituloNovo || ""} 
					onChange={handleChange}
				/>
				</label><br/><br/>
				<label>Contato da agenda a ser adicionado<br/>
				<input 
					type="text" 
					name="contatoGrupo" 
					value={inputs.contatoGrupo || ""} 
					onChange={handleChange}
				/>
				</label><br/><br/>
				<label>ID de Disparo<br/>
				<input 
					type="text" 
					name="id" 
					value={inputs.id || ""} 
					onChange={handleChange}
					required="required"
				/>
				</label><br/><br/>	
				<input 
				style={{ color:"white", backgroundColor:"#2576d2", borderColor:"#2576d2", borderRadius: "4px", padding: "10px" }}
				type="button" 
				value="Mostrar ID de Disparo"
				onClick={GETSender}
				/>
				<br/><br/>	
				<input 
				style={{ color:"white", backgroundColor:"	#f50057", borderColor:"#f50057", borderRadius: "4px", padding: "10px" }}
				type="submit" 
				value="Atualizar Grupos"
				/>
			</form>
			</div>
			</Tabs>
			</Container>
		</div>
	);
};

export default ZDGGroups;
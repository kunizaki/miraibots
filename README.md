[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/donate?business=VWW3BHW4AWHUY&item_name=Desenvolvimento+de+Software&currency_code=BRL)
[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B21084%2Fgithub.com%2Fcanove%2Fwhaticket.svg?type=shield)](https://app.fossa.com/projects/custom%2B21084%2Fgithub.com%2Fcanove%2Fwhaticket?ref=badge_shield)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=canove_whaticket&metric=alert_status)](https://sonarcloud.io/dashboard?id=canove_whaticket)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=canove_whaticket&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=canove_whaticket)
[![Discord Chat](https://img.shields.io/discord/784109818247774249.svg?logo=discord)](https://discord.gg/Dp2tTZRYHg)

# WhaBOT

**NOTA**: A nova versão do whatsapp-web.js exigia o Node 14. Atualize suas instalações para continuar usando.

Um Sistema de Tickets _muito simples_ baseado em mensagens do WhatsApp.

O backend usa [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) para receber e enviar mensagens do WhatsApp, criar tickets a partir deles e armazenar tudo em um banco de dados MySQL.

Frontend é um aplicativo _chat_ multi-usuário com recursos completos, inicializado com react-create-app e Material UI, que se comunica com o backend usando API REST e Websockets. Permite interagir com contatos, tickets, enviar e receber mensagens do WhatsApp.

**NOTA**: não posso garantir que você não será bloqueado usando este método, embora tenha funcionado para mim. O WhatsApp não permite bots ou clientes não oficiais em sua plataforma, portanto, isso não deve ser considerado totalmente seguro.

## Como funciona?

A cada nova mensagem recebida em um WhatsApp associado, um novo Ticket é criado. Então, esse ticket pode ser alcançado em uma _fila_ na página _Tickets_, onde você pode atribuir um ticket a você mesmo _aceitando-o, respondendo a mensagem de ticket e, eventualmente, _resolvendo-o_.

As mensagens subsequentes do mesmo contato serão relacionadas ao primeiro ticket **aberto/pendente** encontrado.

Se um contato enviar uma nova mensagem em menos de 2 horas de intervalo e não houver nenhum ticket desse contato com status **pendente/aberto**, o ticket mais recente **fechado** será reaberto, em vez de criar um novo .

## Screenshots

![](https://github.com/canove/whaticket/raw/master/images/whaticket-queues.gif)
<img src="https://raw.githubusercontent.com/canove/whaticket/master/images/chat2.png" width="350"> <img src="https://raw.githubusercontent.com/canove/whaticket/master/images/chat3.png" width="350"> <img src="https://raw.githubusercontent.com/canove/whaticket/master/images/multiple-whatsapps2.png" width="350"> <img src="https://raw.githubusercontent.com/canove/whaticket/master/images/contacts1.png" width="350">

## Recursos

- Tenha vários usuários conversando no mesmo número do WhatsApp ✅
- Conecte-se a várias contas do WhatsApp e receba todas as mensagens em um só lugar ✅ 🆕
- Crie e converse com novos contatos sem tocar no celular ✅
- Enviar e receber mensagem ✅
- Enviar mídia (imagens/áudio/documentos) ✅
- Receber mídia (imagens/áudio/vídeo/documentos) ✅

## Instalação e uso (Linux Ubuntu - Development)

Criar Mysql Database usando docker:
_Nota_: mude MYSQL_DATABASE, MYSQL_PASSWORD, MYSQL_USER and MYSQL_ROOT_PASSWORD.

```bash
docker run --name whaticketdb -e MYSQL_ROOT_PASSWORD=strongpassword -e MYSQL_DATABASE=whaticket -e MYSQL_USER=whaticket -e MYSQL_PASSWORD=whaticket --restart always -p 3306:3306 -d mariadb:latest --character-set-server=utf8mb4 --collation-server=utf8mb4_bin
```

Instale as dependências do puppeteer:

```bash
sudo apt-get install -y libxshmfence-dev libgbm-dev wget unzip fontconfig locales gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils
```

Clone este repositório

```bash
git clone https://github.com/canove/whaticket/ whaticket
```

Vá para a pasta back-end e crie o arquivo .env:

```bash
cp .env.example .env
nano .env
```

Preencha o arquivo `.env` com variáveis de ambiente:

```bash
NODE_ENV=DEVELOPMENT      #it helps on debugging
BACKEND_URL=http://localhost
FRONTEND_URL=https://localhost:3000
PROXY_PORT=8080
PORT=8080

DB_HOST=                  #DB host IP, usually localhost
DB_DIALECT=
DB_USER=
DB_PASS=
DB_NAME=

JWT_SECRET=3123123213123
JWT_REFRESH_SECRET=75756756756
```

Instale dependências de back-end, crie aplicativos, execute migrações e sementes:

```bash
npm install
npm run build
npx sequelize db:migrate
npx sequelize db:seed:all
```

Start backend:

```bash
npm start
```

Abra um segundo terminal, vá para a pasta frontend e crie o arquivo .env:

```bash
nano .env
REACT_APP_BACKEND_URL = http://localhost:8080/ # Your previous configured backend app URL.
```

Start frontend app:

```bash
npm start
```

- Vá para http://your_server_ip:3000/signup
- Crie um usuário e faça login com ele.
- Na barra lateral, acesse a página _Conexões_ e crie sua primeira conexão do WhatsApp.
- Aguarde o botão QR CODE aparecer, clique nele e leia o código qr.
- Feito. Todas as mensagens recebidas pelo seu número do WhatsApp sincronizado aparecerão na Lista de Ingressos.

## Implantação de produção básica (Ubuntu 18.04 VPS)

Todas as instruções abaixo assumem que você NÃO está executando como root, pois dará um erro no puppeteer. Então, vamos começar a criar um novo usuário e conceder privilégios sudo a ele:

```bash
adduser deploy
usermod -aG sudo deploy
```

Agora podemos fazer login com este novo usuário:

```bash
su deploy
```

Você precisará de dois subdomínios encaminhados para o ip do seu VPS para seguir estas instruções. Usaremos `myapp.mydomain.com` para frontend e `api.mydomain.com` para backend no exemplo a seguir.

Atualize todos os pacotes do sistema:

```bash
sudo apt update && sudo apt upgrade
```

Rode o comando Install do Node e confirme se o Node está disponível:

```bash
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v
```

Instale o docker e adicione seu usuário ao grupo do docker:

```bash
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
sudo apt update
sudo apt install docker-ce
sudo systemctl status docker
sudo usermod -aG docker ${USER}
su - ${USER}
```

Crie o banco de dados Mysql usando o docker:
_Note_: change MYSQL_DATABASE, MYSQL_PASSWORD, MYSQL_USER and MYSQL_ROOT_PASSWORD.

```bash
docker run --name whaticketdb -e MYSQL_ROOT_PASSWORD=strongpassword -e MYSQL_DATABASE=whaticket -e MYSQL_USER=whaticket -e MYSQL_PASSWORD=whaticket --restart always -p 3306:3306 -d mariadb:latest --character-set-server=utf8mb4 --collation-server=utf8mb4_bin
```

Clone este repositório:

```bash
cd ~
git clone https://github.com/canove/whaticket whaticket
```

Crie um arquivo .env de back-end e preencha com os detalhes:

```bash
cp whaticket/backend/.env.example whaticket/backend/.env
nano whaticket/backend/.env
```

```bash
NODE_ENV=
BACKEND_URL=https://api.mydomain.com      #USE HTTPS HERE, WE WILL ADD SSL LATTER
FRONTEND_URL=https://myapp.mydomain.com   #USE HTTPS HERE, WE WILL ADD SSL LATTER, CORS RELATED!
PROXY_PORT=443                            #USE NGINX REVERSE PROXY PORT HERE, WE WILL CONFIGURE IT LATTER
PORT=8080

DB_HOST=localhost
DB_DIALECT=
DB_USER=
DB_PASS=
DB_NAME=

JWT_SECRET=3123123213123
JWT_REFRESH_SECRET=75756756756
```

Instale as dependências do puppeteer:

```bash
sudo apt-get install -y libxshmfence-dev libgbm-dev wget unzip fontconfig locales gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils
```

Instale dependências de back-end, crie aplicativos, execute migrações e sementes:

```bash
cd whaticket/backend
npm install
npm run build
npx sequelize db:migrate
npx sequelize db:seed:all
```

Inicie com `npm start`, você deverá ver: `Server started on port...` no console. Pressione `CTRL + C` para sair.

Instale o pm2 **com sudo** e inicie o back-end com ele:

```bash
sudo npm install -g pm2
pm2 start dist/server.js --name whaticket-backend
```

Início automático do pm2 após a reinicialização:

```bash
pm2 startup ubuntu -u `YOUR_USERNAME`
```

Copie a última saída de linha do comando anterior e execute-o, é algo como:

```bash
sudo env PATH=\$PATH:/usr/bin pm2 startup ubuntu -u YOUR_USERNAME --hp /home/YOUR_USERNAM
```

Vá para a pasta frontend e instale as dependências:

```bash
cd ../frontend
npm install
```

Edite o arquivo .env e preencha-o com seu endereço de back-end, ele deve ficar assim:

```bash
REACT_APP_BACKEND_URL = https://api.mydomain.com/
```

Crie um aplicativo de front-end:

```bash
npm run build
```

Inicie o frontend com pm2 e salve a lista de processos pm2 para iniciar automaticamente após a reinicialização:

```bash
pm2 start server.js --name whaticket-frontend
pm2 save
```

Para verificar se está rodando, execute `pm2 list`, deve ficar assim:

```bash
deploy@ubuntu-whats:~$ pm2 list
┌─────┬─────────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name                    │ namespace   │ version │ mode    │ pid      │ uptime │ .    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼─────────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 1   │ whaticket-frontend      │ default     │ 0.1.0   │ fork    │ 179249   │ 12D    │ 0    │ online    │ 0.3%     │ 50.2mb   │ deploy   │ disabled │
│ 6   │ whaticket-backend       │ default     │ 1.0.0   │ fork    │ 179253   │ 12D    │ 15   │ online    │ 0.3%     │ 118.5mb  │ deploy   │ disabled │
└─────┴─────────────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘

```

Instale nginx:

```bash
sudo apt install nginx
```

Remova o site padrão do nginx:

```bash
sudo rm /etc/nginx/sites-enabled/default
```

Crie um novo site nginx para o aplicativo front-end:

```bash
sudo nano /etc/nginx/sites-available/whaticket-frontend
```

Edite e preencha com esta informação, alterando `server_name` para o seu equivalente a `myapp.mydomain.com`:

```bash
server {
  server_name myapp.mydomain.com;

  location / {
    proxy_pass http://127.0.0.1:3333;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_cache_bypass $http_upgrade;
  }
}
```

Crie outra para a API de backend, alterando `server_name` para o seu equivalente a `api.mydomain.com` e `proxy_pass` para o URL do servidor Node de backend localhost:

```bash
sudo cp /etc/nginx/sites-available/whaticket-frontend /etc/nginx/sites-available/whaticket-backend
sudo nano /etc/nginx/sites-available/whaticket-backend
```

```bash
server {
  server_name api.mydomain.com;

  location / {
    proxy_pass http://127.0.0.1:8080;
    ......
}
```

Crie links simbólicos para habilitar sites nginx:

```bash
sudo ln -s /etc/nginx/sites-available/whaticket-frontend /etc/nginx/sites-enabled
sudo ln -s /etc/nginx/sites-available/whaticket-backend /etc/nginx/sites-enabled
```

Por padrão, o nginx limita o tamanho do corpo a 1 MB, o que não é suficiente para alguns uploads de mídia. Vamos alterá-lo para 20 MB adicionando uma nova linha ao arquivo de configuração:

```bash
sudo nano /etc/nginx/nginx.conf
...
http {
    ...
    client_max_body_size 20M; # HANDLE BIGGER UPLOADS
}
```

Teste a configuração do nginx e reinicie o servidor:

```bash
sudo nginx -t
sudo service nginx restart
```

Agora, ative o SSL (https) em seus sites para usar todos os recursos do aplicativo, como notificações e envio de mensagens de áudio. Uma maneira fácil de fazer isso é usando o Certbot:

Instale o certbot:

```bash
sudo add-apt-repository ppa:certbot/certbot
sudo apt update
sudo apt install python-certbot-nginx
```

Habilite o SSL no nginx (preencha/aceite todas as informações solicitadas):

```bash
sudo certbot --nginx
```

## Dados de acesso

User: admin@whaticket.com
Password: admin

## Upgrading

O WhaTicket está em andamento e estamos adicionando novos recursos com frequência. Para atualizar sua instalação antiga e obter todos os novos recursos, você pode usar um script bash como este:

**Note**: Sempre verifique o .env.example e ajuste seu arquivo .env antes de atualizar, pois alguma nova variável pode ser adicionada.

```bash
nano updateWhaticket
```

```bash
#!/bin/bash
echo "Atualizando o Whaticket, aguarde."

cd ~
cd whaticket
git pull
cd backend
npm install
rm -rf dist
npm run build
npx sequelize db:migrate
npx sequelize db:seed
cd ../frontend
npm install
rm -rf build
npm run build
pm2 restart all

echo "Atualização concluída. Aproveite!"
```

Torne-o executável e execute-o:

```bash
chmod +x updateWhaticket
./updateWhaticket
```

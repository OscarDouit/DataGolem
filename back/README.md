# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `data-source.ts` file
3. Run `npm start` command

# Commmande pour générer une clé d'API secret (JWT_SECRET et JWT_SECRET_REFRESH_TOKEN) pour le l'acces token JWT et le token de rafraichissement
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
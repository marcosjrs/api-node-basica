API básica en Node
===
Se trata de unas pruebas, realizando una api básica con Typescript y siguiendo una entrada del blog de auth0.com. No usa ninguna base de datos externa, se "guarda" en memoria; es simplemente para realizar unas pruebas y como mucho algún día aspirar al inicio de un skeleton en algún proyecto muy pequeño.

Instalaciones iniciales
===

```
npm init -y
npm i express dotenv cors helmet
npm i -D typescript
npm i -D @types/node @types/express @types/dotenv @types/cors @types/helmet
```

Helmet agrega una capa de seguridad contra ataques comunes.

Pasos
===

Creación del tsconfig.json, mediante npx, para configurar el Typescript (lo dejaremos con la configuración de fábrica), ejecutando:
```
npx tsc --init
```

Creamos un archivo .env a mano, y para configurar una variable que usaremos para indentificar el puerto, le añadimos en el .env el contenido:
```
PORT=7000
```






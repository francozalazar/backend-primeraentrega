# Primer Entrega Proyecto Final

## Utilización
- Instalar las dependencias

```
npm install
```

- Ejecutar el comando

```
npm start
```

### Aclarciones para la utilización con la Coleccion de la comisión

- Para agregar productos en con el metodo GET no es necesario poner el ID ni el timestamp, ya que, el ID se autoasigna, en caso de no haber productos, se pone el automaticamente ID 1, y en caso de haber, se coloca el siguiente ID. Por otro lado , para el timestamp se utiliza la funcion de **JavaScript** _Date.now()_

```diff
{
- "id": 1,
- "timestamp": 12323453456,
 "nombre": "TV",
 "descripcion": "TV",
 "codigo": "001",
 "foto": "http://imagen.com",
 "precio": 399990,
 "stock": 5
}
```

_El colocarlo no afecta a la funcionalidad el programa pero no hará ningún efecto_

- Para agregar un producto al carrito por id, en el metodo POST de la url:

```
http://localhost:8080/api/carrito/{{id}}/productos
```

se espera en el body un array de IDs de productos ya registrados. Diferenciando del provisto que enviaba un producto.

```diff
{
+ "ids": [{{id}},{{id}}...]
- "id": 1,
- "timestamp": 12323453456,
- "nombre": "TV",
- "descripcion": "TV",
- "codigo": "001",
- "foto": "http://imagen.com",
- "precio": 399990,
- "stock": 5
}
```

## Se adjunta la Coleccion de Postman con las modificiaciones necesarias mencionadads anteriormente.
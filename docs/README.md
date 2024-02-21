# Quick Order

Este componente se encarga de renderizar un input que permitirá hacer una compra rápida.

## Instalación

### 1. Clonar repositorio

Copia el [repositorio](https://github.com/Velasco1704/itg-quick-order/) del proyecto y clonarlo en tu terminal.

```bash
git clone https://github.com/Velasco1704/itg-quick-order/
```

### 2. Acceder a la Carpeta del Proyecto

Después de clonar el repositorio, entra a la carpeta del proyecto utilizando el siguiente comando:

```bash
cd itg-quick-order
```

### 3. Instalar dependencias de la carpeta react

Entra a la carpeta de react y instala las dependencias.

```bash
cd react && yarn
```

> [!NOTE]
> No uses npm y yarn al mismo tiempo esto va a causar conflictos

### 4. Iniciar Sesión en VTEX

Para poder trabajar con VTEX, necesitas iniciar sesión con tu cuenta. Utiliza el siguiente comando y reemplaza {account} con tu nombre de cuenta de VTEX:

```bash
vtex login { account }
```

### 5. Seleccionar el Espacio de Trabajo

Una vez que hayas iniciado sesión, selecciona el espacio de trabajo en el que deseas trabajar utilizando el siguiente comando. Reemplaza {workspace} con el nombre de tu espacio de trabajo:

```bash
vtex use { workspace }
```

### 6. Enlazar el Proyecto al Espacio de Trabajo

Finalmente, enlaza el proyecto a tu espacio de trabajo para visualizarlo ejecutando el siguiente comando:

```bash
vtex link
```

### 7. Agrega el componente

Agrega el componente en el `manifest.json` de tu **store theme**

```JSON
"dependencies": {
   "{accountName}.{appName}": "{appVersion}",
    "vtex.store": "2.x",
    "vtex.store-header": "2.x"
}
```

## Descripción general del proyecto y su uso

### Componentes

#### QuickOrder

```tsx
import React, { useEffect, useState } from 'react';
import { useCssHandles } from 'vtex.css-handles';
import { useMutation, useLazyQuery } from 'react-apollo';
import UPDATE_CART from '../graphql/updateCart.graphql';
import GET_PRODUCT from '../graphql/getProductBySku.graphql';
import '../styles.css';

const QuickOrder = () => {
  const CSS__HANDLES = [
    'quick-order__container',
    'quick-order__title',
    'quick-order__form',
    'quick-order__form--label',
    'quick-order__form--input',
    'quick-order__form--button',
    'quick-order__error',
  ];
  const handles = useCssHandles(CSS__HANDLES);

  const [formValue, setFormValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [error, setError] = useState(false);

  const [getProductBySku, { data: dataProduct }] = useLazyQuery(GET_PRODUCT);
  const [updateCart] = useMutation(UPDATE_CART);

  useEffect(() => {
    if(dataProduct) {
      updateCart({
        variables: {
          salesChannel: "1",
          items: [{
            id: +searchValue,
            quantity: 1,
            seller: "1"
          }]
        }
      }).then(() => window.location.href = "/checkout")
      setError(false);
    };

    if(!dataProduct && searchValue) setError(true);

  }, [dataProduct, searchValue]);

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchValue(formValue);
    setError(false);
    getProductBySku({ variables: { sku: formValue }});
  };

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => setFormValue(e.target.value);

  return (
    <div className={handles['quick-order__container']}>
      <h2 className={handles['quick-order__title']}>Compra rápida de VTEX IO</h2>
      <form className={handles['quick-order__form']} onSubmit={handleSubmit}>
        <label className={handles['quick-order__form--label']} htmlFor='sku'>Ingresa el numero de sku</label>
        <input className={handles['quick-order__form--input']} type='text' id='sku' onChange={handleChange} />
        <button className={handles['quick-order__form--button']} type='submit' disabled={!formValue}>AÑADIR AL CARRITO</button>
        {error && <p className={handles['quick-order__error']}>PRODUCT NOT FOUND</p>}
      </form>
    </div>
  )
};
```

El componente `QuickOrder` es un componente que se encarga de manejar una compra rápida. El componente utiliza los hooks `useState` para manejar el estado de `formValue`, `searchValue` y `error`, `useLazyQuery` para realizar una consulta GraphQL y `useMutation` para realizar una mutación GraphQL. El hook `useEffect` se utiliza para manejar la lógica de actualización del carrito y el manejo de errores basado en los resultados de la consulta GraphQL El componente renderiza un formulario con un campo de entrada para el número de SKU, un botón para añadir al carrito y un mensaje de error si el producto no se encuentra.

#### Graphql

Para realizar estas consultas se uso `vtex.checkout-graphql@0.58.0` y `vtex.search-graphql@0.66.3`

##### getProductBySku

La consulta en este archivo se utiliza para obtener información de un producto basado en su SKU. Utiliza el campo **product** con el identificador **sku** y el valor proporcionado como parámetro. La consulta devuelve las propiedades **productId** y **productName** del producto.

```graphql
query($sku: ID!) {
  product(identifier: { field: sku, value: $sku }) {
    productId
    productName
  }
}
```

##### updateCart

La mutación en este archivo se utiliza para actualizar el carrito de compras. Utiliza el campo **addToCart** con los parámetros **items** y **salesChannel**. La mutación agrega un artículo al carrito con la cantidad especificada y el vendedor correspondiente, utilizando el canal de ventas proporcionado.

```graphql
mutation UPDATE_CART($items: [ItemInput], $salesChannel: String) {
  addToCart(items: $items, salesChannel: $salesChannel) {
    id
  }
}
```

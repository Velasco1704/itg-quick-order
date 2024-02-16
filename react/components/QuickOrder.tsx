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

export default QuickOrder;

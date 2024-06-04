/* eslint-disable react/prop-types */
import { Helmet } from 'react-helmet-async';

import { OfertarPage } from 'src/sections/ofertar/view';

export default function ProductsPage({ account, contract }) {
  return (
    <>
      <Helmet>
        <title> Ofertar </title>
      </Helmet>
      <OfertarPage account={account} contract={contract} />
    </>
  );
}

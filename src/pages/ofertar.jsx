import { Helmet } from 'react-helmet-async';

import { OfertarPage } from 'src/sections/ofertar/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {

  return (
    <>
      <Helmet>
        <title> Ofertar </title>
      </Helmet>
      <OfertarPage />
    </>
  );
}

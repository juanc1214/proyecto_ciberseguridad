/* eslint-disable react/prop-types */
import { Helmet } from 'react-helmet-async';

import { SubastasView } from 'src/sections/subastas/view';

// ----------------------------------------------------------------------

export default function SubastasPage({ account, contract }) {

  return (
    <>
      <Helmet>
        <title> Subastas </title>
      </Helmet>
      <SubastasView account={account} contract={contract} />
    </>
  );
}

import { Helmet } from 'react-helmet-async';

import { SubastasView } from 'src/sections/subastas/view';

// ----------------------------------------------------------------------

export default function SubastasPage() {

  return (
    <>
      <Helmet>
        <title> Subastas </title>
      </Helmet>
      <SubastasView />
    </>
  );
}

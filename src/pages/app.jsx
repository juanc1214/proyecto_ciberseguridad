/* eslint-disable react/prop-types */
import { Helmet } from 'react-helmet-async';

import { AppView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function AppPage({ contract }) {
  return (
    <>
      <Helmet>
        <title> Ciberseguridad Project </title>
      </Helmet>

      <AppView contract={contract}/>
    </>
  );
}

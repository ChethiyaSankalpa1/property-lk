import common from './common';
import nav from './nav';
import footer from './footer';
import data from './data';
import home from './home';
import properties from './properties';
import details from './details';
import sell from './sell';
import contact from './contact';

// English is the reference catalogue: every key that exists in another
// language must also exist here so `t()` can always fall back safely.
export default {
  common,
  nav,
  footer,
  data,
  home,
  properties,
  details,
  sell,
  contact,
};

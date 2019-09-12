import React from 'react';

const Context = React.createContext ({
  notes: [],
  folders: [],
  deleting: () => {}
})

export default Context;
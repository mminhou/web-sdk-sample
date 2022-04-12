import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './component/Home';

const App = () => {
  return (
    <div>
      {/* <Provider store={store}> */}
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      {/* </Provider> */}
    </div>
  );
};

export default App;

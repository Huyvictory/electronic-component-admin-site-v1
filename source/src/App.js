import React from 'react';
import { Provider } from 'react-redux';

import RootRoute from './routes/index';
import store from './store';

const App = () => {
    return (
        <Provider store={store}>
           <RootRoute/>
        </Provider>
    )
}

export default App;

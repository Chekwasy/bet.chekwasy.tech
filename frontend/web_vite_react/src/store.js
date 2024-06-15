// import { configureStore } from '@reduxjs/toolkit';

// import postsReducer from './State/mainbarState';

// const store = configureStore({
//   reducer: {
//     posts: postsReducer
//   }
// })
import { configureStore } from '@reduxjs/toolkit';
import mainBarReducer from './State/mainbarState';
import navBarReducer from './State/navbarState';

const store = configureStore({
    reducer: {
        mainbarState: mainBarReducer,
        navbarState: navBarReducer
    },
});

export default store;
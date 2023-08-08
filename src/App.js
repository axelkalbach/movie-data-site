import './App.css';
// import SearchBar from './components/SearchBar';
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import Home from './components/Home'
import ErrorPage from './components/ErrorPage';
// import Series from './components/Series';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
    // children: [
    //   {
    //     path: "series/:seriesId",
    //     element: <Series />,
    //   },
    // ],
  }
]);

function App() {
  return (
    <div className="App">
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </div>
  );
}

export default App;

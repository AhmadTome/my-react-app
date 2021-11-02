import './App.css';
import AddBookForm from "./components/addBook/addBook";
import React, {useState} from "react";
import {ToastProvider} from 'react-toast-notifications';
import Books from "./components/listOfBook/books";
import PurchaseHistory from "./components/purchaseHistory/purchaseHistory";
import FileManager from "./components/fileManager/fileManager";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BrowserRouter, Route} from "react-router-dom";
import Navbar from "./components/header/header";

function App() {

    return (
        <BrowserRouter>
            <div className="App">
                <ToastProvider>
                    <ToastContainer
                        position="top-right"
                        autoClose={1500}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />

                    <Navbar/>

                    <Route exact path="/addBook" component={AddBookForm}/>
                    <Route exact path="/bookList" component={Books}/>
                    <Route exact path="/purchaseHistory" component={PurchaseHistory}/>
                    <Route exact path="/fileManager" component={FileManager}/>

                </ToastProvider>
            </div>
        </BrowserRouter>
    );
}

export default App;

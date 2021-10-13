import './App.css';
import AddBookForm from "./components/addBook/addBook";
import React, {useState} from "react";
import {ToastProvider} from 'react-toast-notifications';
import Books from "./components/listOfBook/books";
import PurchaseHistory from "./components/purchaseHistory/purchaseHistory";
import axios from "axios";
import FileManager from "./components/fileManager/fileManager";
import {BallBeat} from "react-pure-loaders";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {

    //const server = 'http://localhost:8080/';
    const server = 'https://aqueous-gorge-52970.herokuapp.com/';
    const [addBookComponent, setAddBookComponent] = useState(true);
    const [listBookComponent, setListBookComponent] = useState(false);
    const [purchaseHistory, setPurchaseHistory] = useState(false);
    const [fileManager, setFileManager] = useState(false);
    const [loading, setLoading] = useState(false);

    const showAddBook = () => {
        setAddBookComponent(true);
        setListBookComponent(false);
        setPurchaseHistory(false);
        setFileManager(false);
    }
    const showBookList = () => {
        setListBookComponent(true);
        setAddBookComponent(false);
        setPurchaseHistory(false);
        setFileManager(false);
    }
    const showPurchaseHistory = () => {
        setPurchaseHistory(true);
        setListBookComponent(false);
        setAddBookComponent(false);
        setFileManager(false);
    }
    const showFileManager = () => {
        setPurchaseHistory(false);
        setListBookComponent(false);
        setAddBookComponent(false);
        setFileManager(true);
    }

    const notify = () => toast("Imported Books Successfully" ,
        {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });


    const downloadTemplate = () => {

        axios(
            {
                url: server + `book/template`,
                method: 'post',
                responseType: 'blob'
            }
        ).then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'BookTemplate.xlsx');
            document.body.appendChild(link);
            link.click()
        }).catch(error => {

        });
    }

    const getFile = () => {
        document.getElementById("fileUpload").click();
    }

    const importedFile = (e) => {
        setLoading(true);

        var file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        document.getElementById('fileUpload').value = "";
        axios.post(server + `book/bulk-insert`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        }).then(res => {
            notify();
            setLoading(false);

        }).catch(error => {
            setLoading(false);

        });
    }

    return (
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

                <div className='row'>
                    <span className='pull-left'>
                        <button className='btn btn-primary' onClick={showAddBook}>Add Book</button>
                    </span>
                    <span className='pull-left'>
                        <button className='btn btn-primary' onClick={showBookList}>Book List</button>
                    </span>
                    <span className='pull-left'>
                        <button className='btn btn-primary' onClick={showPurchaseHistory}>Purchase History</button>
                    </span>
                    <span className='pull-left'>
                        <button className='btn btn-default' onClick={downloadTemplate}>Download Book Template</button>
                    </span>


                    <span className='pull-left'>
                        <button className='btn btn-default' onClick={getFile}>
                            import Books
                            <input type="file" id="fileUpload" className='hidden' accept=".xlsx"
                                   onChange={importedFile}/>
                        </button>
                    </span>

                    <span className='pull-left'>
                        <button className='btn btn-primary' onClick={showFileManager}>
                            File Manager
                        </button>
                    </span>

                </div>

                <BallBeat
                    color={'#123abc'}
                    loading={loading}
                />

                {addBookComponent && <AddBookForm/>}
                {listBookComponent && <Books/>}
                {purchaseHistory && <PurchaseHistory/>}
                {fileManager && <FileManager/>}
            </ToastProvider>

        </div>

    );
}

export default App;

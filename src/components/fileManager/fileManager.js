import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useToasts} from "react-toast-notifications";
import {BallBeat} from "react-pure-loaders";
import FileContainerCard from "./fileContainerCard";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const FileManager = () => {
    //const server = 'http://localhost:8080/';
    const server = 'https://aqueous-gorge-52970.herokuapp.com/';

    const {addToast} = useToasts();
    const [files, setFiles] = useState(null);
    const [loading, setLoading] = useState(false);
    const [storedFiles, setStoredFiles] = useState([]);

    const uploadFiles = () => {
        setLoading(true);
        let formData = new FormData();
        for (var i=0; i<files.length; i++) {
         formData.append('files', files[i]);
        }


        axios.post(server + `files/upload`, formData,{
            headers: {
                "Content-Type": "multipart/form-data",
            }
        }).then(res => {
            console.log(res);
            setLoading(false);

            for (var i =0; i<(res['data']['result']).length; i++) {
                setStoredFiles(prevData => ([
                    ...prevData,
                    res['data']['result'][i]
                ]));
            }



            addToast('Files Added Successfully', {appearance: 'success', autoDismiss: true});
        }).catch(error => {
            setLoading(false);
            addToast(error.message, {appearance: 'error', autoDismiss: true});
        });
    }

    useEffect(() => {
        loadFiles();
    }, [])

    const loadFiles = () => {
        axios.get(server + `files`).then(res => {
            setStoredFiles(res.data);
        }).catch(error => {
            addToast(error.message, {appearance: 'error', autoDismiss: true});
        });
    }



    return (
        <div className='container-fluid'>
            <div className='panel panel-default'>
                <div className="panel-heading">File Manager</div>
                <div className="panel-body">
                    <BallBeat
                        color={'#123abc'}
                        loading={loading}
                    />
                    <div className="row form-group">
                        <label className='pull-left col-sm-2 col-form-label'>Upload Files :</label>
                        <div className='col-sm-6'>
                            <input type="file" className="form-control" id="" multiple
                                   onChange={(e) => setFiles(e.target.files)}
                            />
                        </div>
                        <div className='col-sm-2'>
                            <button className="btn btn-primary" onClick={uploadFiles}>upload</button>
                        </div>

                    </div>

                </div>


                <div className='row'>

                {
                    storedFiles && storedFiles.map((file) => {
                        return (
                                <div className='col-sm-3'>
                                    <FileContainerCard filename={file.filename} originalname = {file.originalname}/>
                                </div>
                        )

                    })
                }
                </div>


            </div>
        </div>

    );
}

export default FileManager;
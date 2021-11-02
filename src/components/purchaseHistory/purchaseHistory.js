import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useToasts} from "react-toast-notifications";
import ReactDatatable from "@ashvin27/react-datatable";
import AXIOS from "../../config/axiosWrapper";


const PurchaseHistory = () => {


    const {addToast} = useToasts();
    const [purchase, setPurchase] = useState(null);
    const [total_record, setTotal_record] = useState(0);

    const columns = [
        {
            key: "_id",
            text: "Id",
        },
        {
            text: 'Title',
            key: 'BookTitle',
            sortable: true,
        },
        {
            text: 'Publisher',
            key: 'BookPublisherId',
            sortable: true,
        },
        {
            text: 'Publisher Date',
            key: 'purchaseDate',
        },
        {
            text: 'Author',
            key: 'BookAuthorId',
        },
        {
            text: 'Purchased Unit',
            key: 'numberOfUnit',
        },
        {
            text: 'Total Cost',
            key: 'TotalPrice',
        },
        {
            text: 'Buyer Name',
            key: 'buyer_name',
        },
        {
            text: 'Action',
            key: 'action',
        },
    ];
    const config = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: false,
        show_pagination: true,
        pagination: 'advance',
        filename: "Purchase",
        button: {
            excel: true,
            print: true,
            csv: true,
        }
    }

    const [searchAttr, setSearchAttr] = useState({
        inquiry: '',
        purchase_date: '',
        searchCategory: 'Any',
    });

    const loadPurchases = (page = 1) => {
        const search_attr = "inquiry=" + searchAttr.inquiry + "&purchase_date=" + searchAttr.purchase_date+ "&searchCategory=" + searchAttr.searchCategory+"&page="+page;

        AXIOS.get(process.env.REACT_APP_SERVER_PATH + `Purchase/search?` + search_attr, [], {}).then(res => {
            updatePurchaseTable(res);
        }).catch(error => {
            addToast(error.message, {appearance: 'error', autoDismiss: true});
        });
    }

    const searchPurchaseChange = (e) => {
        const {name, value} = e.target;
        setSearchAttr(preVal => ({
            ...preVal,
            [name]: value
        }));
    }


    const updatePurchaseTable = (data) => {
        setTotal_record(data["data"]["total_record"])
        data = data["data"]["result"][0]["edges"];
        const filteredData = data.map((item) => {
            const BookTitle = item['Book'][0]['BookTitle'];
            const BookPublisherId = item['publishers'][0]['publisherName'];
            const BookAuthorId = item['authors'][0]['FirstName'];
            const purchaseDate = item['purchaseDate'].substring(0,10);
            return {
                ...item,
                BookTitle,
                BookPublisherId,
                BookAuthorId,
                purchaseDate

            }
        });
        setPurchase(filteredData);
        (document.getElementsByClassName('fa-file-excel-o')[0]).textContent='Excel';
        (document.getElementsByClassName('fa-file-text-o')[0]).textContent='Csv';
    }



    useEffect(() => {
        loadPurchases();
    }, []);

    return (
        <div className='container'>
            <div className='panel panel-default'>
                <div className="panel-heading">Purchase History</div>
                <div className="panel-body">


                    <div className="row form-group">
                        <label className='pull-left col-sm-2 col-form-label' htmlFor="">Search word:</label>
                        <div className='col-sm-6'>
                            <input type="text" className="form-control" id="inquiry"
                                   placeholder="Type Something to search"
                                   value={searchAttr.inquiry}
                                   name="inquiry"
                                   onChange={searchPurchaseChange}
                            />
                        </div>
                        <div className='col-sm-4'>
                            <select className='form-control'
                                    value={searchAttr.searchCategory}
                                    name="searchCategory"
                                    onChange={searchPurchaseChange}
                            >
                                <option value='Any'>Any</option>
                                <option value='BookTitle'>Book Title</option>
                                <option value='publishers.publisherName'>Book Publisher</option>
                                <option value='authors.FirstName'>Book Author</option>
                                <option value='buyer_name'>Buyer Name</option>
                            </select>
                        </div>
                    </div>

                    <div className="row form-group">
                        <label className='pull-left col-sm-2 col-form-label'>Purchase Date :</label>
                        <div className='col-sm-3'>
                            <input type="Date" className="form-control" id="" placeholder="Start with"
                                   value={searchAttr.purchase_date}
                                   name="purchase_date"
                                   onChange={searchPurchaseChange}
                            />
                        </div>
                    </div>


                    <div className="row form-group">
                        <label className='pull-left col-sm-2 col-form-label'></label>
                        <div className='col-sm-3'>
                            <button className='btn btn-primary pull-left' onClick={loadPurchases}>Search</button>
                        </div>

                    </div>


                    {
                        purchase
                        &&
                        <ReactDatatable
                            config={config}
                            records={purchase}
                            columns={columns}
                            dynamic={true}
                            //  total_record={total_record}
                            //  onChange={tableChangeHandler}
                        />

                    }

                </div>
            </div>
        </div>

    );
}

export default PurchaseHistory;
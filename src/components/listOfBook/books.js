import React, {useEffect, useState} from 'react';
import axios from "axios";
import DataTable from 'react-data-table-component';
import {useToasts} from 'react-toast-notifications';
import Modal from "../../libraries/modal/modal";
import {Panel, Tab, Tabs} from "../../libraries/tab/tabs";
import ReactDatatable from '@ashvin27/react-datatable';
import '@fortawesome/fontawesome-free';
import {isArrays} from "react-csv/src/core";

const Books = () => {
    const {addToast} = useToasts();
    const server = 'https://aqueous-gorge-52970.herokuapp.com/';
    //const server = 'http://localhost:8080/';

    const [showPaymentDialog, setShowPaymentDialog] = useState(false);

    const columns = [
        {
            key: "_id",
            text: "Id",
            className: "name",
            sortable: true,
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
            key: 'PublisherDate',
        },
        {
            text: 'Author',
            key: 'BookAuthorId',
        },
        {
            text: 'Book Tags',
            key: 'BookTags',
        },
        {
            text: 'Available Unit',
            key: 'AvailableUnit',
        },
        {
            text: 'Unit Price',
            key: 'UnitPrice',
        },
        {
            text: 'Reserve',
            key: 'Reserve',
        },
    ];
    const config = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: false,
        show_pagination: true,
        pagination: 'advance',
        filename: "Books",
        button: {
            excel: true,
            print: true,
            csv: true,
        }
    }

    const [bookInfo, setBookInfo] = useState(
        {
            _id: "",
            BookId: "",
            BookTitle: "",
            BookPublisher: "",
            PublisherDate: "",
            BookAuthor: "",
            AvailableUnit: "",
            UnitPrice: "",
        }
    );

    const [paymentInfo, setPaymentInfo] = useState(
        {
            numberOfUnit: "",
            BuyerName: "",
            BuyerAddress: "",
            BuyerPhoneNumber: "",
            purchaseDate: "",
            NotionalId: "",
            buyer_name: "ADMIN",
            action: "TOB",
        }
    );


    const [buyerDetails, setBuyerDetails] = useState(false);
    const [paymentDetails, setBuyerPayment] = useState(false);

    const [books, setBooks] = useState(null);

    const [firstPage, setFirstPage] = useState(true);
    const [secondPage, setSecondPage] = useState(false);
    const [thirdPage, setThirdPage] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);

    const [firstPanel, setFirstPanel] = useState(true);

    let count = 0;
    const Button = ({isActive, onClick, children, completed}) => {
        if (children == "Book Details" && count >= 4) {
            setFirstPanel(false);
        }
        count++

        const cls = "btn "+completed;

        return (
                <button  className={cls} disabled={isActive} onClick={onClick}>
                    {children}
                </button>
            )


    }

    const loadBooks = () => {
        const search_attr = "inquiry=" + searchAttr.inquiry + "&searchCategory=" + searchAttr.searchCategory +
            "&unitPriceStart=" + searchAttr.unitPriceStart + "&unitPriceEnd=" + searchAttr.unitPriceEnd +
            "&availableUnitStart=" + searchAttr.availableUnitStart + "&availableUnitEnd=" + searchAttr.availableUnitEnd;

        axios.get(server + `books/search?` + search_attr).then(res => {
            updateBooksTable(res);
        }).catch(error => {
            addToast(error.message, {appearance: 'error', autoDismiss: true});
        });
    }

    const [searchAttr, setSearchAttr] = useState({
        inquiry: '',
        unitPriceStart: '',
        unitPriceEnd: '',
        availableUnitStart: '',
        availableUnitEnd: '',
        searchCategory: 'Any',
    });

    const searchBookChange = (e) => {
        const {name, value} = e.target;
        setSearchAttr(preVal => ({
            ...preVal,
            [name]: value
        }));
    }

    const searchForBook = () => {
        const search_attr = "inquiry=" + searchAttr.inquiry + "&searchCategory=" + searchAttr.searchCategory +
            "&unitPriceStart=" + searchAttr.unitPriceStart + "&unitPriceEnd=" + searchAttr.unitPriceEnd +
            "&availableUnitStart=" + searchAttr.availableUnitStart + "&availableUnitEnd=" + searchAttr.availableUnitEnd;

        axios.get(server + `books/search?` + search_attr).then(res => {
            updateBooksTable(res);
        }).catch(error => {
            addToast(error.message, {appearance: 'error', autoDismiss: true});
        });
    }

    const updateBooksTable = (data) => {
        setTotal_record(data["data"]["total_record"])
        data = data["data"]["result"][0]["edges"];

        const filteredData = data.map((item) => {

            let tag;
            if (Array.isArray(item['BookTags'])) {
                tag = (item['BookTags']).map(tag => {
                    return tag['text'] + ', ';
                });
            } else {
                tag = item['BookTags'];
            }

            var author = '';
            if (item['authors'] && item['authors'].length > 0 && item['authors'][0]["FirstName"]) {
                author = item['authors'][0]["FirstName"];
            }

            var publisher = '';
            if (item['publishers'] && item['publishers'].length > 0 && item['publishers'][0]["publisherName"]) {
                publisher = item['publishers'][0]["publisherName"];
            }
            const publishDate = item['PublisherDate'].substr(0, 10);



            return {
                ...item,
                "BookTags": tag,
                "BookAuthorId": author,
                "BookPublisherId": publisher,
                "PublisherDate": publishDate,
                "Reserve": <button disabled={item['AvailableUnit'] == 0} className='btn btn-success'
                                   data-id={item['_id']} onClick={() => PaymentToReserve(item['_id'])}>Reserve</button>
            }
        });
        setBooks(filteredData);
        (document.getElementsByClassName('fa-file-excel-o')[0]).textContent='Excel';
        (document.getElementsByClassName('fa-file-text-o')[0]).textContent='Csv';
    }

    const PaymentToReserve = (_id) => {
        setSecondPage(false);
        setThirdPage(false);





        setBookInfo((prevData) => ({
            ...prevData,
            _id: _id,
        }));

        axios.get(server + `books/` + _id).then(res => {
            console.log("book", res);
            let data = res["data"][0];
            setShowPaymentDialog(true);
            const BookAuthors = data['authors'][0] ? data['authors'][0]['FirstName'] : 'no addBook authors';
            const BookPublisher = data['publishers'][0] ? data['publishers'][0]['publisherName'] : 'no addBook publisher';

            setBookInfo((prevData) => ({
                ...prevData,
                BookId: data.BookId,
                BookTitle: data.BookTitle,
                BookPublisher: BookPublisher,
                PublisherDate: data.PublisherDate.substr(0, 10),
                BookAuthor: BookAuthors,
                AvailableUnit: data.AvailableUnit,
                UnitPrice: data.UnitPrice,
            }));

        }).catch(error => {
            console.log("error", error);
        });
    }

    const PaymentInfoChange = (e) => {
        let {name, value} = e.target;

        if (name == "numberOfUnit") {
            let availableUnit = parseInt(bookInfo.AvailableUnit);
            let numberOfUnit = parseInt(value);
            if (numberOfUnit > availableUnit) {
                alert('Please decrease the amount and take a look to the available unit ')
                return ;
            }
        }



        setPaymentInfo((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    const ReserveBook = () => {
        let BookId = bookInfo._id;
        let TotalPrice = bookInfo.UnitPrice * paymentInfo.numberOfUnit;
        let data = {...paymentInfo, ...bookInfo, BookId, TotalPrice};
        axios.post(server + `books/`+ BookId +`/reserve`, data).then(res => {
            addToast('Book Reserved Successfully', {appearance: 'success', autoDismiss: true});
            setShowPaymentDialog(!showPaymentDialog);
        }).catch(error => {
            addToast('Book Reserved Fail', {appearance: 'error', autoDismiss: true});
            console.log("error", error);
        });
    }

    useEffect(() => {
        loadBooks();
    }, []);

    const tableChangeHandler = (e) => {
        const page = e["page_number"];

        const search_attr = "inquiry=" + searchAttr.inquiry + "&searchCategory=" + searchAttr.searchCategory +
            "&unitPriceStart=" + searchAttr.unitPriceStart + "&unitPriceEnd=" + searchAttr.unitPriceEnd +
            "&availableUnitStart=" + searchAttr.availableUnitStart + "&availableUnitEnd=" + searchAttr.availableUnitEnd;

        axios.get(server + `books/search?` + search_attr+'&page='+page).then(res => {
            updateBooksTable(res);
        }).catch(error => {
            addToast(error.message, {appearance: 'error', autoDismiss: true});
        });

    }

    const [total_record, setTotal_record] = useState(0);

    const savePage1 = () => {
        if (paymentInfo.numberOfUnit != "") {
            alert('you can pass to the second page')
            setSecondPage(true);
        } else {
            alert("you can't pass to the second page, please fill all fields")
            setSecondPage(false);
        }
    }

    const savePage2 = () => {
        if (paymentInfo.BuyerName != "" && paymentInfo.BuyerAddress != "" && paymentInfo.BuyerPhoneNumber != "" && paymentInfo.purchaseDate != "" && paymentInfo.NotionalId != "" ) {
            alert('you can pass to the third page')
            setThirdPage(true);
        } else {
            alert("you can't pass to the third page, please fill all fields")
            setThirdPage(false);
        }
    }

    return (
        <div className='container'>
            <div className='panel panel-default'>
                <div className="panel-heading">Search for a book</div>
                <div className="panel-body">

                    <div className="row form-group">
                        <label className='pull-left col-sm-2 col-form-label' htmlFor="">Search word:</label>
                        <div className='col-sm-6'>
                            <input type="text" className="form-control" id="inquiry"
                                   placeholder="Type Something to search"
                                   value={searchAttr.inquiry}
                                   name="inquiry"
                                   onChange={searchBookChange}
                            />
                        </div>
                        <div className='col-sm-4'>
                            <select className='form-control'
                                    value={searchAttr.searchCategory}
                                    name="searchCategory"
                                    onChange={searchBookChange}
                            >
                                <option value='Any'>Any</option>
                                <option value='BookTitle'>Book Title</option>
                                <option value='publishers.publisherName'>Book Publisher</option>
                                <option value='authors.FirstName'>Book Author</option>
                                <option value='Tags'>Tags</option>
                            </select>
                        </div>
                    </div>

                    <div className="row form-group">
                        <label className='pull-left col-sm-2 col-form-label'>Available Unit :</label>
                        <div className='col-sm-3'>
                            <input type="text" className="form-control" id="" placeholder="Start with"
                                   value={searchAttr.availableUnitStart}
                                   name="availableUnitStart"
                                   onChange={searchBookChange}
                            />
                        </div>
                        <div className='col-sm-3'>
                            <input type="text" className="form-control" id="" placeholder="End with"
                                   value={searchAttr.availableUnitEnd}
                                   name="availableUnitEnd"
                                   onChange={searchBookChange}
                            />
                        </div>
                    </div>

                    <div className="row form-group">
                        <label className='pull-left col-sm-2 col-form-label'>Unit Price :</label>
                        <div className='col-sm-3'>
                            <input type="text" className="form-control" id="" placeholder="Start with"
                                   value={searchAttr.unitPriceStart}
                                   name="unitPriceStart"
                                   onChange={searchBookChange}
                            />
                        </div>
                        <div className='col-sm-3'>
                            <input type="text" className="form-control" id="" placeholder="End with"
                                   value={searchAttr.unitPriceEnd}
                                   name="unitPriceEnd"
                                   onChange={searchBookChange}
                            />
                        </div>
                    </div>

                    <div className="row form-group">
                        <label className='pull-left col-sm-2 col-form-label'></label>
                        <div className='col-sm-3'>
                            <button className='btn btn-primary pull-left' onClick={searchForBook}>Search</button>
                        </div>

                    </div>


                    {
                        books
                        &&
                        <ReactDatatable
                            config={config}
                            records={books}
                            columns={columns}
                            dynamic={true}
                            total_record={total_record}
                            onChange={tableChangeHandler}
                        />

                    }
                </div>
            </div>


            <Modal show={showPaymentDialog}>
                <div className='container'>

                    <h1 className='text-left'>Reserve a book</h1>

                    <div className="panel-body">
                        <Tabs >
                            <div >
                                <Tab >
                                    <Button completed={firstPage}>Book Details</Button>
                                </Tab>
                                <Tab>
                                    <Button completed={secondPage}>Buyer details</Button>
                                </Tab>
                                <Tab>
                                    <Button completed={thirdPage}>Payment details</Button>
                                </Tab>
                            </div>

                            <Panel active={firstPanel}>
                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">Book Id:</label>
                                    <div className='col-sm-10'>
                                        <input type="text" className="form-control" id="bookId" placeholder="Enter Book Id"
                                               disabled={true}
                                               value={bookInfo.BookId}
                                               name="BookId"
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookTitle">Book
                                        Title:</label>
                                    <div className='col-sm-10'>
                                        <input type="text" className="form-control" id="bookTitle"
                                               disabled={true}
                                               placeholder="Enter Book Title"
                                               value={bookInfo.BookTitle}
                                               name="BookTitle"
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookPublisher">Book
                                        Publisher:</label>
                                    <div className='col-sm-10'>
                                        <input type="text" className="form-control" id="bookTitle"
                                               placeholder="Enter Book Title"
                                               disabled={true}
                                               value={bookInfo.BookPublisher}
                                               name="BookPublisher"
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="publishDate">Publish
                                        Date:</label>
                                    <div className='col-sm-10'>
                                        <input type="test" className="form-control" id="publishDate"
                                               disabled={true}
                                               value={bookInfo.PublisherDate}
                                               name="BookPublisher"
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookAuthor">Book
                                        author:</label>
                                    <div className='col-sm-10'>
                                        <input type="text" className="form-control" id="publishDate"
                                               placeholder="Enter Publish Date"
                                               disabled={true}
                                               value={bookInfo.BookAuthor}
                                               name="BookAuthor"
                                        />
                                    </div>

                                </div>


                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="AvailableUnit">Available
                                        Unit:</label>
                                    <div className='col-sm-10'>
                                        <input type="text" className="form-control" id="AvailableUnit" placeholder=""
                                               disabled={true}
                                               value={bookInfo.AvailableUnit}
                                               name="AvailableUnit"
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="UnitPrice">Unit
                                        Price:</label>
                                    <div className='col-sm-10 '>
                                        <input type="text" className="form-control" id="UnitPrice" placeholder=""
                                               disabled={true}
                                               value={bookInfo.UnitPrice}
                                               name="UnitPrice"
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="UnitPrice">
                                        Number Of Units:
                                    </label>
                                    <div className='col-sm-10 '>
                                        <input type="text" className="form-control" id="UnitPrice" placeholder=""
                                               value={paymentInfo.numberOfUnit}
                                               onChange={PaymentInfoChange}
                                               name="numberOfUnit"

                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' ></label>
                                    <div className='col-sm-10'>
                                        <button className='btn btn-primary pull-left' onClick={savePage1}>Save and continue</button>
                                    </div>
                                </div>
                            </Panel>

                            <Panel>
                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">Buyer Name:</label>
                                    <div className='col-sm-10'>
                                        <input type="text"
                                               className="form-control"
                                               value={paymentInfo.BuyerName}
                                               onChange={PaymentInfoChange}
                                               name="BuyerName"
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">Buyer Address:</label>
                                    <div className='col-sm-10'>
                                        <input type="text"
                                               className="form-control"
                                               value={paymentInfo.BuyerAddress}
                                               onChange={PaymentInfoChange}
                                               name="BuyerAddress"
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">Buyer Phone No.:</label>
                                    <div className='col-sm-10'>
                                        <input type="text"
                                               className="form-control"
                                               value={paymentInfo.BuyerPhoneNumber}
                                               onChange={PaymentInfoChange}
                                               name="BuyerPhoneNumber"
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">Purchase Date:</label>
                                    <div className='col-sm-10'>
                                        <input type="date"
                                               className="form-control"
                                               value={paymentInfo.purchaseDate}
                                               onChange={PaymentInfoChange}
                                               name="purchaseDate"
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">National Id:</label>
                                    <div className='col-sm-10'>
                                        <input type="text"
                                               className="form-control"
                                               value={paymentInfo.NotionalId}
                                               onChange={PaymentInfoChange}
                                               name="NotionalId"
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' ></label>
                                    <div className='col-sm-10'>
                                        <button className='btn btn-primary pull-left' onClick={savePage2}>Save and continue</button>
                                    </div>
                                </div>
                            </Panel>

                            <Panel>
                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">Payment Method:</label>
                                    <div className='col-sm-10'>
                                        <select className='form-control'>
                                            <option >Cash</option>
                                            <option disabled={true}>Credit Card</option>
                                            <option disabled={true}>Paypal</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">Number Of Units:</label>
                                    <div className='col-sm-10'>
                                        <input type="text"
                                               className="form-control"
                                               disabled={true}
                                               value={paymentInfo.numberOfUnit}
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">Unit Price:</label>
                                    <div className='col-sm-10'>
                                        <input type="text"
                                               className="form-control"
                                               id="bookId"
                                               placeholder="Enter Book Id"
                                               value={bookInfo.UnitPrice}
                                               disabled={true}
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' htmlFor="bookId">Total Price:</label>
                                    <div className='col-sm-10'>
                                        <input type="text"
                                               className="form-control"
                                               id="bookId"
                                               placeholder="Enter Book Id"
                                               value={ bookInfo.UnitPrice * paymentInfo.numberOfUnit}
                                               disabled={true}
                                        />
                                    </div>
                                </div>



                                <div className="row form-group">
                                    <label className='pull-left col-sm-2 col-form-label' ></label>
                                    <div className='col-sm-10'>
                                        <button className='btn btn-primary pull-left' onClick={() => ReserveBook()}>Reserve book</button>
                                    </div>
                                </div>
                            </Panel>
                        </Tabs>
                    </div>

                    <div className="row form-group">
                        <div className='col-sm-2 col-sm-offset-6'>
                            <button className='btn btn-default pull-left'
                                    onClick={() => setShowPaymentDialog(false)}> Cancel
                            </button>
                        </div>
                    </div>

                </div>
            </Modal>



        </div>);
}

export default Books;
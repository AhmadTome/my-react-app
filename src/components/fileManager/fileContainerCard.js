import React, {useEffect} from "react";
import axios from "axios";
import {
    Card,
    CardText,
    CardBody,
    CardTitle,
    CardSubtitle,
    Button
} from "reactstrap";

const FileContainerCard = (props) => {




    const copy = (e) => {
        var attribute = e.target.attributes["data-filename"].value;
        navigator.clipboard.writeText(attribute)
        alert("Copied the text: ");


    }

    const findSRC = () => {
        const filename = props.filename;
       let path =  `${process.env.REACT_APP_SERVER_PATH}${props.filename}`
        const ext = filename.split('.').pop();

       switch (ext) {
           case 'xlsx':
               path = "../../../img/xlsx.png";
               break;
           case 'csv':
               path = "../../../img/csv.png";
               break;
           case 'pdf':
               path = "../../../img/pdf.png";
               break;
           case 'docx':
               path = "../../../img/word.png";
               break;

       }


        return path;
    }

    return (
        <Card>
            <CardBody style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
                    <CardText>
                        <img width={200} height={200} src={findSRC()} />
                    </CardText>
                <CardText>
                    {props.originalname}
                </CardText>

                <div style={{marginTop: '12px'}}>
                    <Button onClick={copy} data-filename={props.filename}>Copy</Button>
                </div>
            </CardBody>
        </Card>
    );
}

export default FileContainerCard;
let express = require('express');

let bodyParser = require('body-parser');

let app = express();
app.use(express.static('css'));
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (request, response) => response.sendFile(__dirname + "/Page1.html"));


//ADD
app.post('/api/data', (request, response) => {
    let postBody = request.body;

    sql.connect(config, function (err) {
        if (err) {
            response.status(500).send(err.originalError.info.message);
            return;
        }

        // create Request object
        //var sqlrequest = new sql.Request();
        let queryString = "INSERT INTO Customers (FirstName, LastName, Address, City, Province, PostalCode) VALUES (@First, @Last, @Address, @City, @Province, @PostalCode); select SCOPE_IDENTITY() as CustID";
        queryString = queryString.replace("@First", "'" + postBody.FirstName + "'");
        queryString = queryString.replace("@Last", "'" + postBody.LastName + "'");
        queryString = queryString.replace("@Address", "'" + postBody.Address + "'");
        queryString = queryString.replace("@City", "'" + postBody.City + "'");
        queryString = queryString.replace("@Province", "'" + postBody.Province + "'");
        queryString = queryString.replace("@PostalCode", "'" + postBody.PostalCode + "'");

        sql.query(queryString, function (err, recordset) {

            if (err) {
                
                response.status(500).send(err.originalError.info.message);
            } else {

                // send recordset as a response for debugging purposes
                //record set an be only used when there is a "select" 
                response.send(recordset.recordset[0]);
                console.log(recordset);
                sql.close();
            }
        });
    });

});

//DELETE
app.delete('/api/data/:CustID', (request, response) => {
    let postBody = request.body;

    let deleteId = request.params.CustID;
    sql.connect(config, function (err) {

        if (err) {
            console.log(err);
            response.status(500).send(err.originalError.info.message);
            return;
        }
        //express routes
        let queryString = "delete from Customers where custID =@CustID; select @@ROWCOUNT as numDeleted";
        queryString = queryString.replace("@CustID", deleteId);

        sql.query(queryString, function (err, recordset) {

            if (err) {
                console.log(err);
                response.status(500).send(err.originalError.info.message);
            } else {
                // send recordset as a response for debugging purposes
                if (recordset.recordset[0].numDeleted > 0) {
                    response.send("Success in deleting");

                } else {
                    response.status(500).send("No record found");
                }
                sql.close();

            }
        });
    });

});

//UPDATE
app.post('/api/data/update/:CustID', (request, response) => {
    let postBody = request.body;
    let updateID = request.params.CustID;

    sql.connect(config, function (err) {

        if (err) {
            console.log(err);
            response.send(err);
            return;
        }

        let queryString = "Update Customers set FirstName = @First, LastName=@Last, Address=@Address, City=@City, Province=@Province, PostalCode=@PostalCode where custID=@CustID";
        queryString = queryString.replace("@CustID", updateID);
        queryString = queryString.replace("@First", "'" + postBody.FirstName + "'");
        queryString = queryString.replace("@Last", "'" + postBody.LastName + "'");
        queryString = queryString.replace("@Address", "'" + postBody.Address + "'");
        queryString = queryString.replace("@City", "'" + postBody.City + "'");
        queryString = queryString.replace("@Province", "'" + postBody.Province + "'");
        queryString = queryString.replace("@PostalCode", "'" + postBody.PostalCode + "'");

        sql.query(queryString, function (err, recordset) {

            if (err) {
                console.log(err);
                response.send(err);
            } else {
                response.send("Success in updating");
                console.log(recordset);
                sql.close();

            }
        });
    });

});


app.post('/api/data/find/:CustID', (request, response) => {
    let postBody = request.body;
    let findID = request.params.CustID;

    sql.connect(config, function (err) {

        if (err) {
            console.log(err);
            response.send(err);
            return;
        }

        let queryString = "select custID, FirstName, LastName, Address, City, Province, PostalCode from Customers where custID=@CustID";
        queryString = queryString.replace("@CustID", findID);


        sql.query(queryString, function (err, recordset) {

            if (err) {
                console.log(err);
                response.send(err);
            } else {
                response.send(recordset.recordset[0]);
                console.log(recordset);
                sql.close();

            }
        });
    });

});

let sql = require("mssql");

let config = {
    user: 'debora',
    password: 'sa',
    server: 'DESKTOP-L5N46OT\\SQLEXPRESS',
    database: 'Store'
};

// create the web server running on hard coded port 3000
let server = app.listen(3000, function () {
    console.log('Server is running..');
});
const http = require('http');//http module joki servers wagera me use hota hai...
const fs = require('fs'); //file system module=-- joki file me reading and writing k operations ke liye hoga hai
const qs = require('querystring'); //ye stirng ki operations ke liye hota hai

const server = http.createServer((req, res) => { //(req,res)--- ye callback function hota hai...
    res.setHeader('Content-Type', 'text/html'); //basically it will the browser that we are sending the html type of data.....

    // front page hoga yeeh

    //maksad nahi bhulna
    if (req.url == "/") { //this is kind of get method.....
        //bydefault yehi page run hoga...
        const formHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Form Submission</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f7f6;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        color: #333;
                    }

                    .container {
                        background-color: white;
                        padding: 30px;
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        width: 100%;
                        max-width: 600px;
                        text-align: center;
                    }

                    h1 {
                        font-size: 24px;
                        margin-bottom: 20px;
                    }

                    form {
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                    }

                    label {
                        font-size: 16px;
                        text-align: left;
                        margin-bottom: 5px;
                        font-weight: bold;
                    }

                    input, textarea {
                        padding: 10px;
                        font-size: 14px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        margin-top: 5px;
                    }

                    input:focus, textarea:focus {
                        border-color: #4e9bff;
                        outline: none;
                    }

                    button {
                        background-color: #4e9bff;
                        color: white;
                        font-size: 16px;
                        padding: 12px;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        transition: background-color 0.3s;
                    }

                    button:hover {
                        background-color: #3689e1;
                    }

                    a {
                        color: #4e9bff;
                        text-decoration: none;
                    }

                    a:hover {
                        text-decoration: underline;
                    }

                    @media (max-width: 600px) {
                        .container {
                            padding: 20px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Submit Your Information</h1>
                    <form action="/submit" method="POST">
                        <label for="name">Name:</label>
                        <input type="text" id="name" name="name" required>

                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" required>

                        <label for="message">Message:</label>
                        <textarea id="message" name="message" required></textarea>

                        <button type="submit">Submit</button>
                    </form>
                    <br>    
                    <a href="/view">View Submitted Data</a>
                </div>
            </body>
            </html>
        `;
        res.end(formHTML);//ye khatam hone ke baad formHTML ko send kar dega
    }

    // this will now handle the submission of faram
    else if (req.url === '/submit' && req.method === 'POST') { //iska matlab localhost me jab user 8001
        //dalne ke baad /submit likhega...aur client se server pe post hoga...
        //server se data client -- post 
        let body = ''; //body naam ka variable banaya hai
        req.on('data', chunk => {
            body += chunk; //yaha pr chunk ka use hua hai body variable me data dalne ke liye
        }); //chunk ki madat se hamne data ko append kiya
        req.on('end', () => { //data dalne ke baad ye work karega...
            const formData = qs.parse(body); 
            fs.readFile('data.json', 'utf8', (err, data) => { //data.json ki file k andar utf8 type 
                //me convert ho jayega...fir callback function se err aur data handle hoge....
                let users = []; //user naam ka ek array assume karege..aur usme data daalege
                if (!err && data) { //error na ho..aur data ho kuch file ke andar...too yee kaam krega...
                    users = JSON.parse(data);
                }
                users.push(formData); //user ke andar form data ko daalege
                fs.writeFile('data.json', JSON.stringify(users, null, 2), (err) => { //json.stringify me 3 variables hote hai...
                    //JOSN.stringify(value,replacer,space)
                    if (err) {
                        res.statusCode = 500; //500 matlab fcuk
                        res.end('<h1>Error saving data</h1>'); 
                    } else {
                        res.statusCode = 200; //sab bhaidya 
                        res.end('<h1>Data saved successfully!</h1><p><a href="/">Go back</a></p>');
                    }
                });
            });
        });
    }

    // we can view submitted data or anchor tag bhi use hua hai page pr usse bhi check kar sakte hai
    else if (req.url === '/view') {
        fs.readFile('data.json', 'utf8', (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end('<h1>Error reading data</h1>');
                return;
            }

            const users = JSON.parse(data);//parse basicalllly convert karta hai string to object...
            //aur stringif -- object to stringn..
            let htmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>View Submitted Data</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f7f6;
                            display: flex;
                            justify-content: center;
                            align-items: flex-start;
                            padding-top: 50px;
                            margin: 0;
                            color: #333;
                        }

                        .container {
                            background-color: white;
                            padding: 30px;
                            border-radius: 8px;
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                            width: 100%;
                            max-width: 800px;
                        }

                        h1 {
                            font-size: 28px;
                            margin-bottom: 20px;
                            text-align: center;
                        }

                        .user {
                            background-color: #fafafa;
                            border: 1px solid #ddd;
                            border-radius: 8px;
                            padding: 15px;
                            margin-bottom: 20px;
                        }

                        .user strong {
                            color: #4e9bff;
                        }

                        .user p {
                            margin: 5px 0;
                            font-size: 14px;
                        }

                        .back-link {
                            text-align: center;
                            margin-top: 20px;
                            display: block;
                            font-size: 16px;
                            color: #4e9bff;
                        }

                        .back-link:hover {
                            text-decoration: underline;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Submitted Data</h1>
            `;
            users.forEach(user => { //ye kya karega..ki new data append kardega....
                htmlContent += `
                    <div class="user">
                        <p><strong>Name:</strong> ${user.name}</p> 
                        <p><strong>Email:</strong> ${user.email}</p>
                        <p><strong>Message:</strong> ${user.message}</p>
                    </div>
                `;
            });

            htmlContent += `
                        <a class="back-link" href="/">Go Back</a>
                    </div>
                </body>
                </html> 
            `;//this will append the data at the end of the code
            res.statusCode = 200;
            res.end(htmlContent);
        });
    }

    // iska matlab ki page found nahi hua... 404 --error
    else {
        res.statusCode = 404;
        res.end('<h3>Page not found</h3>');
    }
});

server.listen(8001, () => { 
    console.log("Server is listening on port 8001");
});

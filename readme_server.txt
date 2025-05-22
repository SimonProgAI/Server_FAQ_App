npm init -y
npm i express
npm i cors
npm i mysql2
edit package.json --> 
    "start": "node index.js"
    "type" : "module"

create routes/user.js
create index.js in main


--TROUBLESHOOT--
if port 5000 already in use:
    cmd:
        netstat -ano | findstr :5000

    results should look like:
        TCP    0.0.0.0:5000           0.0.0.0:0              LISTENING       190488
        TCP    [::]:5000              [::]:0                 LISTENING       190488

    cmd:
        taskkill /PID 190488 /F 
import express from 'express';
import cors from 'cors';
import user from './routes/user.js'

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
    origin: ["https://simonprogai.github.io",
             'http://localhost:3000'],
    methods: 'GET,POST,PUT,DELETE',
    headers: 'Content-Type, Accept'
  }));
app.use('/user', user);
app.get('/', (req,res)=>{
    res.send(`Server running on port ${port}`)
})
app.listen(port, () =>{
    console.log(`listening on http://localhost:${port}`);
});

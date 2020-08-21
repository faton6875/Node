const express = require('express');
const app = express();
const port = process.env.PORT;
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.listen(port, () => {
  console.log('Server is running');
});

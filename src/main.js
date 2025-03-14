import {app} from "./application/app.js";

const PORT = process.env.PORT || 5009;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
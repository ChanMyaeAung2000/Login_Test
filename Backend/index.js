const jwt = require("jsonwebtoken");
const user={
    id:123,
    name:'Aung Aung',
    age:22
};
const secret_key="This is my secret key";
const token = jwt.sign(user,secret_key);
console.log("token value",token);
const decoded = jwt.decode(token);

console.log("Decoded data:", decoded);

// const verified = jwt.verify(token, secret_key);

// console.log("Verified user:", verified);

const wronguser= jwt.verify(token, "wrong-secret");
console.log("wrong user:", wronguser);



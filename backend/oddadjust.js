const readline = require('readline');



const odd = async () => {
    const r1 = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    await r1.question('mmmmm    ', (usrip) => {
        console.log(usrip);
        console.log(766);
        
    });
    await r1.question('mmmmm    ', (usrip) => {
        console.log(usrip);
        console.log(766);
        
    });
    r1.close;    
};

odd();
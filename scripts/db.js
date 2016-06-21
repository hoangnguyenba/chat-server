process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});

var ARR_TABLE = ["Message", "User"];

var type = "reset"; // create, delete, sample, reset
var table = "all"; // all, Message, User

if(typeof process.argv[2] !== "undefined")
{
    console.log('####1####');
    type = process.argv[2];
}

if(typeof process.argv[3] !== "undefined")
{
    console.log('####2####');
    table = process.argv[2];
}

if(table === "all")
{
    ARR_TABLE.forEach((t) => {
        console.log('####Delete####');
        require( "./" + t.toLowerCase() + '-table-delete.js');
        console.log('####Create####');
        require( "./" + t.toLowerCase() + '-table-create.js');
        console.log('####Add sample data####');
        require( "./" + t.toLowerCase() + '-table-sample.js');
    });
}

console.log('####end####');
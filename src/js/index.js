@@include("./snippet.js");


snippet();

console.log("log fom index.js");


let a = 4;
const b = 5;

Promise.resolve(a + b)
	.then((res) => {
		console.log(`promise result: ${res}`)
	})
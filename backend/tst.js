const str = '/tmp/filemanager/djfjfjfj555';
const str_lst = str.split('/');
const pathLen = str_lst.length - 1;
let savePath = '';
for (let val = 1; val < pathLen; val++) {
	savePath = savePath + '/' + str_lst[val];
}
savePath = savePath + '/';
console.log(savePath);
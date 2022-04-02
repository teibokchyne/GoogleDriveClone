let arr = [
    [450,   367,    432],
    [437,   437,    405,    405,    138],
    [451,   389,    389,    432,    422],
    [422,   422,    459,    459,    459],
    [459,   389,    108,    108],
    [108,   427,    427,    429],
    [431,   431,    431,    431],
    [461,   461,    432]
];

var total = 0;
for(let i=0; i<arr.length ; ++i){
    var sum=0;
    for(let j=0; j<arr[i].length ; ++j){
        sum = sum + arr[i][j];
    }
    console.log(arr[i] +" = "+sum);
    total = total + sum;
}
console.log("total = "+total);

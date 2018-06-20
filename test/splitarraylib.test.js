/****************************************
 * splitarraylib.test.js
 * Node-tape test for the splitarray library. 
 */

const test = require('tape');
const sal = require('../lib/splitarraylib');



/* Helper function for creating a long array that is the passed in array copied num times
 */
function duplicateArray( arr, num){
    let longArray = [];

    for( let i=0; i< num; ++i){
        longArray.push.apply(longArray, arr);
    }

    return longArray;
}

/* Helper function to flatten an array of arrays
 */
function flattenArray(array) {
    return [].concat.apply([], array);
}

/* Tests for the splitArray Part 1
 */
test('splitArrayPart1', (assert) => {
    assert.deepLooseEqual(sal.splitArrayPart1([],1), [[]], 'trivial case 0');
    assert.deepLooseEqual(sal.splitArrayPart1(['a'], 10), [['a']], 'trivial case 1');

    const input = ['abc', '123', 'def', 'qwerty', 'boom!'];
    assert.deepLooseEqual(sal.splitArrayPart1(input,5), [input], 'Test original array is the same size as maxlen');

    //Output for inputstrint with a size of 2
    const output = [['abc', '123'], ['def','qwerty'], ['boom!']];
    assert.deepLooseEqual(sal.splitArrayPart1(input,2), output, 'Test input with size of 2');

    /*  
    //Output how long it takes to split a large array
    const longArray = duplicateArray(input, 1000000);
    const start = (new Date).getTime();
    const outArray = sal.splitArrayPart1(longArray,2);
    const timeTaken = (new Date).getTime() - start;
    console.log('splitArrayPart1 took ' + timeTaken);
    */

    assert.end();
});


/* Test for the splitArray Part 1 using array slice instead of building the array one element at a time.
 * note:  slice implementation ended up being faster.
 */
test('splitArray1Slice', (assert) => {
    assert.deepLooseEqual(sal.splitArrayPart1Slice([],1), [[]], 'trivial case 0');
    assert.deepLooseEqual(sal.splitArrayPart1Slice(['a'], 10), [['a']], 'trivial case 1');

    const input = ['abc', '123', 'def', 'qwerty', 'boom!'];

    assert.deepLooseEqual(sal.splitArrayPart1Slice(input,5), [input], 'Test original array is the same size as maxlen');

    //Output for inputstrint with a size of 2
    const output = [['abc', '123'], ['def','qwerty'], ['boom!']];
    assert.deepLooseEqual(sal.splitArrayPart1Slice(input,2), output, 'Test input with size of 2');

    /*
    //Output how long it takes to split a large array
    const longArray = duplicateArray(input, 1000000);
    const start = (new Date).getTime();
    const outArray = sal.splitArrayPart1Slice(longArray,2);
    const timeTaken = (new Date).getTime() - start;
    console.log('splitArrayPart1Slice took ' + timeTaken);
    */

    assert.end();
});


/* Test for splitArray part 2
 */
test('splitArray2', (assert) => {
    assert.deepLooseEqual(sal.splitArrayPart2([],1), [[]], 'trivial case 0');
    assert.deepLooseEqual(sal.splitArrayPart2(['a'], 10), [['a']], 'trivial case 1');

    assert.throws(() => splitArrayPart2(['aa'], 1), Error, 'throws when input is too big');

    const input = ['abc', '123', 'def', 'qwerty', 'boom!'];

    assert.deepLooseEqual(sal.splitArrayPart2(input,20), [input], 'Test original array is the same size as maxchar');

    //Output for input with a char size of 9
    const output = [['abc', '123', 'def'], ['qwerty'], ['boom!']];
    assert.deepLooseEqual(sal.splitArrayPart2(input,9), output, 'Test input with size of 2');

    assert.end();
});

/* Test for splitArray part 3
 */
test('splitArrayPart3', (assert) => {
    // trivial cases
    assert.looseEqual(sal.splitArrayPart3([], 1), [[]], 'trivial case 0');
    assert.looseEqual(sal.splitArrayPart3(['a'], 10), [['a']], 'trivial case 1');
    assert.throws(() => splitArrayPart3(['a'], 1), Error, 'throws when input is too big');

    // more comprehensive scenario
    const entry1 = '123';
    const entry2 = '456!@';
    const entry3 = '789!@@$';
    const entrySize1 = sal.byteSize(entry1);
    const entrySize2 = sal.byteSize(entry2);
    const entrySize3 = sal.byteSize(entry3);
    assert.comment(`entry1 size: ${entrySize1}, entry2 size: ${entrySize2}, entry3 size: ${entrySize3}`);
    const input = [...(new Array(5)).fill(entry1), ...(new Array(5)).fill(entry2), ...(new Array(5)).fill(entry3)];
    const size = sal.byteSize(input);
    assert.comment(`total input size: ${size}`);
    const maxChunkSize = entrySize1 * 4;
    assert.comment(`max chunk size: ${maxChunkSize}`);
    const output = sal.splitArrayPart3(input, maxChunkSize);
    output.forEach((chunk) => {
        const chunkSize = sal.byteSize(chunk);
        assert.ok(chunkSize > 0 && chunkSize <= maxChunkSize, `chunk size: ${chunkSize}`);
    });
    assert.looseEqual(flattenArray(output), input, 'the concatenated output is equal to the input');
    assert.end();
});

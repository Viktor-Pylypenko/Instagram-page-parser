const {checkAnswer} = require('./../script/validation')
const assert = require('assert')

describe('Validators', async () => {
    describe('username validation', async () => {
        const testCases = [
            {value: "", expected: false},
            {value: null, expected: false},
            {value: undefined, expected: false},
            {value: 'ЪЪЪЪЪЪЪ', expected: false},
            {value: 123456, expected: false},
            {value: false, expected: false},    
            {value: 'aa', expected: false},
            {value: '.ab', expected: false},
            {value: 'ab.', expected: false},
            {value: 'aaaa', expected: true},
            {value: 'Abcb', expected: true},
            {value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', expected: true},
            {value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.', expected: false},  
        ]
        testCases.forEach(({value, expected}) => {
            it(`Value '${value}' should be validated as ${expected}`, () => {
                assert.equal(checkAnswer(value), expected)
            })
        })
    })
})
import {hideBin} from 'yargs/helpers'
import yargs from 'yargs'
import {PugComposer} from './pug'

const argv = yargs(hideBin(process.argv))
    .option('composer', {
        alias: 'c',
        type: 'string',
    })
    .option('source', {
        alias: 's',
        type: 'string',
    })
    .option('destination', {
        alias: 'd',
        type: 'string',
    })
    .argv

let Composer = null

switch (argv.c) {
    case 'pug':
        Composer = PugComposer
        break
    default:
        console.log('Please provide the composer (--composer|--c) in the command.')
        process.exit(1)
        break
}

if (!argv.s) {
    console.log('Please provide the source (--source|--s) in the command.')
    process.exit(1)
}

try {
    Composer && new Composer().composeFile(argv.s, argv.d)
}
catch (e) {
    console.log(e)
    process.exit(1)
}
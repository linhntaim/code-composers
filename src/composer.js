import fs from 'fs'
import path from 'path'

export class Composer {
    /**
     *
     * @param {String} content
     * @return {String}
     */
    compose(content) {
        return content
    }

    /**
     *
     * @param {String} inFile
     * @param {String} outFile
     * @return {Composer|*}
     */
    composeFile(inFile, outFile = '') {
        inFile = inFile ? inFile.trim() : ''
        if (!inFile) {
            throw 'Source is undefined.'
        }
        if (!fs.existsSync(inFile)) {
            throw 'Source [' + inFile + '] does not exist.'
        }

        outFile = outFile ? outFile.trim() : ''
        if (!outFile) {
            outFile = inFile + '.' + this.composedFileExtension()
        }
        const dir = path.dirname(outFile)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true})
        }
        fs.writeFileSync(outFile, this.compose(fs.readFileSync(inFile).toString('utf8')))
        return this
    }

    composedFileExtension() {
        return 'composed'
    }
}
import {Composer} from '../composer'
import parse5 from 'parse5'

export const SPACE_4 = '    '
export const SPACE_2 = '  '
export const SPACE_TAB = '\t'
export const EOL_WINDOWS = '\r\n'
export const EOL_UNIX = '\n'
export const EOL_MAC = '\r'

export class PugComposer extends Composer {
    constructor(space = SPACE_4, eol = EOL_WINDOWS) {
        super()

        this.space = space
        this.eol = eol
        this.lines = []
    }

    compose(content) {
        this.lines = []
        this.traverseNode(parse5.parse(content))
        return this.lines.join(this.eol)
    }

    traverseNode(node, level = 0, previousNode = null, nextNode = null) {
        switch (node.name) {
            case '#document':
                this.traverseChildNodes(node, 0)
                break
            case '#text':
                this.printTextNode(node, level, previousNode, nextNode)
                break
            case '#comment':
                this.printCommentNode(node, level)
                break
            default:
                this.printTagNode(node, level)
                    .traverseChildNodes(node, level)
        }
        return this
    }

    printTextNode(node, level, previousNode = null, nextNode = null) {
        if (node.value.trim() === ''
            && previousNode && 'tagName' in previousNode
            && nextNode && 'tagName' in nextNode) {
            return this
        }
        this.printTextNodeLine(
            node,
            level,
            !previousNode || !('tagName' in previousNode),
            !nextNode || !('tagName' in nextNode),
        ).forEach(line => {
            console.log(line)
            this.lines.push(line)
        })
        return this
    }

    printCommentNode(node, level) {
        this.printCommentNodeLine(node, level).forEach(line => {
            console.log(line)
            this.lines.push(line)
        })
        return this
    }

    printTagNode(node, level) {
        const line = this.printTagNodeLine(node, level)
        console.log(line)
        this.lines.push(line)
        return this
    }

    printTextNodeLine(node, level, trimSpaceLeft = false, trimSpaceRight = false) {
        return this.printText(node, trimSpaceLeft, trimSpaceRight).map(text => {
            return this.printSpace(level) + text
        })
    }

    printCommentNodeLine(node, level) {
        return this.printComment(node).map(text => {
            return this.printSpace(level) + text
        })
    }

    printTagNodeLine(node, level) {
        return this.printSpace(level) + this.printTag(node)
    }

    printSpace(level) {
        return this.space.repeat(level)
    }

    printText(node, trimSpaceLeft = true, trimSpaceRight = true) {
        return node.value.trim().split(/\r*\n|\r/).map(text => {
            if (trimSpaceLeft && trimSpaceRight) {
                text = text.trim()
            } else if (trimSpaceLeft) {
                text = text.replace(/^\s+/, '')
            } else if (trimSpaceRight) {
                text = text.replace(/\s+$/, '')
            }
            return '| ' + text
        })
    }

    printComment(node) {
        return node.value.trim().split(/\r*\n|\r/).map(comment => {
            return '// ' + comment.trim()
        })
    }

    printTag(node) {
        let name = node.tagName
        let id = ''
        let classes = []
        let attributes = []
        node.attrs.forEach(attribute => {
            switch (attribute.name) {
                case 'id':
                    id = '#' + attribute.value.trim()
                    break
                case 'class':
                    (classesString => {
                        if (classesString !== '') {
                            classes.push(...classesString.split(/\s+/))
                        }
                    })(attribute.value.trim())
                    break
                default:
                    attributes.push(this.printAttribute(attribute))
                    break
            }
        })
        if (name === 'div' && (id || classes.length)) {
            name = ''
        }
        return [
            name,
            id,
            classes.length ? '.' + classes.join('.') : '',
            attributes.length ? '(' + attributes.join(' ') + ')' : '',
        ].join('')
    }

    printAttribute(attribute) {
        return attribute.name + '="' + attribute.value + '"'
    }

    traverseChildNodes(node, level = 1) {
        node.childNodes.forEach((childNode, index) => this.traverseNode(
            childNode,
            level + 1,
            index ? node.childNodes[index - 1] : null,
            index < node.childNodes.length - 1 ? node.childNodes[index + 1] : null,
        ))
        return this
    }
}
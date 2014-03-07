parse = require '../md2slides.coffee'

gt.module 'md2slides'

gt.test 'basics', ->
    gt.arity parse, 1, 'expect single input'

withCode = '''
normal text

    code1
    code2
'''

twoSlides = '''
first slide

## second slide
'''

tripleDash = '''
first slide
---
second slide
'''

tripleDash2 = '''
## Themes


---
    /* Full slide theme without a border */
'''

gt.test 'offset', ->
    parts = parse withCode
    gt.array parts
    gt.equal parts.length, 1
    html = parts.toString()
    console.log html
    # console.log 'length', html.length
    gt.string html, 'got html back'
    lines = html.trim().split '\n'
    gt.equal lines.length, 4, 'number of returned lines'
    gt.ok /<p>normal text<\/p>/.test(lines[0]), 'first line'
    gt.ok /<pre><code>code1/.test(lines[1]), 'second line'
    gt.ok /code2/.test(lines[2]), 'third line'
    gt.ok /<\/code><\/pre>/.test(lines[3]), 'fourth line'

gt.test 'offset with tabs', ->
    withTabs = withCode.replace '    ', '\t'
    parts = parse withTabs
    gt.array parts
    gt.equal parts.length, 1
    html = parts.toString()

gt.test 'triple blank windows', ->
	md = '''line\n\r\n\r\n\rline 2'''
	slides = parse md
	gt.equal slides.length, 2, 'two slides'

gt.test 'triple blank unix', ->
	md = '''line\n\n\nline 2'''
	slides = parse md
	gt.equal slides.length, 2, 'two slides'

gt.test 'separate by ##', ->
    slides = parse twoSlides
    gt.equal slides.length, 2, 'two slides'
    gt.ok /first slide/.test(slides[0]), 'first slide content', slides[0]
    gt.ok /second slide/.test(slides[1]), 'second slide content', slides[1]

gt.test 'separate by --- dashes', ->
    slides = parse tripleDash
    gt.equal slides.length, 2, 'two slides'
    gt.ok /first slide/.test(slides[0]), 'first slide content', slides[0]
    gt.ok /second slide/.test(slides[1]), 'second slide content', slides[1]
    gt.ok !/\-/g.test(slides[0]), 'first slide does not have dashes'
    gt.ok !/\-/g.test(slides[1]), 'second slide does not have dashes'

gt.test 'triple dash 2', ->
    slides = parse tripleDash2
    gt.equal slides.length, 2, 'two slides'
    gt.ok /Themes/.test(slides[0]), 'first slide content', slides[0]
    gt.ok /border/.test(slides[1]), 'second slide content', slides[1]
    gt.ok !/\-/g.test(slides[0]), 'first slide does not have dashes'
    gt.ok !/\-/g.test(slides[1]), 'second slide does not have dashes'
    gt.ok !/hr/g.test(slides[0]), 'first slide does not have hr element'
    gt.ok !/hr/g.test(slides[1]), 'second slide does not have hr element'

block = '''
# title

> line 1

### footer
'''

gt.test 'blockquote', ->
    slides = parse block
    console.log slides
    gt.equal slides.length, 1, 'single slide'
    gt.ok /blockquote/.test(slides[0]), 'there is block quote'

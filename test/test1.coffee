md2html = require '../src/md2slides'
read = require('fs').readFileSync;
join = require('path').join;

gt.module 'md 2 html tests'

gt.test 'test1.md', ->
  filename = join __dirname, 'test1.md'
  md = read filename, 'utf8'
  gt.string md, 'read string'
  slides = md2html md
  gt.array slides, 'got back slides array'
  gt.equal slides.length, 3, '3 slides'


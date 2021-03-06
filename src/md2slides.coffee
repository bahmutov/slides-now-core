{verify} = require 'check-types'
markdown = require 'marked'
removeSpeakerNotes = require './remove-speaker-notes.coffee'

directLinksToNewTab = (html) ->
  verify.string html, 'expected html string'

  html.replace /<a\ href=/g, '<a target="_blank" href='

md2html = (md) ->
  verify.unemptyString md, 'expected markdown text'

  severalBlankLines = /\n\r\n\r\n\r|\n\n\n|\n---/
  mdParts = md.split severalBlankLines
  htmlParts = mdParts.map (mdPart) ->
    trimmed = mdPart.trim()
    # remove --- used to separate slides
    trimmed = trimmed.replace /^---/, ''
    html = markdown trimmed
    html = directLinksToNewTab html
    html.trim()

isSlideStart = (line) ->
  isLevel1Header = /^<h1[\ |>]/
  isLevel2Header = /^<h2[\ |>]/
  isLevel1Header.test(line) or isLevel2Header.test(line)

md2slides = (md) ->
  md = removeSpeakerNotes md
  htmlParts = md2html md
  verify.array htmlParts, 'expected parts from ' + md

  slides = []
  htmlParts.forEach (html) ->
    currentSlide = null

    lines = html.split '\n'
    lines.forEach (line) ->
      if isSlideStart(line)
        if currentSlide
          slides.push currentSlide
          currentSlide = null

      if currentSlide
        currentSlide += '\n' + line
      else
        currentSlide = line

    if currentSlide
      slides.push currentSlide

  slides

module.exports = md2slides

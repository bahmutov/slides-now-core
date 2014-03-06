optionsParser = require './options.coffee'

require './bespoke-plugins/bespokeCounterPlugin.coffee'
require './bespoke-plugins/bespokeShortcutPlugin.coffee'
require './bespoke-plugins/bespokeProgressBar.coffee'
require './bespoke-plugins/bespokeThemePlugin.coffee'

md2slides = require './md2slides.coffee'
{verify} = require 'check-types'

if !$? then throw new Error('Undefined jQuery $')

window.postProcessSlide = ($slide) ->
  $img = $ 'p > img', $slide
  if $img.length == 1
    caption = $img.attr('alt')
    caption = caption.replace /\ fullscreen$/, ''
    $slide.empty()
      .append($img)
      .append('<span class="fullscreen-caption">' + caption + '</p>')
  return $slide

# Assumes the page has been cleaned from previous markup
window.mdToPresentation = (opts) ->
  if !opts? then throw new Error('Missing presentatio options')

  verify.unemptyString opts.md, 'expected markdown string'
  if !opts.element? then throw new Error('Undefined element to bind presentation to')
  verify.positiveNumber opts.element.length, 'invalid element to append to ' + opts.element.selector

  readable = window.innerWidth < 400

  if readable
    $('footer').text ''
  else if opts.filename
    verify.unemptyString opts.filename, 'expected filename, got ' + opts.filename
    name = opts.filename
    lastSlashAt = opts.filename.lastIndexOf '/'
    if lastSlashAt != -1
      name = opts.filename.substr lastSlashAt
    $('footer').text name

  # allow to restart the presentation
  $('article.bespoke-parent').unbind()
  $('article').remove()

  # custom UI options from Markdown text
  options = optionsParser.getSlidesNowOptions opts.md
  md = optionsParser.removeOptionsLines opts.md

  if readable
    $('body').removeClass('classic').addClass('full')
  else if options.theme?
    verify.unemptyString options.theme, 'expected string theme name ' + options.theme
    $('body').removeClass('classic').addClass(options.theme)

  footerText = options.footer || options.title
  if footerText? and !readable
    $('footer').text footerText
  if options['font-family']? then $('body').css('font-family', options['font-family'])
  if options['font-size']? then $('body').css('font-size', options['font-size'])

  wrapSection = (text) ->
    $slide = $('<section>\n' + text + '\n</section>\n')
    return $slide

  $article = opts.element.append '<article>'
  addSlide = (text) ->
    if !text? then return
    if text.length < 100
      if !/<img\ /.test(text)
        $span = $('<span class="centered">\n' + text + '\n</span>')
        $span.addClass('fullHorizontal')
        $span.addClass('centerVertical')

        $slide = $('<section>')
        $slide.append $span
      else
        $slide = wrapSection text
    else
      $slide = wrapSection text

    $slide = postProcessSlide $slide

    $('article').append $slide

  htmlParts = md2slides md
  htmlParts.forEach addSlide

  $('body').addClass('slides-now')

  # console.log 'converted markdown to\n' + $article.innerHTML
  if !readable
    try
      if options.timer?
        # timer duration in minutes, convert to seconds
        bespoke.plugins.progressBar.timer(options.timer * 60)
      else
        bespoke.plugins.progressBar.removeTimer()
    catch e
      # do nothing

    if opts.recenter then recenter()
    if opts.recenterImages then recenterImages()

    bespoke.horizontal.from 'article',
      hash: true
      vertical: true
      keyShortcuts: true
      progressBar: true
      themes: true
      # slideCounter: true


    # resize code samples intelligently
    $('pre').flowtype
      minFont: 6
      maxFont: 40
      minimum: 250
      maximum: 1200
      # fontRatio: 55
      # lineRatio: 1.45

    recenterCodeBlocks()
    CodeBox 'pre'

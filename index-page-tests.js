$(function () {
  'use strict';
  QUnit.module('generated example presentation');

  QUnit.test('it is a function', function () {
    QUnit.equal(typeof window.mdToPresentation, 'function');
  });

  var md = document.getElementById('md').innerHTML;
  window.mdToPresentation({
    md: md,
    filename: 'example',
    element: $('#presentation'),
    mobile: false
  });

  QUnit.test('number of slides', function () {
    var slides = $('#presentation > article > section');
    QUnit.ok(slides.length > 4, 'number of slides');
  });

  QUnit.test('title', function () {
    var title = $('#presentation > article > section h1').text();
    QUnit.equal(title, 'slides-now-core', 'correct title');
  });

  QUnit.test('one slide should be active', function () {
    var active = $('section.bespoke-active');
    QUnit.equal(active.length, 1, 'probably first slide');
  });

  QUnit.module('postProcessSlide');

  QUnit.test('basics', function () {
    QUnit.equal(typeof window.postProcessSlide, 'function', 'it is a function');
  });

  QUnit.test('fullscreen image inside a slide', function () {
    var html = '<section class="bespoke-slide bespoke-active">\n' +
      '<p><img src="https://raw.github.com/bahmutov/talks/master/images/border.jpg" alt="slide four fullscreen"></p>\n'+
      '</section>\n';
    var $slide = $(html);
    var $img = $('p > img', $slide);
    QUnit.equal($img.length, 1, 'found image inside slide');
    var text = $img.attr('alt');
    QUnit.equal(typeof text, 'string', 'found alt text');
    QUnit.equal(text, 'slide four fullscreen', 'correct alt text');

    $slide = window.postProcessSlide($slide);
    QUnit.equal(typeof $slide, 'object', 'returns an object');

    var caption = $('.fullscreen-caption', $slide).text();
    QUnit.equal(caption, 'slide four', 'correct caption from image alt text');
  });

  QUnit.test('fullscreen image without caption', function () {
    var html = '<section class="bespoke-slide bespoke-active">\n' +
      '<p><img src="https://raw.github.com/bahmutov/talks/master/images/border.jpg" alt="fullscreen"></p>\n'+
      '</section>\n';
    var $slide = $(html);
    var $img = $('p > img', $slide);
    QUnit.equal($img.length, 1, 'found image inside slide');
    var text = $img.attr('alt');
    QUnit.equal(typeof text, 'string', 'found alt text');
    QUnit.equal(text, 'fullscreen', 'correct alt text');

    $slide = window.postProcessSlide($slide);
    QUnit.equal(typeof $slide, 'object', 'returns an object');

    var caption = $('.fullscreen-caption', $slide);
    QUnit.equal(caption.length, 0, 'there should be no caption');
  });
});

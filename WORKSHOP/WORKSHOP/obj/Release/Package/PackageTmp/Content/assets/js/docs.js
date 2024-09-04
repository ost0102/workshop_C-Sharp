$(document).ready(function() {
  $('pre').each(function() {
    hljs.highlightBlock($(this)[0]);
  });
})

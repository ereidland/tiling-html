//From: https://gist.github.com/cowboy/450017
jQuery.expr[':'].focus=function(a){return a===document.activeElement&&(a.type||a.href)};
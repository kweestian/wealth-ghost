/*====================================================
  TABLE OF CONTENT
  1. function declearetion
  2. Initialization
====================================================*/

/*===========================
 1. function declearetion
 ==========================*/
var themeApp = {
  featuredMedia: function(){
    $(".post").each(function() {
      var thiseliment = $(this);
      var media_wrapper = $(this).find('featured');
      var media_content_image = media_wrapper.find($('img'));
      var media_content_embeded = media_wrapper.find('iframe');
      if (media_content_image.length > 0) {
        $(media_content_image).addClass('img-responsive').prependTo(thiseliment).wrap("<div class='featured-media'></div>");
        thiseliment.addClass('post-type-image');
        media_wrapper.remove();
      }
      else if (media_content_embeded.length > 0) {
        $(media_content_embeded).prependTo(thiseliment).wrap("<div class='featured-media'></div>");
        thiseliment.addClass('post-type-embeded');
      }
    });
  },
  setcolumn: function(){
    $container = $('#item-container');
    $items = $('.item');
    conWidth=$('#item-container').width();
    col= 0;
    if(conWidth > 1600) {
      col = 4;
    }
    else if(conWidth > 1200) {
      col = 3;
    }
    else if(conWidth > 767) {
       col = 2;
    }
    else {
      col = 1;
    }
    colspace = 30;
    var width = Math.floor((conWidth-(colspace*(col+1)))/col);
    $items.css('width', width);
  },
  masonryLayout: function(){
    themeApp.setcolumn();

    var $msnry = $container.masonry({
      itemSelector: '.item',
      columnWidth: '.item',
      isAnimated: true,
      transitionDuration: 0
    });
    $items.hide();
    $container.imagesLoaded(function() {
      $items.addClass('animate').show();
      $msnry.masonry();
    });
  },


  loadMore: function(){
    var $next_page_link = $('.older-posts').attr('href');
    var $load_more = $('.page-loader');
    var $load_button_string = $load_more.html();
    var $loading_string = '<i class="fa fa-circle-o-notch fa-spin"></i> Please wait...';
    var $end_post_string = 'No more Post';

    // set loading string - CASE: no more post
    if ($next_page_link === undefined) {
      $load_more.html($end_post_string);
    }

    $load_more.on('click', function(e){
      e.preventDefault();
      if ($next_page_link !== undefined) {
        $load_more.html($loading_string);
        $.ajax({
          url: $next_page_link,
        }).success(function(result) {
          var $html = $(result);
          var $newContent = $('#item-container', $html).contents();
          $($newContent).hide();
          $container.append($newContent);
          themeApp.setcolumn();
          themeApp.featuredMedia();
          // $newContent.find('.post').each(function() {
          //   featured_media(this);
          // });
          themeApp.responsiveIframe();
          $newContent.imagesLoaded(function() {
            $('.post').addClass('animate').show();
            // responsive_iframe();
            $container.masonry('appended', $newContent);
            $html = "";
            if ($next_page_link === undefined) {
              $load_more.text($end_post_string);
            } else {
              $load_more.text($load_button_string);
            }  
          });
          $next_page_link = $('.older-posts', $html).attr('href');
          themeApp.commentCount();
        });
      }
    });
  },
  masonryOnResize: function(){
    $(window).resize(function () {
    themeApp.setcolumn();
      themeApp.masonryLayout.$msnry;
    });
  },
  responsiveIframe: function() {
    $('.post').fitVids();
  },
  commentCount: function () {
    var s = document.createElement('script'); s.async = true;
    s.type = 'text/javascript';
    s.src = 'http://' + disqus_shortname + '.disqus.com/count.js';
    (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
  },
  headerToggle: function(){
    $('.toggle-button').on('click', function(){
      $('.header').toggleClass('opened');
      $('.main-content-wrapper').toggleClass('expanded');
      $('.top-bar').toggleClass('expanded');      
      setTimeout(function(){        
        themeApp.masonryLayout();
      }, 400);
    });
  },
  sidebarToggle: function(){
    $('.sidebar-open').on('click', function(){
      $('.sidebar-wrap').toggleClass('opened');
      $('.top-bar').toggleClass('push-left');
    });
  },
  siteSearch: function(){
    $('.search-icon').on('click', function(){
      $('#search-field').focus();
    });
    $('#search-field').ghostHunter({
      results: "#results ul",
      displaySearchInfo   : false,
      onKeyUp: true,
      result_template : "<li><a href='{{link}}'>{{title}}</a></li>",
    });
  },
  sidebarScrollbar: function(){
    $('.sidebar').niceScroll({
        cursorwidth: 8,
        cursorborder: "0px solid #00ffff",
        cursorborderradius: 0,
        scrollspeed: 40,
        mousescrollstep: 60,
        railpadding: {right:0},
        autohidemode: false,
        // background: "#fcfcfc"
    });
  },
  tagcloud:function(){
    var FEED_URL = "/rss/";
    var primary_array = [];
    $.get(FEED_URL, function (data) {
      $(data).find("category").each(function () {
        var el = $(this).text();
        if ($.inArray(el, primary_array) == -1) {
          primary_array.push(el);
        }
      });
      var formated_tag_list = "";
      for ( var i = 0; i < primary_array.length; i = i + 1 ) {
        var tag = primary_array[ i ];
        var tagLink = tag.toLowerCase().replace(/ /g, '-');
        formated_tag_list += ("<a href=\"/tag/" + tagLink + "\">" + tag + "</a>");
      }
      $('#tagcloud').append(formated_tag_list);
    });
  },
  mailchimp:function() {
    var form = $('#mc-embedded-subscribe-form');
    form.attr("action", mailchimp_form_url);
    var message = $('#message');
    var submit_button = $('mc-embedded-subscribe');
    function IsEmail(email) {
      var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      return regex.test(email);
    }
    form.submit(function(e){
      e.preventDefault();
      $('mc-embedded-subscribe').attr('disabled','disabled');
      if($('#mce-EMAIL').val() != '' && IsEmail($('#mce-EMAIL').val())) {
        message.html('please wait...').fadeIn(1000);
        var url=form.attr('action');
        if(url=='' || url=='YOUR_MAILCHIMP_WEB_FORM_URL_HERE')
        {
          alert('Please config your mailchimp form url for this widget');
          return false;
        }
        else{
          url=url.replace('?u=', '/post-json?u=').concat('&c=?');
          var data = {};
          var dataArray = form.serializeArray();
          $.each(dataArray, function (index, item) {
              data[item.name] = item.value;
          });
          $.ajax({
              url: url,
              type: "POST",
              data: data,
              success: function(response){
                  if (response.result === 'success') {
                      message.html(success_message).delay(10000).fadeOut(500);
                      $('mc-embedded-subscribe').removeAttr('disabled');
                  }
                  else{
                    message.html(response.result).delay(10000).fadeOut(500);
                    $('mc-embedded-subscribe').removeAttr('disabled');
                  }
              },
              dataType: 'jsonp',
              error: function (response, text) {
                  console.log('mailchimp ajax submit error: ' + text);
                  $('mc-embedded-subscribe').removeAttr('disabled');
              }
          });
          return false;
        }
      }
      else {
        message.html('Please provide valid email').fadeIn(1000);
        $('mc-embedded-subscribe').removeAttr('disabled');
      }            
    });
  },
  googlePlus:function() {
    if(badge_type !== "" && google_plus_url !== "") {
      $('body').append('<script src="https://apis.google.com/js/platform.js" async defer></script>');
      var container = $('#google-plus');
      var width = container.width();
      var google_plus_code = '<div class="g-'+badge_type+'" data-width="'+width+'" data-href="'+google_plus_url+'" data-rel="publisher"></div>';
      container.append(google_plus_code);
    }
  },
  facebook:function() {
    var fb_page = '<iframe src="//www.facebook.com/plugins/likebox.php?href='+facebook_page_url+'&amp;width=262&amp;colorscheme=light&amp;show_faces=true&amp;stream=false&amp;header=false&amp;height=300" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:100%; height:300px;" allowTransparency="true"></iframe>';
    $('#fb').append(fb_page);
    $("#fb").fitVids();
  },
  twitter: function() {
    var twitter_block = '<a class="twitter-timeline" href="'+twitter_url+'" data-widget-id="'+twitter_widget_id+'" data-link-color="#0062CC" data-chrome="nofooter noscrollbar" data-tweet-limit="3">Tweets</a>';
          twitter_block += "<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+\"://platform.twitter.com/widgets.js\";fjs.parentNode.insertBefore(js,fjs);}}(document,\"script\",\"twitter-wjs\");</script>";
          
          $('#twitter').append(twitter_block);
  },
  placeholderIE: function(){
    $('[placeholder]').focus(function() {
      var input = $(this);
      if (input.val() == input.attr('placeholder')) {
        input.val('');
        input.removeClass('placeholder');
      }
    }).blur(function() {
      var input = $(this);
      if (input.val() == '' || input.val() == input.attr('placeholder')) {
        input.addClass('placeholder');
        input.val(input.attr('placeholder'));
      }
    }).blur();
  },
  backToTop: function() {
    $(window).scroll(function(){
      if ($(this).scrollTop() > 100) {
          $('#back-to-top').fadeIn();
      } else {
          $('#back-to-top').fadeOut();
      }
    });
    $('#back-to-top').on('click', function(e){
      e.preventDefault();
      $('html, body').animate({scrollTop : 0},1000);
          return false;
    });
  },
  init: function(){
    themeApp.featuredMedia();
    themeApp.masonryLayout();
    themeApp.responsiveIframe();
    themeApp.commentCount();
    themeApp.headerToggle();
    themeApp.sidebarToggle();
    themeApp.siteSearch();
    themeApp.sidebarScrollbar();
    themeApp.tagcloud();
    themeApp.mailchimp();
    themeApp.googlePlus();
    themeApp.facebook();
    themeApp.twitter();
    themeApp.loadMore();
    themeApp.masonryOnResize();
    themeApp.placeholderIE();
    themeApp.backToTop();
  }
}

/*===========================
 2. Initialization
 ==========================*/
 $(document).ready(function(){
  themeApp.init();
 });
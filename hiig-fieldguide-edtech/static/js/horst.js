/*jslint browser: true*/
/*global $, jQuery, alert, console*/

// ToggleText function
$.fn.extend({
  toggleText: function (a, b) {
    return this.text(this.text() == b ? a : b);
  },
});

//
// Normalise slide height to prevent jumping
//---------------------------------------------------------

function normalizeSlideHeights() {
    console.log("I'm here to normalise");
  $(".carousel").each(function () {
    var items = $(".carousel-item", this);
    // reset the height
    items.css("min-height", 0);
    // set the height
    var maxHeight = Math.max.apply(
      null,
      items
        .map(function () {
          console.log($(this), $(this).outerHeight());
          return $(this).outerHeight();
        })
        .get()
    );
    console.log("Soooo it is:", maxHeight);
    items.css("min-height", maxHeight + "px");
  });
}

//
// Table of contents
//-----------------------------------------------------------------
var selector;

function makeToC() {
  console.log("Creating TOC …");
  $("article").attr("data-spy", "scroll");
  $("body").attr("data-target", ".ms-toc");
  $("article").attr("data-offset", "-300");

  $(".ms-toc").empty();
  $(".ms-toc")
    .append(
      '<ul class="ms-toc-entries nav nav-pills  sticky-top flex-column side-nav" aria-hidden="false"></ul>'
    )
    .append(
      '<ul class="ms-toc-abstract-entries nav nav-pills  sticky-top flex-column side-nav" aria-hidden="true"></ul>'
    );

  selector = $(".tab-pane.active article :header");

  addReduced();
  addDetailed();

  enableListener();
  console.log("TOC refreshed");
}

// Build abstract lines
function addReduced() {
  // foreach header append a line
  for (var i = 0; i < selector.length; i++) {
    if ($(selector[i]).attr("id")) {
      // Add elements to nav
      for (var j = 2; j < 5; j++) {
        if (selector[i].nodeName == "H" + j) {
          $("ul.ms-toc-abstract-entries").append(
            '<li class="nav-item side-nav ms-toc-abstract-entry ms-toc-abstract-entry ms-toc-abstract-entry-' +
              j +
              '"><a class="nav-link side-nav ms-toc-entry-link" href="#' +
              $(selector[i]).attr("id") +
              '"></a></li>'
          );
        }
      }
    }
  }
}

// Build full toc
function addDetailed() {
  // foreach header append a line
  for (var i = 0; i < selector.length; i++) {
    if ($(selector[i]).attr("id")) {
      // Add elements to nav
      for (var j = 0; j < 4; j++) {
        if (selector[i].nodeName == "H" + j) {
          $("ul.ms-toc-entries").append(
            '<li class="nav-item side-nav ms-toc-entry ms-toc-entry-level' +
              j +
              '"><a class="nav-link side-nav ms-toc-entry-link" href="#' +
              $(selector[i]).attr("id") +
              '">' +
              selector[i].textContent +
              "</a></li>"
          );
        }
      }
    }
  }
}

//
// Collapse oversized marginal notes
//-------------------------------------------------------------
function collapseOversizedMarginals() {
  $(".tab-pane.active .ms-text").each(function () {
    var numAsides = $(this)
      .children(".ms-col-marginal")
      .children("aside").length;

    /* Deal with marginals if exist */
    if (numAsides > 0) {
      var isOverflowing = false;
      var canOverflow = false;

      /* Content heights */
      var heightAsides = 0;
      $(this)
        .children(".ms-col-marginal")
        .children("aside")
        .each(function () {
          heightAsides = heightAsides + $(this).height();
        });
      //                console.log('Asides:', $(this), heightAsides)
      var heightContent = $(this)
        .children(".ms-col-content")
        .children("p")
        .height();
      //                console.log('Content:', $(this), heightContent)

      /* Check whitespace under content */
      if (heightAsides - heightContent > 20) {
        isOverflowing = true;
      }

      /* Check if there is no asides or plugins after overflowing, single aside */
      // TODO, check hight of next element, let all children flow?
      if ($(this).next().hasClass("ms-text")) {
        if (
          $(this).next().children(".ms-col-marginal").children().length == 0
        ) {
          if (numAsides < 2) {
            canOverflow = true;
          }
        }
      }

      if (isOverflowing) {
        // if overflow possible, just set height of row
        if (canOverflow) {
          $(this)
            .children(".ms-col-marginal")
            .addClass("marginals-overflowing");
          $(this).children(".ms-col-marginal").css("max-height", heightContent);
          $(this)
            .children(".ms-col-marginal")
            .children("aside")
            .addClass("show");
        }
        // otherwise start collapsing
        else {
          // set hight of marginal to be no more than content
          $(this).children(".ms-col-marginal").addClass("marginals-collapsed");
          $(this).children(".ms-col-marginal").css("max-height", heightContent);

          /* Calculate aside height */
          numAsides = $(this)
            .children(".ms-col-marginal")
            .children(" aside").length;

          var medHeightAsides = heightContent / numAsides;
          medHeightAsides = medHeightAsides - 10;

          $(this)
            .children(".ms-col-marginal")
            .children(" aside")
            .each(function () {
              if ($(this).children("p").height() < medHeightAsides) {
                $(this).css("flex-shrink", 0);
                $(this).css("flex-grow", 0);
                $(this).css("flex-basis", $(this).children("p").height());
                $(this).addClass("show");
              } else {
                $(this).css("flex-shrink", 1);
                $(this).css("flex-basis", medHeightAsides);
                $(this).addClass("collapsed");
              }
            });

          //                $(this).children('.ms-col-marginal').children(' aside').css('height', heightAsides);
        }
      } else {
        $(this).children(".ms-col-marginal").children("aside").addClass("show");
      }
    }
  });
}

//
// Collapse oversized infobox
//-------------------------------------------------------------
function collapseOversizedInfobox() {
  $(".ms-plugin-infobox").each(function () {
    var isOverflowing = false;
    var canOverflow = false;
    var maxHeight = 200;

    /* Check height */
    var heightContent = $(this).height();
    if (heightContent > maxHeight) {
      isOverflowing = true;
    }

    /* Check if collapse is set to true > class collapse exists */
    if ($(this).hasClass("collapse")) {
      canOverflow = true;
    }

    if (isOverflowing) {
      // if collapse set to true, adjust class and show button
      if (canOverflow) {
        $(this).addClass("infobox-overflowing");
        $(this).after(
          '<button class="btn btn-primary toggleInfobox" type="button">Expand infobox</button>'
        );
      }
      enableListener();
    }
  });
}

//
// Handle anchor links
//-------------------------------------------------------------

function changeToTab(prevTab, targetTab) {
  var offset = 80;

  // console.log("Changing from ", prevTab, " to ", targetTab)

  // Show tab manually to avoid collsion with carousel
  // (bootstraps throws error, used try catch to continue script)
  try {
    prevTab.removeClass("active fade show");
    $(prevTab.attr("href")).removeClass("active");

    targetTab.addClass("active fade show");
    $(targetTab.attr("href")).addClass("active");

    console.log("Changed to tab ", targetTab);
  } catch (err) {
    console.log("Changing tab errors: ", err);
  }

  // Show tab
  // (bootstraps throws error, used try catch to continue script)
  // try {
  //     console.log('Changing tabs')
  //     $("a[href='"+hashValue+"']").tab('show');

  // } catch(err) {
  //     console.log('Changing tab errors: ', err)
  // }

  //Reload TOC and collapse/show marginals after changing tabs
  setTimeout(makeToC, 200);
  setTimeout(collapseOversizedMarginals, 300);

  setTimeout(function () {
    scrollBy(0, -offset);
    $(firstElementClass)[0].scrollIntoView(true);
  }, 0);

  // Scroll to top if below fixed tabs
  // if ($('.ms-tabs')[0].getBoundingClientRect().top === 0){
  //     var firstElementClass = targetTab + ' .ms-row:first-child'
  //     setTimeout(function(){
  //         scrollBy(0, -offset);
  //         $(firstElementClass)[0].scrollIntoView(true)
  //     },
  //     0);
  // }
}

function handleAnchorLinks(hashValue) {
  let activeTab = $("#masterTab a").filter(".active");

  if ($(hashValue).hasClass("tab-pane")) {
    // console.log('Clicked a tab', activeTab)

    changeToTab(activeTab, $(hashValue));
  } else if (hashValue.includes("heading")) {
    // console.log('Clicked a heading')

    var tabID = "#" + $(hashValue).parents(".tab-pane").attr("id");

    changeToTab(activeTab, $(tabID));
  } else {
    console.log("hash unknown");
  }

  window.location.hash = hashValue;
}

//
// Event listener
//---------------------------------------------------------------

function enableListener() {
  // Tab-button on mobile
  $(".tab-item").click(function (value) {
    $("#dropdownMenuButton").text($(this).text());
  });

  // Pause Carousel

  // $(".carousel").carousel('pause');
  // $('.carousel-item .ms-col-content').click(function(){
  //     if ($(this).parents('.carousel').hasClass('paused')) {
  //         $(this).parents('.carousel-item').addClass('play').delay(800).queue(function() {
  //             $(this).removeClass('play').dequeue();
  //         });
  //         $(this).parents('.carousel').toggleClass('paused');
  //         $(this).parents('.carousel').carousel('cycle');
  //         $(this).parents('.carousel').delay(500).queue(function() {
  //             $(this).carousel('next').dequeue();
  //         });
  //     }
  //     else{
  //         $(this).parents('.carousel-item').addClass('pause').delay(800).queue(function(){
  //             $(this).removeClass('pause').dequeue();
  //         });
  //         $(this).parents('.carousel').toggleClass('paused');
  //         $(this).parents('.carousel').carousel('pause');
  //     }
  // });

  // Show collapsed marginals on click
  $(".marginals-collapsed")
    .children("aside")
    .unbind("click")
    .click(function () {
      $(this).toggleClass("show-collapsed");
    });

  $(".marginals-collapsed")
    .children("aside")
    .mouseleave(function () {
      $(this).removeClass("show-collapsed");
    });

  // Toggle infobox on click
  $(".toggleInfobox")
    .unbind("click")
    .click(function () {
      $(this).prev().toggleClass("show-collapsed");
      $(this).toggleText("Collapse infobox", "Expand infobox");
    });

  // Jump to headline in right tab with offset
  $('a[href^="#"]')
    .unbind("click")
    .click(function (event) {
      var hashValue = $(this).attr("href");

      // Prevent default behaviour and proceed below instead
      event.preventDefault();

      // collapse TOC on mobile
      $(".ms-toc").removeClass("ms-toc-active");

      handleAnchorLinks(hashValue);
    });

  //Trigger confetti
  $(".ms-inline-thanks")
    .click(function () {
      $("#confetti").toggleClass("rain");
    })
    .mouseenter(function () {
      $("#confetti").toggleClass("rain");
    })
    .mouseleave(function () {
      $("#confetti").removeClass("rain");
    });

  //Show TOC on mobile
  $(".ms-tabs a.ms-trigger-toc")
    .unbind("click")
    .click(function (event) {
      $(".ms-toc").toggleClass("ms-toc-active");
    });
  $(".ms-article-top a.ms-button-toc")
    .unbind("click")
    .click(function (event) {
      $(".ms-toc").toggleClass("ms-toc-active");
    });

  $("article").click(function (event) {
    $(".ms-toc").removeClass("ms-toc-active");
  });

  // Toggle navigation bar
  $("#navToggle")
    .unbind("click")
    .click(function () {
      $("#navContent").slideToggle();
      $("#main-logo").fadeToggle();
    });
}

//
// Document ready calls
//-----------------------------------------------------------------

$(function () {
  //  delay for anchors to prevent wrong scrolling position
  if (location.hash) {
    var hashValue = location.hash;
    handleAnchorLinks(hashValue);
  } else {
    console.log("Calling makeToC from Document ready");
    makeToC();
  }

  // Enable popover (inline references)
  $('[data-toggle="popover"]').popover();

  // Caluclate heights after DOM finished loading
  setTimeout(function () {
    // Collpase/Show Marginals
    collapseOversizedMarginals();
    collapseOversizedInfobox();

    // Normalise slide height
    normalizeSlideHeights();
  }, 600);

  $("body").scrollspy({ target: ".ms-toc", offset: 100 });

  // listner to toggle class
  enableListener();
});

$(window).on("resize orientationchange", normalizeSlideHeights);

{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 $(document).ready(function() \{\
  var $container = $(".grid"); // the container with all the elements to filter inside\
  var filters = \{\}; //should be outside the scope of the filtering function\
\
  /* --- read the documentation on isotope.metafizzy.co for more options --- */\
  var $grid = $container.isotope(\{\
    itemSelector: ".item",\
    layoutMode: "fitRows",\
    getSortData: \{\
      date: function (itemElem) \{\
        return $(itemElem).attr("data-date");\
      \}\
    \},\
    sortBy: 'date',\
    sortAscending: false\
  \});\
\
  // save some classes for later usage\
  var activeClass = "selected",\
    comboClass = "combine",\
    exclClass = "exclusive",\
    resetClass = "reset";\
\
  var $defaults = $("a." + activeClass + '[data-filter-value=""]');\
  $(".option-set a").click(function(e) \{\
    var $this = $(this); // cache the clicked link\
    var comboFilter,\
      filterAttr = "data-filter-value";\
    if (resetClass && !$this.hasClass(resetClass)) \{\
      var filterValue = $this.attr(filterAttr);\
      var $optionSet = $this.parents(".option-set");\
      var group = $optionSet.attr("data-filter-group");\
      var filterGroup = filters[group];\
      if (!filterGroup) \{\
        filterGroup = filters[group] = [];\
      \}\
      var $selectAll = $optionSet.find("a[" + filterAttr + '=""]');\
      $("." + resetClass).removeClass(activeClass);\
      comboFiltering(\
        $this,\
        filters,\
        filterAttr,\
        filterValue,\
        $optionSet,\
        group,\
        $selectAll,\
        activeClass,\
        comboClass,\
        exclClass\
      );\
      comboFilter = getComboFilter(filters);\
      if (!comboFilter.length) $("a." + resetClass).addClass(activeClass);\
      $this.toggleClass(activeClass);\
    \} else \{\
      filters = \{\};\
      comboFilter = "";\
      $(".option-set a").removeClass(activeClass);\
      $(this).addClass(activeClass);\
      $defaults.addClass(activeClass);\
    \}\
    $grid.isotope(\{\
      filter: comboFilter\
    \});\
    e.preventDefault();\
  \});\
\
  // Live search filter\
  $('#search-input').on('keyup', function () \{\
    var keyword = $(this).val().toLowerCase();\
    $grid.isotope(\{\
      filter: function () \{\
        var text = $(this).text().toLowerCase();\
        return text.indexOf(keyword) > -1;\
      \}\
    \});\
  \});\
\
  // Button-based filtering\
  $(".option-set").on("click", ".filter-btn", function () \{\
    var $this = $(this);\
    var $group = $this.closest(".option-set");\
    var group = $group.attr("data-filter-group");\
    var filterValue = $this.attr("data-filter-value");\
\
    $group.find(".filter-btn").removeClass("selected");\
    $this.addClass("selected");\
\
    filters[group] = filterValue ? [filterValue] : [];\
    var comboFilter = getComboFilter(filters);\
    $grid.isotope(\{ filter: comboFilter \});\
  \});\
\
  // Dropdown filter for year\
  $('#year-filter').on('change', function () \{\
    var filterValue = $(this).val();\
    filters['year'] = filterValue ? [filterValue] : [];\
    var comboFilter = getComboFilter(filters);\
    $grid.isotope(\{ filter: comboFilter \});\
  \});\
\
  // Add 'upcoming' class\
  $(".grid .item").each(function () \{\
    var dateStr = $(this).attr("data-date");\
    if (!dateStr) return;\
\
    var itemDate = new Date(dateStr);\
    var today = new Date();\
    today.setHours(0, 0, 0, 0);\
\
    if (itemDate >= today) \{\
      $(this).addClass("upcoming");\
    \}\
\
    // Add year class automatically (e.g., .y2024)\
    var year = itemDate.getFullYear();\
    $(this).addClass("y" + year);\
  \});\
\
  // Concert count\
  $("#count-number").text($(".grid .item").length);\
\
\});\
\
function comboFiltering(\
  $this,\
  filters,\
  filterAttr,\
  filterValue,\
  $optionSet,\
  group,\
  $selectAll,\
  activeClass,\
  comboClass,\
  exclClass\
) \{\
  if (!$optionSet.hasClass(exclClass)) \{\
    if (!$this.hasClass(activeClass) && filterValue.length) \{\
      filters[group].push(filterValue);\
      $selectAll.removeClass(activeClass);\
    \} else if (filterValue.length) \{\
      if ($optionSet.hasClass(comboClass)) \{\
        filters[group][0] = filters[group][0].replace(filterValue, "");\
        if (!filters[group][0].length)\
          filters[group].splice(0, 1);\
      \} else \{\
        var curIndex = filters[group].indexOf(filterValue);\
        if (curIndex > -1) filters[group].splice(curIndex, 1);\
      \}\
      if (!$optionSet.find("a." + activeClass).not($this).length)\
        $selectAll.addClass(activeClass);\
    \} else \{\
      $optionSet.find("a." + activeClass).removeClass(activeClass);\
      filters[group] = [];\
    \}\
    if ($optionSet.hasClass(comboClass) && filters[group].length)\
      filters[group] = [filters[group].join("")];\
  \} else \{\
    if (!$this.hasClass(activeClass) && filterValue.length) \{\
      $optionSet.find("a." + activeClass).each(function(k, filterLink) \{\
        var removeFilter = $(filterLink).attr(filterAttr);\
        var removeIndex = filters[group].indexOf(removeFilter);\
        filters[group].splice(removeIndex, 1);\
      \});\
      filters[group].push(filterValue);\
      $optionSet.find("a." + activeClass).removeClass(activeClass);\
    \} else if (filterValue.length) \{\
      var curIndex = filters[group].indexOf(filterValue);\
      if (curIndex > -1) filters[group].splice(curIndex, 1);\
      if (!$optionSet.find("a." + activeClass).not($this).length)\
        $selectAll.addClass(activeClass);\
    \} else \{\
      $optionSet.find("a." + activeClass).removeClass(activeClass);\
      filters[group] = [];\
    \}\
  \}\
\}\
\
function getComboFilter(filters) \{\
  var i = 0;\
  var comboFilters = [];\
\
  for (var prop in filters) \{\
    var filterGroup = filters[prop];\
    if (!filterGroup.length) continue;\
    if (i === 0) \{\
      comboFilters = filterGroup.slice(0);\
    \} else \{\
      var filterSelectors = [];\
      var groupCombo = comboFilters.slice(0);\
      for (var k = 0, len3 = filterGroup.length; k < len3; k++) \{\
        for (var j = 0, len2 = groupCombo.length; j < len2; j++) \{\
          filterSelectors.push(groupCombo[j] + filterGroup[k]);\
        \}\
      \}\
      comboFilters = filterSelectors;\
    \}\
    i++;\
  \}\
\
  return comboFilters.join(", ");\
\}\
}
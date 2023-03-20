// const { data } = require("jquery");

const autoCompleteJS = new autoComplete({
  placeHolder: "Search for a publication …",
  data: {
    src: async () => {
      try {
        // Loading placeholder text
        document
          .getElementById("autoComplete")
          .setAttribute("placeholder", "Loading...");
        // Fetch External Data Source
        // https://development.graphite.page/_assets/pages_data.json
        source = await fetch("/_assets/pages_data.json", { mode: "cors" });
        data = await source.json();
        // console.log("data: ", data);
        // Post Loading placeholder text
        document
          .getElementById("autoComplete")
          .setAttribute("placeholder", autoCompleteJS.placeHolder);
        // Returns Fetched data
        return data;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    // Searches the following fields
    // (in this order, filter will leave first match)
    keys: ["title", "subtitle", "authors", "slug"],
    cache: false,
    filter: (list) => {
      // Remove duplicates
      const filteredResults = Array.from(
        new Set(list.map((value) => value.match))
      ).map((pub) => {
        return list.find((value) => value.match === pub);
      });

      // Only show publication once
      // (if match on more that one key)
      const filteredResults2 = Array.from(
        new Set(filteredResults.map((value) => value.value.slug))
      ).map((pub) => {
        return filteredResults.find((value) => value.value.slug === pub);
      });

      // console.log("2", filteredResults2);

      return filteredResults2;
    },
  },
  resultsList: {
    element: (list, data) => {
      const info = document.createElement("p");
      info.className = "resultInfos";
      if (data.results.length > 0) {
        info.innerHTML = `Displaying <strong>${data.results.length}</strong> out of <strong>${data.matches.length}</strong> results`;
      } else {
        info.innerHTML = `Found <strong>${data.matches.length}</strong> matching results for <strong>"${data.query}"</strong>`;
      }
      list.prepend(info);
    },
    noResults: true,
    maxResults: 20,
    // maxResults: undefined
    tabSelect: true,
  },
  //
  resultItem: {
    element: (item, data) => {
      // Modify Results Item Style
      item.className = "resultItem";
      // Modify Results Item Content ${JSON.stringify(data)}
      const authorHTML = (data.value.authors === undefined || data.value.authors === null) ? "" : `<span class="authors">${data.value.authors}</span>`
      item.innerHTML = `
      <p class="match">
        <span class="key">${data.key}</span>
        <span class="value">${data.match}</span>
      </p>
      <p class="pub">
        ${authorHTML}
        <span class="title">${data.value.title}</span>
        <span class="subtitle">${data.value.subtitle}</span>
        <span class="link">${data.value.url}</span>
      </p>`;
    },
    highlight: true,
  },
  events: {
    input: {
      focus: () => {
        if (autoCompleteJS.input.value.length) autoCompleteJS.start();
      },
    },
  },
  threshold: 2,
});

autoCompleteJS.input.addEventListener("selection", function (event) {
  const feedback = event.detail;
  // autoCompleteJS.input.blur();

  // Prepare User's Selected Value
  // const authorHTML = (feedback.selection.value.authors === undefined || feedback.selection.value.authors === null) ? "" : `<span class="authors">${feedback.selection.value.authors}</span>`
  // const preview = `
  //   ${authorHTML}
  //   <span class="title">${feedback.selection.value.title}</span>
  //   <span class="subtitle">${feedback.selection.value.subtitle}</span>`;

  // Render selected choice to selection div
  //document.querySelector(".selection").innerHTML = preview;

  // Open publication in new tab
  window.open(feedback.selection.value.url, '_blank').focus();
  
  // Replace Input value with the selected value
  const selection = feedback.selection.value[feedback.selection.key];
  autoCompleteJS.input.value = selection;
  
  // Console log autoComplete data feedback
  console.log(feedback);
});

// $(function() {
//   $('#search').autocomplete(
//       source: function(request, respone){
//           var searchField = $('#search').val();
//           var myExp = new RegExp(searchField, "i");
//           $.getJSON("/_assets/pages_data.json", function (data) {
//               var output = '<ul class="searchresults">';
//               $.each(data, function (key, val) {
//                   if ((val.iata.search(myExp) !== -1) || (val.name.search(myExp) !== -1)) {
//                       output += '<li>';
//                       output += '<h2>' + val.title + '</h2>';
//                       output += '<p>' + val.authors + '</p>';
//                       output += '</li>';
//                   }
//               });
//               output += '</ul>';
//               console.log(getJSON(pages_data.json));
//               console.log(output);
//               $('#update').html(output);
//           })
//         });
//       });

// $$.getJSON("page_data.json", function(data) {
//   autoComplete = [];
//   for (var i = 0, len = data.length; i < len; i++) {
//     autoComplete.push(data[i].title + ", " + data[i].authors);
//   }
//   $( "#search" ).autocomplete({
//     source: autoComplete
//   });
// });

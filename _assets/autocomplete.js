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
        const source = await fetch("pages_data.json");
        console.log("source: ", source);
        const data = await source.json();
        // Post Loading placeholder text
        document
          .getElementById("autoComplete")
          .setAttribute("placeholder", autoCompleteJS.placeHolder);
        // Returns Fetched data
        return data;
      } catch (error) {
        return error;
      }
    },
    // cache: true,
  },
  resultItem: {
    highlight: true,
  },
  events: {
    input: {
      selection: (event) => {
        const selection = event.detail.selection.value;
        autoCompleteJS.input.value = selection;
      },
    },
  },
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

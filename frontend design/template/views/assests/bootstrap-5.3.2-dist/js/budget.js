// document.getElementById('memberForm').addEventListener('submit', function(event) {
//     event.preventDefault();
//     var numMembers = document.getElementById('numMembers').value;
//     fetch('/members?num=' + numMembers)
//       .then(response => response.text())
//       .then(data => {
//         document.getElementById('memberInputs').innerHTML = data;
//       });
//   });

function generateMemberInputs() {
  var numMembers = document.getElementById('numMembers').value;
  var html = '';
  for (var i = 0; i < numMembers; i++) {
    html += `<input type="text" name="member${i+1}" placeholder="Member ${i+1}"><br>`;
  }
  html += '<button type="button" onclick="submitMemberNames()">Submit Member Names</button>';
  document.getElementById('memberInputs').innerHTML = html;
}



function submitMemberNames() {
  var memberNames = [];
  var inputs = document.querySelectorAll('input[name^="member"]');
  inputs.forEach(function(input) {
    memberNames.push(input.value);
  });
  fetch('/submitMembers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(memberNames)
  })
  .then(response => {
    if (response.ok) {
      return response.text();
    }
    throw new Error('Network response was not ok.');
  })
  .then(data => {
    console.log(data); // Handle response from server if needed
  })
  .catch(error => {
    console.error('Error submitting member names:', error);
  });
}


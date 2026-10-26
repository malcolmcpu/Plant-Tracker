var thumbUp = document.getElementsByClassName('fa-thumbs-up');
var dislike = document.getElementsByClassName('fa-thumbs-down');
var trash = document.getElementsByClassName('fa-trash');

//FUNCTIONALITY FOR THUMBS UP CLICK EVENT
Array.from(thumbUp).forEach(function (element) {
  element.addEventListener('click', function () {
    const id = this.parentNode.parentNode.childNodes[1].dataset.userId;
    //
    //EXPLANATION:
    //Variables "name" and "msg" can be commented out, as using the user "id" naturally give us access to "name" and "msg"
    // const name = this.parentNode.parentNode.childNodes[1].innerText;
    // const msg = this.parentNode.parentNode.childNodes[3].innerText;
    const thumbUp = parseFloat(
      this.parentNode.parentNode.childNodes[5].innerText,
    );
    fetch('likeMsg', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // name: name,
        // msg: msg,
        // EXPLANATION: "name" and "msg" keys above can be commented out as using "id" below gives us access to the same data
        id,
        thumbUp,
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((data) => {
        console.log(data);
        window.location.reload(true);
      });
  });
});

//FUNCTIONALITY FOR THUMBS DOWN CLICK EVENT
//
Array.from(dislike).forEach(function (element) {
  element.addEventListener('click', function () {
    // const name = this.parentNode.parentNode.childNodes[1].innerText;
    // const msg = this.parentNode.parentNode.childNodes[3].innerText;
    const id = this.parentNode.parentNode.childNodes[1].dataset.userId;
    const thumbUp = parseFloat(
      this.parentNode.parentNode.childNodes[5].innerText,
    );
    fetch('dislikeMsg', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // name: name,
        // msg: msg,
        id: id,
        thumbUp: thumbUp,
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((data) => {
        console.log(data);
        window.location.reload(true);
      });
  });
});

Array.from(trash).forEach(function (element) {
  element.addEventListener('click', function () {
    // const name = this.parentNode.parentNode.childNodes[1].innerText;
    // const msg = this.parentNode.parentNode.childNodes[3].innerText;
    const id = this.parentNode.parentNode.childNodes[1].dataset.userId;
    fetch('deleteMsg', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // name: name,
        // msg: msg,
        id,
      }),
    }).then(function (response) {
      window.location.reload();
    });
  });
});

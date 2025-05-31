window.onload = function () {
    document.getElementById("surveyForm").addEventListener("submit", function (e) {
        e.preventDefault();

        let name = document.getElementById("name").value;
        let rating = document.getElementById("rating").value;
        let comment = document.getElementById("comment").value;

        let data = {
            reviewer_name: name,
            rating: rating,
            review_text: comment,
        };

        fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Błąd serwera.");
                return res.json();
            })
            .then((data) => {
                console.log("Wysłano dane:", data);
                document.getElementById("surveyForm").style.display = "none";
                document.getElementById("home").style.display ="block";
                document.getElementById("thanksMessage").style.display = "block";
            })
            .catch((err) => {
                alert("Nie udało się wysłać formularza.");
                console.error(err);
            });
    });

};
function back() {
    window.location.href = "index.html";
}

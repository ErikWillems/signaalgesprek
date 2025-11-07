let questionData = [];
let questionCurrent = 0;
let score = 0;
const digestQuestions = function () {
  score = 0;
  const questions = d3
    .select(".questions")
    .style("width", questionData.length * 100 + "%")
    .style("grid-template-columns", "repeat(" + questionData.length + ", 1fr)")
    .selectAll(".question")
    .data(questionData)
    .join(
      function (enter) {
        return enter
          .append("div")
          .attr("class", "question")
          .each(function (question) {
            question.selected = null;
            const elem = d3
              .select(this)
              .append("div")
              .attr("class", "question-card p-5 m-1");
            if (question.type === "intro") {
              elem.append("p").text(question.label).attr("class", "mt-0 mb-4");
            } else if (question.type === "outro") {
              elem.append("h2").attr("class", "mt-0 mb-4");
              elem.append("h3").attr("class", "mt-0 mb-4");
              elem.append("p").attr("class", "mt-0 mb-4");
              //
            } else {
              elem.append("h3").text(question.label).attr("class", "mt-0 mb-4");
              elem
                .append("div")
                .attr("class", "answers")
                .selectAll(".answer")
                .data(question.answers)
                .join(
                  function (enter) {
                    const elem = enter
                      .append("div")
                      .attr("class", "answer")
                      .each(function (answer, answerIndex) {
                        const elem = d3.select(this);
                        const label = elem.append("label");
                        label
                          .append("input")
                          .attr("type", "radio")
                          .on("change", function () {
                            question.selected = answerIndex;
                            digestQuestions();
                          });
                        label
                          .append("span")
                          .attr("class", "ms-4")
                          .text(answer.label);
                      });
                  },
                  function (update) {},
                  function (exit) {
                    exit.remove();
                  }
                );
            }

            const feedback = elem
              .append("p")
              .attr("class", "feedback mt-4 fst-italic");

            const button = elem
              .append("button")
              .attr("class", "btn btn-lg btn-secondary mt-4")
              .on("click", function () {
                questionCurrent += 1;
                digestQuestions();
              });
            if (question.type === "intro") {
              button.text("Start de test!");
            } else if (question.type === "outro") {
              button.style("display", "none");
            } else {
              button.text("Volgende vraag");
            }
          });
      },
      function (update) {
        return update;
      },
      function (exit) {
        exit.remove();
      }
    );

  questions.each(function (question) {
    const elem = d3.select(this);
    elem
      .select("button")
      .attr(
        "disabled",
        !question.type && typeof question.selected !== "number"
          ? "disabled"
          : null
      );
    if (typeof question.selected === "number") {
      elem
        .select(".feedback")
        .text(question.answers[question.selected].feedback);
    }

    elem.selectAll("input").each(function (answer, index) {
      d3.select(this).property("checked", question.selected === index);
    });
    if (typeof question.selected === "number") {
      score += question.answers[question.selected].value;
    }

    if (question.type === "outro") {
      question.options.forEach(function (option) {
        if (score >= option.score) {
          elem.select("h2").text("Score: " + score);
          elem.select("h3").text(option.title);
          elem.select("p").text(option.label);
        }
      });
    }
  });

  d3.select(".questions").style(
    "transform",
    "translateX(" + questionCurrent * -(100 / questionData.length) + "%)"
  );
  d3.select(".questions-footer .count-total").text(questionData.length);
  d3.select(".questions-footer .count-current").text(questionCurrent + 1);
  d3.select(".questions-footer button").on("click", function () {
    questionData.forEach(function (question) {
      question.selected = null;
    });
    questionCurrent = 0;
    digestQuestions();
  });
  console.log(score);
  if (questionCurrent === questionData.length - 1) {
  }
};
d3.json("./questions.json").then(function (data) {
  questionData = data;
  digestQuestions();
});

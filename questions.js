let questionData = [];
const digestQuestions = function () {
  const questions = d3
    .select(".questions")
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
              .attr("class", "question-card p-5 m-1 shadow");
            if (question.type === "intro") {
              elem.append("p").text(question.label).attr("class", "mt-0 mb-4");
              elem
                .append("button")
                .attr("class", "btn btn-lg btn-secondary")
                .text("Start de test!")
                .on("click", function () {
                  question.selected = -1;
                  digestQuestions();
                });
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
                          .on("input", function () {
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
          });
      },
      function (update) {
        return update;
      },
      function (exit) {
        exit.remove();
      }
    );
  console.log(questionData);
  let answeredIndex = 0;
  questions.each(function (question) {
    if (typeof question.selected === "number") {
      answeredIndex += 1;
    }
    const questionElem = d3.select(this);
    questionElem.selectAll(".answer").each(function (answer, answerIndex) {
      d3.select(this)
        .select("input")
        .property("checked", question.selected === answerIndex);
    });
  });

  d3.select(".questions").style(
    "transform",
    "translateX(" + answeredIndex * -25 + "%)"
  );

  d3.select(".questions-footer .count-total").text(questionData.length);
  d3.select(".questions-footer .count-current").text(answeredIndex + 1);
  d3.select(".questions-footer button").on("click", function () {
    questionData.forEach(function (question) {
      question.selected = null;
    });
    digestQuestions();
  });
};
d3.json("./questions.json").then(function (data) {
  questionData = data;
  digestQuestions();
});

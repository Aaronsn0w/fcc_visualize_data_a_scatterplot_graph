const URL =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const svgWidth = 800;
const svgHeight = 600;
const padding = 50;

const body = d3
  .select("body")
  .attr("class", "container")
  .append("h1")
  .attr("id", "title")
  .attr("class", "mt-5")
  .text("Doping in Professional Bicycle Racing");
//creando canvas
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

//solicitando datos al backend
fetch(URL)
  .then(res => res.json())
  .then(json => {
    function newDate(str) {
      let arg = str["Time"].split(":");
      return new Date(1980, 0, 1, 0, arg[0], arg[1]);
    }

    //creando escalas
    const xScale = d3
      .scaleTime()
      .domain([d3.min(json, d => d["Year"]), d3.max(json, d => d["Year"]) + 1])
      .range([padding, svgWidth - padding]);

    const yScale = d3
      .scaleTime()
      .domain([d3.max(json, d => newDate(d)), d3.min(json, d => newDate(d))])
      .range([svgHeight - padding, padding]);

    //creando axis y formateando ticks
    const xAxes = d3
      .axisBottom(xScale)
      .tickFormat(d3.format(4))
      .ticks(14);
    const yAxes = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    svg
      .append("g")
      .attr("transform", "translate(0," + (svgHeight - padding) + ")")
      .attr("id", "x-axis")
      .call(xAxes);

    svg
      .append("g")
      .attr("transform", "translate(" + padding + ",0)")
      .attr("id", "y-axis")
      .call(yAxes);

    //creando tooltip
    body
      .append("span")
      .attr("id", "tooltip")
      .style("display", "none")
      .style("position", "absolute");

    //creando leyenda
    const leyenda = svg
      .append("g")
      .attr("id", "legend")
      .attr(
        "transform",
        "translate(" + svgWidth / 1.3 + ", " + svgHeight / 4 + ")"
      );

    leyenda
      .append("text")
      .attr("x", 18)
      .attr("y", 0)
      .text("No doping allegations")
      .attr("font-size", 12);
    leyenda
      .append("rect")
      .attr("width", 15)
      .attr("height", 10)
      .attr("x", 0)
      .attr("y", -10)
      .attr("fill", "blue");

    leyenda
      .append("text")
      .attr("x", 18)
      .attr("y", 20)
      .text("Riders with doping allegations")
      .attr("font-size", 12);
    leyenda
      .append("rect")
      .attr("width", 15)
      .attr("height", 10)
      .attr("x", 0)
      .attr("y", 10)
      .attr("fill", "magenta");

    //creando puntos
    svg
      .selectAll("circle")
      .data(json)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("class", "dot")
      .style("fill", d => (d.Doping ? "magenta" : "blue"))
      .attr("cx", d => xScale(d["Year"]))
      .attr("cy", d => yScale(newDate(d)))
      .attr("data-xvalue", (d, i) => d["Year"])
      .attr("data-yvalue", d => newDate(d))
      .on("mouseover", function(d, i) {
        console.log(d3.event.x);
        $("#tooltip").show();
        d3.select("#tooltip")
          .attr("data-year", d["Year"])
          .style("left", d3.event.x + 5 + "px")
          .style("top", d3.event.y + 5 + "px")
          .html(
            `${d.Name}: ${d.Nationality}  <br/>
            Year: ${d.Year}, Time: ${d.Time} 
            ${d.Doping ? "<hr/>" + d.Doping : ""}`
          );
      })
      .on("mouseout", function() {
        $("#tooltip").hide();
      });

    svg.select("text");
  });

d3.select("body")
  .append("footer")
  .append("a")
  .text("By EmilioRT")
  .attr("href", "https:emiliort.com")
  .attr("target", "_blank")
  .attr("class", "text-decoration-none");

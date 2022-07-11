function tipTextLine1(values) {
  var lastyear = values.year == 2019 ? '' : `<br/><br/>That's <strong style="color:white;background-color:${values.count/values.prior > 1 ? '#132a43': '#d5563a'}">&nbsp;${values.count/values.prior < 1 ? numeral(values.count/values.prior).format('0[.]0%') + '&nbsp;</strong> of the': numeral(values.count/values.prior).format('0,0[.]0') + 'x&nbsp;</strong> as many'} openings from the first half of the prior year.</strong>`
  var prelim = values.year == 2022 && values.month == 'March' ? '<br/><br/><small>*Prelminary data</small>' : ''
  var asterisk = values.year == 2022 && values.month == 'March' ? '*' : ''

  return `<span class='quit'>x</span><div class="tooltip-container">
  <div>There were <strong>${numeral(values.count).format('0,0')}</strong> mergers during the first half of <strong>${values.year}${asterisk}</strong>.${lastyear}${prelim}<br/><br/><span style="width:50%;float:left;margin-bottom:10px;"><strong>January</strong>: ${values.january}<br/><strong>March</strong>: ${values.march}<br/><strong>May</strong>: ${values.may}</span><span style="width:50%;float:right;margin-bottom:10px;"><strong>February</strong>: ${values.february}<br/><strong>April</strong>: ${values.april}<br/><strong>June</strong>: ${values.june}</span><br/></div>
  </div>`
}

function tipTextLine2(values) {
  var lastyear = values.year == 2019 ? '' : `<br/><br/>That's <strong style="color:white;background-color:${values.count/values.prior < 1 ? '#d5563a': '#132a43'}">&nbsp;${numeral(values.count/values.prior).format('0[.]0%')}&nbsp;</strong> of the resignations from the same month during the prior year.</strong>`
  var prelim = values.year == 2022 && values.month == 'March' ? '<br/><br/><small>*Prelminary data</small>' : ''
  var asterisk = values.year == 2022 && values.month == 'March' ? '*' : ''

  return `<span class='quit'>x</span><div class="tooltip-container">
  <div><strong>${numeral(values.count).format('0,0')}</strong> workers quit their jobs in <strong>${values.month} ${values.year}${asterisk}</strong>.${lastyear}${prelim}</div>
  </div>`
}

function tooltipText3(values) {
  return `<span class='quit'>x</span><div class="tooltip-container">
  <div><strong>${numeral(values.count).format('0,0')}</strong> nonfarm workers quit their jobs in <strong>${values.state}</strong> in <strong>February 2022</strong>. That's a resignation rate of <strong>${numeral(values.pct).format('0,0[.]0')}%</strong>.</div>
  </div>`
}

var bisectDate = d3.bisector(function(d) {
  return xScale(d.year) - margin.left;
}).left

function mouseoverLine(data, index) {
  var x0 = d3.mouse(event.target)[0],
    i = bisectDate(data, x0, 1)

  var d0 = data[i - 1] !== 'dummy' ? data[i - 1] : data[i],
    d1 = i < data.length ? data[i] : data[i - 1]

  var d = (x0 + margin.left) - xScale(d0.month + ' ' + d0.year) - xScale.bandwidth() / 2 > xScale(d1.month + ' ' + d1.year) - (x0 + margin.left) + xScale.bandwidth() / 2 ? d1 : d0;

  var html = index == 1 ? tipTextLine1(d) : tipTextLine2(d)

  d3.selectAll(`#chart-${index} .dot`)
    .attr('r', 8)
    .raise()

  d3.selectAll(`#chart-${index} .dot.yr${d.year}`)
    .attr('r', 16)

  d3.select(`#tooltip-${index}`)
    .html(html)
    .attr('display', 'block')
    .style("visibility", "visible")
    .style('top', topTT(index))
    .style('left', leftTT(index))

  d3.selectAll(`#tooltip-${index} .quit`)
    .on('click', () => {
      var chart = d3.select(`#chart-${index} svg`)
      chart.selectAll('.dot')
        .attr('r', 8)

      d3.select(`#tooltip-${index}`)
        .html("")
        .attr('display', 'none')
        .style("visibility", "hidden")
        .style("left", null)
        .style("top", null);
    })
}

function mouseover(d, i) {
  var values = d.properties.value
  var html = tooltipText3(values)

  d3.selectAll(`path.state, rect.state`)
    .style('stroke-width', 1)
    .raise()

  d3.selectAll(`.state-${values.state.toLowerCase().replace('washington ', '').replace(' ', '-').replaceAll('.', '')}`)
    .style('stroke-width', 2)
    .raise()

  d3.selectAll(`text.state`)
    .raise()

  d3.select(`#tooltip-${i}`)
    .html(html)
    .attr('display', 'block')
    .style("visibility", "visible")
    .style('top', topTT(i))
    .style('left', leftTT(i))

  if (i == 3) {
    d3.select('.needle')
      .datum(d)
      .attr('x', function(d) {
        var coeff = d.properties.value.pct / 2.9
        return coeff * (width / 4) - 3
      })
      .style('visibility', 'visible')
  }


  d3.selectAll(`#tooltip-${i} .quit`)
    .on('click', () => {

      if (i == 3) {
        d3.selectAll(`path.state, rect.state`)
          .style('stroke-width', 1)
          .raise()

        d3.selectAll(`text.state`)
          .raise()

        d3.select('.needle')
          .style('visibility', 'hidden')
      }

      d3.select(`#tooltip-${i}`)
        .html("")
        .attr('display', 'none')
        .style("visibility", "hidden")
        .style("left", null)
        .style("top", null);
    })
}

function mousemove(i) {
  d3.select(`#tooltip-${i}`)
    .style("visibility", "visible")
    .style('top', topTT(i))
    .style('left', leftTT(i))
}

function mouseout(i) {
  if (window.innerWidth > 767) {
    var chart = d3.select(`#chart-${i} svg`)
    chart.selectAll('.dot')
      .attr('r', 8)

    if (i == 3) {
      d3.selectAll(`path.state, rect.state`)
        .style('stroke-width', 1)
        .raise()

      d3.selectAll(`text.state`)
        .raise()

      d3.select('.needle')
        .style('visibility', 'hidden')
    }

    d3.select(`#tooltip-${i}`)
      .html("")
      .attr('display', 'none')
      .style("visibility", "hidden")
      .style("left", null)
      .style("top", null);
  }
}

function topTT(d) {
  var offsetParent = document.querySelector(`#chart-${d} .chart`).offsetParent
  var offY = offsetParent.offsetTop
  var cursorY = 5

  var windowWidth = window.innerWidth
  var ch = document.querySelector(`#tooltip-${d}`).clientHeight
  var cy = d3.event.pageY - offY
  var windowHeight = window.innerHeight
  if (windowWidth > 767) {
    if (ch + cy >= windowHeight) {
      return cy - (ch / 2) + "px"
    } else {
      return cy - 28 + "px"
    }
  }
}

function leftTT(d) {
  var offsetParent = document.querySelector(`#chart-${d} .chart`).offsetParent
  var offX = offsetParent.offsetLeft
  var cursorX = 5

  var windowWidth = window.innerWidth
  var cw = document.querySelector(`#tooltip-${d}`).clientWidth
  var cx = d3.event.pageX - offX
  var bodyWidth = document.querySelector(`#chart-${d} .chart`).clientWidth

  if (windowWidth > 767) {
    if (cw + cx >= bodyWidth) {
      document.querySelector(`#tooltip-${d}`).className = 'my-tooltip box-shadow-left'
      return cx - cw - cursorX + "px"
    } else {
      document.querySelector(`#tooltip-${d}`).className = 'my-tooltip box-shadow-right'
      return cx + cursorX + "px"
    }
  }
}
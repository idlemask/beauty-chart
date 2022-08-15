import React from "react";
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  BrushComponent,
  LegendComponent
} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
class BiLineChart extends React.Component {
  constructor(props) {
    super(props);
    echarts.use([
      ToolboxComponent,
      TooltipComponent,
      GridComponent,
      LegendComponent,
      BrushComponent,
      BarChart,
      DataZoomComponent,
      TitleComponent,
      CanvasRenderer
    ]);
    this.id = "main-"+this.props.name
    this.myChart = null
  }
  componentDidMount() {
    const chartDom = document.getElementById(this.id);
    this.myChart = echarts.init(chartDom);
    var emphasisStyle = {
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(0,0,0,0.3)'
      }
    };
    const option = {
      legend: {
        data: [{name:this.props.data.y[0].name,itemStyle:{color:'rgb(30,198,108)'}},{name:this.props.data.y[1].name,itemStyle:{color:'rgb(238,49,99)'}}],
      },
      toolbox: {
        feature: {
          magicType: {
            type: ['stack']
          },
          dataView: {}
        }
      },
      tooltip: {},
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          start: 0,
          end: 100
        }
      ],
      xAxis: {
        data: this.props.data.x,
        name: '',
        axisLine: { onZero: true },
        splitLine: { show: false },
        splitArea: { show: false }
      },

      yAxis: {},
      grid: {
        left: '1%',
        right: '90px',
        bottom: '50px',
        containLabel: true
      },
      series: [
        {
          name: this.props.data.y[0].name,
          type: 'bar',
          stack: 'one',
          itemStyle:{color:'rgb(30,198,108)'},
          emphasis: emphasisStyle,
          data: this.props.data.y[0].data
        },
        {
          name: this.props.data.y[1].name,
          type: 'bar',
          stack: 'one',
          emphasis: emphasisStyle,
          itemStyle:{color:'rgb(238,49,99)'},
          data: this.props.data.y[1].data
        },
      ]
    };
    if(this.props.options != null){
      for(const key in this.props.options){
        option[key] = this.props.options[key]
      }
    }
    if(this.props.data){
      option.xAxis.data = this.props.data.x
      option.series[0].data = this.props.data.y[0].data
      option.series[0].name = this.props.data.y[0].name
      option.series[1].data = this.props.data.y[1].data
      option.series[1].name = this.props.data.y[1].name
    }

    option && this.myChart.setOption(option);
  }
  handleResize(){
    this.myChart.renderToCanvas()
  }
  render(){
    return (
      <div id={this.id} style={{"height":"30vh","width":"100vw"}} onResize={this.handleResize}>
      </div>
    )
  }
}
export default BiLineChart



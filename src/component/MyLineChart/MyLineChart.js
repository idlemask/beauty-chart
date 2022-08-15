import React from "react";
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LegendComponent
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
class MyLineChart extends React.Component {
  constructor(props) {
    super(props);
    echarts.use([
      TitleComponent,
      ToolboxComponent,
      TooltipComponent,
      GridComponent,
      DataZoomComponent,
      LineChart,
      CanvasRenderer,
      UniversalTransition,
      LegendComponent
    ]);
    this.id = 'main-'+this.props.name
    this.myChart = null
  }
  componentDidMount() {
    const chartDom = document.getElementById(this.id);
    this.myChart = echarts.init(chartDom);
    const option = {
      tooltip: {
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '10%'];
        }
      },
      legend: {
        data:[]
      },
      title: {
        left: 'left',
        text: 'Large Area Chart'
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      },
      grid: {
        left: '1%',
        right: '1%',
        bottom: '50px',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        max: function (value) {
          return (value.max + (value.max - value.min)/5).toFixed(0);
        },
        min: function (value) {
          return (value.min - (value.max - value.min)/4).toFixed(0);
        }
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          start: 0,
          end: 100,
        }
      ],
      series: []
    };
    if(this.props.data !=null && this.props.data.x != null){
      option.xAxis["data"]=this.props.data.x
    }
    if(this.props.data !=null && this.props.data.y != null){
      for(const index in this.props.data.y){
        option.legend.data.push(
          this.props.data.y[index].name
        )
        option.series.push(
          {
            name: this.props.data.y[index].name,
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            data:this.props.data.y[index].data
          }
        )
      }

    }
    if(this.props.options != null){
      for(const key in this.props.options){
        option[key] = this.props.options[key]
      }
    }
    option && this.myChart.setOption(option);
  }
  handleResize(){
    this.myChart.renderToCanvas()
  }
  render(){
    return (
      <div id={'main-'+ this.props.name} style={{"height":"30vh","width":"100vw"}} onResize={this.handleResize}>

      </div>
    )
  }
}
export default MyLineChart



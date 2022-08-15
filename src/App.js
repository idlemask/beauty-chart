import './App.css';
import DataLoader from "./component/DataLoader/DataLoader";
import MyLineChart from "./component/MyLineChart/MyLineChart";
import {useState} from "react";
import BiBarChart from "./component/MyBarChart/BiBarChart";
function App() {
  const [hasData1, setHasData1] = useState(false)
  const [hasData2, setHasData2] = useState(false)
  const [benchmark,setBenchmark] = useState({x:[],y:[]})
  const [gain,setGain] = useState({x:[],y:[{name:"盈余",itemStyle:{color:'rgb(30,198,108)'}},{name:"亏损",itemStyle:{color:'rgb(238,49,99)'}}]})
  const [order,setTransaction] = useState({x:[],y:[{name:"买入",itemStyle:{color:'rgb(30,198,108)'}},{name:"卖出",itemStyle:{color:'rgb(238,49,99)'}}]})
  const [total,setTotal] = useState({})
  const benchmarkOptions = {
    title: {
      left: 'left',
      text: '收益'
    },
  }
  const gainOptions = {
    xAxis: {
      data: null,
      name: '盈余情况',
      axisLine: { onZero: true },
      splitLine: { show: false },
      splitArea: { show: false }
    },
  }
  const orderOptions = {
    xAxis: {
      data: null,
      name: '买入/出情况',
      axisLine: { onZero: true },
      splitLine: { show: false },
      splitArea: { show: false }
    },
  }
  const parseLineChartData = (e) =>{
    const benchmark = e.benchmark,overall = e.overallReturn
    const benchmarkDate = benchmark.time.map((x)=>{
      return new Date(x).toDateString()
    })
    return {x:benchmarkDate,y:[{name: '市值',data:benchmark.value},{name: '总收益',data:overall.value}]}
  }
  const parseBiChartData = (add,sub)=>{
    const res = {x:[],y:[]}
    const earn = add, lose = sub
    let earnIndex = 0,loseIndex = 0
    const x = [], dataBuy = [],dataSell = []
    while(earnIndex < earn.time.length && loseIndex < lose.time.length){
      if(earn.time[earnIndex] < lose.time[loseIndex]){
        x.push(new Date(earn.time[earnIndex]).toDateString())
        dataBuy.push(earn.value[earnIndex++])
        dataSell.push(0)
      }
      else if(earn.time[earnIndex] > lose.time[loseIndex]){
        x.push(new Date(lose.time[loseIndex]).toDateString())
        dataBuy.push(0)
        dataSell.push(lose.value[loseIndex++])
      }
      else {
        x.push(new Date(lose.time[loseIndex]).toDateString())
        dataBuy.push(earn.value[earnIndex++])
        dataSell.push(lose.value[loseIndex++])
      }
    }
    while(earnIndex < earn.time.length){
      x.push(new Date(earn.time[earnIndex]).toDateString())
      dataBuy.push(earn.value[earnIndex++])
      dataSell.push(0)
    }
    while(loseIndex < lose.time.length){
      x.push(new Date(lose.time[loseIndex]).toDateString())
      dataBuy.push(0)
      dataSell.push(lose.value[loseIndex++])
    }
    res.x = x
    res.y[0]= dataBuy
    res.y[1] = dataSell
    return res
  }
  const renderChart = (e)=>{
    const data = e.data.result
    //benchmark & overallReturn
    setBenchmark(parseLineChartData(data))
    //gains
    const gainData = parseBiChartData(data.gains.earn,data.gains.lose)
    setGain({
      x:gainData.x,
      y:[
        {name:"盈余",itemStyle:{color:'rgb(30,198,108)'},data:gainData.y[0]},
        {name:"亏损",itemStyle:{color:'rgb(238,49,99)'},data:gainData.y[1]}
      ]
    })
    //order
    const orderData = parseBiChartData(data.orders.buy,data.orders.sell)
    setTransaction({
      x:orderData.x,
      y:[
        {name:"买入",itemStyle:{color:'rgb(30,198,108)'},data:orderData.y[0]},
        {name:"卖出",itemStyle:{color:'rgb(238,49,99)'},data:orderData.y[1]}
      ]
    })
    setHasData2(true)
    console.log(data)
  }
  const renderForm = (e)=>{
    setTotal(e.data)
    setHasData1(true)
  }
  const Form = (props)=>{
    if(props.show === true){
      return (
        <div>
          <ul className={"Form"}>
            <li>
              策略收益<br/>
              {(total.algorithm_return*100).toFixed(2)}%
            </li>
            <li>
              策略年化收益<br/>
              {(total.annual_algo_return*100).toFixed(2)}%
            </li>
            <li>
              基准收益<br/>
              {(total.benchmark_return*100).toFixed(2)}%
            </li>
            <li>
              阿尔法<br/>
              {(total.alpha).toFixed(3)}
            </li>
            <li>
              贝塔<br/>
              {(total.beta).toFixed(3)}
            </li>
            <li>
              夏普比率<br/>
              {(total.sharpe).toFixed(3)}
            </li>
            <li>
              最大回撤<br/>
              {(total.max_drawdown*100).toFixed(2)}%
            </li>
            <li>
              策略波动率<br/>
              {(total.algorithm_volatility).toFixed(3)}
            </li>
            <li>
              基准波动率<br/>
              {(total.benchmark_volatility).toFixed(3)}
            </li>
          </ul>
        </div>
      )
    }
    else {
      return (
        <DataLoader name="form" onDataLoaded={renderForm} style={{height:"8vh",fontSize:"30px",borderBottom:"2px solid black"}}></DataLoader>
      )
    }
  }
  const ChartList = (props)=>{
    if(props.show === true){
      return (
        <div>
          <MyLineChart name={"benchmark"} data={benchmark} options={benchmarkOptions}></MyLineChart>
          <BiBarChart name={"gain"} data={gain} options={gainOptions}></BiBarChart>
          <BiBarChart name={"order"} data={order} options={orderOptions}></BiBarChart>
        </div>
      )
    }
    else {
      return (
        <DataLoader name="chart" onDataLoaded={renderChart} style={{height:"90vh",fontSize:"80px"}}></DataLoader>
      )
    }
  }

  return (
    <div className="App">
      <Form show={hasData1}></Form>
      <ChartList show={hasData2}></ChartList>
    </div>
  )
}

export default App;

import React,{Component} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'
//import {Tabs,Tab} from 'material-ui/Tabs'
import {Table,TableBody,TableHeader,TableHeaderColumn,TableRow, TableRowColumn} from 'material-ui/Table'
import Jyanken from './Jyanken'
import {BrowserRouter,Route,Redirect,Link} from 'react-router-dom'
import FlatButton from 'material-ui/FlatButton'
class JyankenGamePage extends Component {
    constructor(props){
        super(props)
        this.jyanken=new Jyanken
        this.state={scores:[],status:{}}
    }
    componentDidMount(){
        this.getResult()
    }
    getResult(){
        this.setState({scores:this.jyanken.getScores()})
        this.setState({status:this.jyanken.getStatuses()})
    }
    pon(te){
        this.jyanken.pon(te)
        this.getResult()
    }
    render(){
        const tabStyle={
            width:200,
            height:50,
            textAlign:'center',
            color:"#fff",
            backgroundColor:'#01bcd4'
        }
        const activeStyle=(path)=>Object.assign(
            {
                borderBottom:`solid 2px ${this.props.location.pathname.match(path)? '#f00':'#01bc4'}`
            },
            tabStyle
        )
        return(
            <MuiThemeProvider>
                <div style={{marginLeft:30}}>
                    <Header>じゃんけんポン！</Header>
                    <JyankenBox actionPon={(te)=>this.pon(te)}/>
                    <Paper style={{whide:400}} zDepth={2}>
                        {/* <Tabs value={this.state.tabIndex} onChange={(ix)=>this.tabChange(ix)}>
                            <Tab label="対戦結果" value={0}>
                                <ScoreList scores={this.state.scores} />
                            </Tab>
                            <Tab label="対戦成績" value={1}>
                                <StatusBox status={this.state.status}/>
                            </Tab>
                        </Tabs> */}
                        <Link to="/scores"><FlatButton label="対戦結果" style={activeStyle('scores')}/></Link>
                        <Link to="/status"><FlatButton label="対戦成績" style={activeStyle('status')}/></Link>
                        <Route path="/scores" component={()=><ScoreList scores={this.state.scores}/>}/>
                        <Route path="/status" component={()=><StatusBox status={this.state.status}/>}/>
                        <Route exact path="/" component={()=><Redirect to="/scores"/>}/>
                    </Paper>
                </div>
            </MuiThemeProvider>
        )
    }
}
JyankenGamePage.propTypes={
    location:PropTypes.object
}
const Header=(props)=>(<h1>{props.children}</h1>)
Header.propTypes={
    children:PropTypes.string
}
const StatusBox=(props)=>{
    return(
        <Table>
            <TableBody displayRowCheckbox={false}>
                <TableRow displayBorder={false}>
                    <TableHeaderColumn>勝ち</TableHeaderColumn>
                    <TableRowColumn style={judgmentStyle(1)}>{props.status.win}</TableRowColumn>
                </TableRow>
                <TableRow displayBorder={false}>
                    <TableHeaderColumn>負け</TableHeaderColumn>
                    <TableRowColumn style={judgmentStyle(2)}>{props.status.lose}</TableRowColumn>
                </TableRow>
                <TableRow displayBorder={false}>
                    <TableHeaderColumn>引き分け</TableHeaderColumn>
                    <TableRowColumn style={judgmentStyle(0)}>{props.status.draw}</TableRowColumn>
                </TableRow>
            </TableBody>
        </Table>
    )
}
StatusBox.propTypes={
    status:PropTypes.object
}
const JyankenBox=(props)=>{
    const style={marginLeft:20}
    return(
        <div style={{marginTop:40,marginBox:30,marginLeft:30}}>
            <RaisedButton label="グー" onClick={()=>props.actionPon(0)} style={style}/>
            <RaisedButton onClick={()=>props.actionPon(1)} label="チョキ！" style={style}/>
            <RaisedButton onClick={()=>props.actionPon(2)} label="パー！" style={style}/>
        </div>
    )
}
JyankenBox.propTypes={
    actionPon:PropTypes.func
}
const ScoreList =(props)=>(
    <Table>
        <TableHeader adjustForCheckbox ={false} displaySelectAll={false}>
            <TableRow>        
                <TableHeaderColumn>時間</TableHeaderColumn>
                <TableHeaderColumn>人間</TableHeaderColumn>
                <TableHeaderColumn>コンピュータ</TableHeaderColumn>
                <TableHeaderColumn>結果</TableHeaderColumn>
            </TableRow>
        </TableHeader>
        <TableBody>
            {props.scores.map((score,ix)=><ScoreListItem key={ix} score={score}/>)}
        </TableBody>
    </Table>
)
ScoreList.propTypes={
    scores:PropTypes.array
}
const ScoreListItem=(props)=>{
    const teString=["グー","チョキ","パー"]
    const judgmentString=["引き分け","勝ち","負け"]
    const dateHHMMSS=(d)=>d.toTimeString().substr(0,8)
    return(
        <TableRow style={judgmentStyle(props.score.judgement)}>
            <TableRowColumn>{dateHHMMSS(props.score.created_at)}</TableRowColumn>
            <TableRowColumn>{teString[props.score.human]}</TableRowColumn>
            <TableRowColumn>{teString[props.score.computer]}</TableRowColumn>
            <TableRowColumn>{judgmentString[props.score.judgment]}</TableRowColumn>
        </TableRow>
    )
}
ScoreListItem.propTypes={
    score:PropTypes.object
}
const judgmentStyle=(judgment)=>({color:["#000","#2979FF","#FF1744"][judgment]})

// const ScoreBox=(props)=>{
//     const teString=["グー","チョキー","パー"]
//     const judgementString=["引き分け","勝ち","負け"]
//     return (
//         <table>
//             <tbody>
//                 <tr><th>あなた</th><td>{teString[props.human]}</td></tr>
//                 <tr><th>Computer</th><td>{teString[props.computer]}</td></tr>
//                 <tr><th>勝敗</th><td>{judgementString[props.judgement]}</td></tr>
//             </tbody>
//         </table>
//     )
// }
// ScoreBox.propTypes={
//     human:PropTypes.number,
//     computer:PropTypes.number,
//     judgement:PropTypes.number
// }
ReactDOM.render(
    <BrowserRouter>
        <Route path="/" component={JyankenGamePage}/>
    </BrowserRouter> ,
    document.getElementById('root')
)
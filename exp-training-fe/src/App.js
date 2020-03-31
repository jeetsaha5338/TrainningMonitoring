import React, { Component } from 'react';
import './App.css';
import DataTable from './Components/DataTable';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      headers: [],
      data: [],
      ready: false
    };

  }


  /* onUpdateTable = (field, id, value) => {
    let data = this.state.data.slice();
    let updateRow = this.state.data.find((d) => {
      return d["id"] === id;
    });

    updateRow[field] = value;

    this.setState({
      edit: null,
      data: data
    });
  } */

  // todo:

  componentDidMount() {
    let headers = [
      { title: "Id", accessor: "id", index: 0, dataType: "number", width: "60px", searchType: "none" },
      { title: "Topic", accessor: "topicName", index: 1, dataType: "string", width: "100px", searchType: "input" },
      {
        title: "Category", accessor: "category", index: 2, dataType: "string", width: "90px", searchType: "list",
        fixedValue: ['Technical', 'Behavioural', 'Domain Specific', 'Organizational']
      },
      { title: "Duration", accessor: "duration", index: 3, dataType: "number", width: "90px", searchType: "list" },
      { title: "Start Date", accessor: "startDate", index: 4, dataType: "string", width: "100px", searchType: "date" },
      { title: "End Date", accessor: "endDate", index: 5, dataType: "string", width: "100px", searchType: "date" },
      {
        title: "Trainer Type", accessor: "trainerType", index: 6, dataType: "string", width: "100px", searchType: "list",
        fixedValue: ['External', 'Internal', 'Self']
      },
      { title: "Trainers", accessor: "trainers", index: 7, dataType: "string", width: "70px", searchType: "input" },
      { title: "Attendees", accessor: "attendees", index: 8, dataType: "string", width: "70px", searchType: "input" },
      { title: "Team Name", accessor: "teamName", index: 9, dataType: "string", width: "95px", searchType: "input" },
      {
        title: "Remarks", accessor: "remarks", index: 10, dataType: "string", width: "90px", searchType: "list",
        fixedValue: ['Excellent', 'Very Good', 'Good', 'Average','Not That Level']
      }
    ];
    this.setState({ 
      headers : headers
    },this.getAllTopics());
  }
  
  getAllTopics = () => {
    axios.get('http://localhost:8008/Training/Topic/getTopics')
      .then(Response => {
        this.setState({
          data: Response.data,
          ready: true
        })
      }, (error) => console.log(error))
  }

  addTopic = (addTopicValue) => {
    axios.post('http://localhost:8008/Training/Topic/addTopic',addTopicValue)
      .then( Response => {
        alert(Response.data);
        this.setState({ ready : false},this.getAllTopics());
      },(error) => console.log(error))
  }

  updateTopic = (editTopicValue) => {
    axios.post('http://localhost:8008/Training/Topic/updateTopic',editTopicValue)
      .then( Response => {
        alert(Response.data);
        this.setState({ ready : false},this.getAllTopics());
      },(error) => console.log(error))
  }


  render() {
    return (
      this.state.ready ?
        <div>
          <DataTable
            // className="data-table"
            className='table table-striped'
            title="TRAINING MONITORING"
            keyField="id"
            // edit={true}
            pagination={{
              enabled: true,
              pageLength: 8,
              type: "long"  // long, short
            }}
            width="80%"
            headers={this.state.headers}
            data={this.state.data}
            noData="No records!"
            addTopicToDB = {this.addTopic}
            updateTopicToDB = {this.updateTopic}
          // onUpdate={this.onUpdateTable}
          />
        </div>
        : <h2>Loading..</h2>
    );
  }
}

export default App;
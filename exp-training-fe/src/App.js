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
      { title: "Id", accessor: "id", index: 0, dataType: "number" },
      { title: "Topic", accessor: "topicName", index: 1, dataType: "string" },
      { title: "Category", accessor: "category", index: 2, dataType: "string" },
      { title: "Duration", accessor: "duration", index: 3, dataType: "number" },
      { title: "Start Date", accessor: "startDate", index: 4, dataType: "string" },
      { title: "End Date", accessor: "endDate", index: 5, dataType: "string" },
      { title: "Trainer Type", accessor: "trainerType", index: 6, dataType: "string" },
      { title: "Trainers", accessor: "trainers", index: 7, dataType: "string" },
      { title: "attendees", accessor: "attendees", index: 8, dataType: "string" },
      { title: "Team Name", accessor: "teamName", index: 9, dataType: "string" },
      { title: "Remarks", accessor: "remarks", index: 10, dataType: "string" }
    ];
    axios.get('http://localhost:8008/Training/Topic/getTopics')
      .then(Response => {
        this.setState({
          headers : headers,
          data: Response.data,
          ready: true
        })
      }, (error) => {
        console.log(error);
      })
    return
  }


  render() {
    return (
      this.state.ready ?
      <div>
        <DataTable 
          // className="data-table"
          className='table table-striped'
          title="Training Monitoring"
          keyField="id"
          // edit={true}
          pagination={{
            enabled: true,
            pageLength: 5,
            type: "long"  // long, short
          }}
          width="100%"
          headers={this.state.headers}
          data={this.state.data}
          noData="No records!"
        // onUpdate={this.onUpdateTable}
        />
      </div> 
      : <h2>Loading..</h2>
    );
  }
}

export default App;
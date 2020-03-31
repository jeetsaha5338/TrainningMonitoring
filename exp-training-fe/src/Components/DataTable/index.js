import React from 'react';
import ReactDOM from 'react-dom';
import './datatable.css';
import Pagination from '../Pagination';

export default class DataTable extends React.Component {
    _preSearchData = null;
    constructor(props) {
        super(props);
        this.state = {
            title: props.title || 'Data-Table',
            headers: props.headers,
            data: props.data,
            pagedData: props.data,
            sortby: null,
            descending: null,
            pageLength: this.props.pagination.pageLength || 5,
            currentPage: 1,
            search: false,
            addTopic: false,
            editTopic: false,
            edit_ID : '',
        }

        this.keyField = props.keyField || "id"; // TODO: revisit this logic
        this.noData = props.noData || "No records found!";
        this.width = props.width || "100%";

        // Add pagination support
        this.pagination = this.props.pagination || {};
    }

    renderToolbar = () => {
        return (
            <div className="toolbar">
                <h4>{this.state.title}</h4>
                {(this.state.addTopic || this.state.search || this.state.editTopic) ?
                    <button onClick={this.onClickCancel} className='btn btn-danger' id='cancelbtn'>
                        Cancel
                    </button> :
                    <><button onClick={this.onClickAddTopic} className='btn btn-success' id='addbtn'>
                        Add Topic
                    </button>
                    <button onClick={this.onClickSearch} className='btn btn-primary' id='searchbtn'>
                        Search
                    </button></>
                }
            </div>

        );
    }

    renderTable = () => {
        let headerView = this.renderTableHeader();
        let contentView = this.state.data.length > 0
            ? this.renderContent()
            : this.renderNoData();

        return (
            <table className="data-inner-table">
                <thead onClick={this.onSort} className='thead-dark'>
                    <tr>
                        {headerView}
                    </tr>
                </thead>
                <tbody /* onDoubleClick={this.onShowEditor} */>
                    {this.renderSearch()}
                    {this.renderAddForm()}
                    {this.renderEditForm()}
                    {contentView}
                </tbody>
            </table>
        );
    }

    renderTableHeader = () => {
        let { headers } = this.state;
        headers.sort((a, b) => {
            if (a.index > b.index) return 1;
            return -1;
        });

        let headerView = headers.map((header, index) => {
            let title = header.title;
            let accessor = header.accessor;
            let width = header.width;
            let arrow;
            if (this.state.sortby === index) {
                arrow = this.state.descending ? (<i className='fas fa-arrow-down'></i>) : <i className='fas fa-arrow-up'></i>;
            }

            return (
                <th key={accessor}
                    ref={(th) => this[accessor] = th}
                    style={{ width: width, textAlign: "center" }}
                    data-col={accessor}
                    // onDoubleClick = {()=>{alert('Double Click');}}
                    onDragStart={(e) => this.onDragStart(e, index)}
                    onDragOver={this.onDragOver}
                    onDrop={(e) => { this.onDrop(e, index) }}>
                    <span draggable data-col={accessor} className="header-cell" style={{ width: width, textAlign: "center" }}>
                        {title + ' '}{arrow}
                    </span>
                </th>
            );
        });

        return headerView;
    }

    renderNoData = () => {
        return (
            <tr>
                <td colSpan={this.props.headers.length}>
                    {this.noData}
                </td>
            </tr>
        );
    }

    /* onUpdate = (e) => {
        e.preventDefault();
        let input = e.target.firstChild;
        let header = this.state.headers[this.state.edit.cell];
        let rowId = this.state.edit.rowId;
 
        this.setState({
            edit: null
        });
 
        this.props.onUpdate &&
            this.props.onUpdate(header.accessor, rowId, input.value);
    }
 
    onFormReset = (e) => {
        if (e.keyCode === 27) {  // ESC key
            this.setState({
                edit: null
            });
        }
    }
    onShowEditor = (e) => {
       let id = e.target.dataset.id;
       this.setState({
           edit: {
               row: parseInt(e.target.dataset.row, 10),
               rowId: id,
               cell: e.target.cellIndex
           }
       })
   } */


    renderContent = () => {

        let { headers, data, pagedData } = this.state;
        data = this.pagination.enabled ? pagedData : data;
        let contentView = data.map((row, rowIdx) => {
            let id = row[this.keyField];
            // let edit = this.state.edit;
            if(row['id'] === this.state.edit_ID){
                return null;
            }

            let tds = headers.map((header, index) => {
                let contents = row[header.accessor];

                /* if (this.props.edit) {
                    if (header.dataType && (header.dataType === "number" ||
                        header.dataType === "string") &&
                        header.accessor !== this.keyField) {
                        if (edit && edit.row === rowIdx && edit.cell === index) {
                            content = (
                                <form onSubmit={this.onUpdate}>
                                    <input type="text" defaultValue={content}
                                        onKeyUp={this.onFormReset} />
                                </form>
                            );
                        }

                    }
                } */

                return (
                    <td key={index} data-id={id} data-row={rowIdx}>
                        {(header.accessor === 'trainers' || header.accessor === 'attendees') ?
                            contents.map((content) => (
                                content + ", "
                            )) :
                            (header.accessor === 'id') ?
                                <span onClick={() => this.onClickEdit(contents)} style={{ cursor: 'pointer'}}>
                                    {(this.state.editTopic) ? '' :
                                    <i className='fas fa-edit' style={{color : 'blue'}}></i>}
                                    <b>{" "+contents}</b>
                                </span> :
                                contents
                        }
                        {(header.accessor === 'duration') ? ' Hours' : ''}
                    </td>
                );
            });
            return (
                <tr key={rowIdx} style={{ textAlign: "center" }}>
                    {tds}
                </tr>
            );
        });
        return contentView;
    }

    renderSearch = () => {
        let { search, headers } = this.state;
        if (!search) {
            return null;
        }

        let searchInputs = headers.map((header, idx) => {
            let inputId = 'inp' + header.accessor;
            let fixedValue = header.fixedValue || [];
            return (
                (header.searchType === 'input') ?
                    <td key={idx} >
                        <input type="text" className="form-control"
                            ref={(input) => this[inputId] = input}
                            style={{
                                width: (header.accessor === 'trainers' || header.accessor === 'attendees') ?
                                    (parseInt(header.width.toString().split("px")[0]) + 30) + "px" :
                                    header.width,
                                textAlign: "center"
                            }}
                            data-idx={idx}
                        />
                    </td> :
                    (header.searchType === 'list') ?
                        <td key={idx}>
                            <select ref={(input) => this[inputId] = input} className="btn btn-secondary" style={{
                                width: header.width,
                                height: "80%",
                                textAlign: "center"
                            }} defaultValue="Select"
                            >
                                {(header.accessor === 'duration') ?
                                    fixedValue = this.createList(0.5, 20, 0.5) :
                                    fixedValue
                                }
                                <option value="">Select</option>
                                {fixedValue.map(val => (
                                    <option className="btn btn-light" key={val} value={val}>
                                        {val}{(header.accessor === 'duration') ? ' Hours' : ''}
                                    </option>
                                ))}
                            </select>
                        </td> :
                        (header.searchType === 'date') ?
                            (console.log(this[inputId], header.accessor),
                                this[inputId] = (this[inputId] === undefined) ? '' : this[inputId],
                                <td key={idx}>
                                    {/* {(this[inputId] === '') ? "2020-01-01" : this[inputId]} */}
                                    <input type="date" className='form-control'
                                        name={header.accessor}
                                        min="2000-01-01"
                                        onChange={(input) => this[inputId] = input.target.value}
                                        style={{
                                            width: "145px",
                                            height: "37px",
                                            fontSize: "80%",
                                        }}
                                        value={(this[inputId] === '') ? '' : this[inputId]}
                                        data-idx={idx}
                                    />
                                </td>) :
                            <td key={idx}><h4><b>Enter:</b></h4></td>
            );

        });

        return (
            <tr onChange={this.onSearch} style={{ height: "80%", width: "70%" }}>
                {searchInputs}
            </tr>
        );
    }

    renderAddForm = () => {
        let { addTopic, headers } = this.state;
        if (!addTopic) {
            return null;
        };
        let addTopicValue = {
            id: 0,
            topicName: "", category: "", duration: "", startDate: "", endDate: "",
            trainerType: "", trainers: "", attendees: "", teamName: "", remarks: ""
        };

        let addInputs = headers.map((header, idx) => {
            // let inputId = 'inp' + header.accessor;
            let fixedValue = header.fixedValue || [];
            return (
                (header.searchType === 'input') ?
                    <td key={idx} >
                        <input type="text" className="form-control"
                            // ref={(input) => this[inputId] = input}
                            onChange={(input) => addTopicValue[header.accessor] = input.target.value}
                            style={{
                                width: (header.accessor === 'trainers' || header.accessor === 'attendees') ?
                                    (parseInt(header.width.toString().split("px")[0]) + 30) + "px" :
                                    header.width,
                                textAlign: "center"
                            }}
                            data-idx={idx}
                        />
                    </td> :
                    (header.searchType === 'list') ?
                        <td key={idx}>
                            <select defaultValue="Select" className="btn btn-secondary" style={{
                                width: header.width,
                                height: "80%",
                                textAlign: "center"
                            }}
                                onChange={(input) => { addTopicValue[header.accessor] = input.target.value }}
                            // ref={(input) => this[inputId] = input}
                            >
                                {(header.accessor === 'duration') ?
                                    fixedValue = this.createList(0.5, 20, 0.5) :
                                    fixedValue
                                }
                                <option value="">Select</option>
                                {fixedValue.map(val => (
                                    <option className="btn btn-light" key={val} value={val}>
                                        {val}{(header.accessor === 'duration') ? ' Hours' : ''}
                                    </option>
                                ))}
                            </select>
                        </td> :
                        (header.searchType === 'date') ?
                            <td key={idx}>
                                <input type="date" className='form-control'
                                    name={header.accessor}
                                    min="2000-01-01"
                                    onChange={(input) => addTopicValue[header.accessor] = input.target.value}
                                    style={{
                                        width: "145px",
                                        height: "37px",
                                        fontSize: "80%",
                                    }}
                                    data-idx={idx}
                                />
                            </td> :
                            <td key={idx}>
                                <button onClick={() => this.onSave(addTopicValue)} className='btn btn-success'>
                                    Save
                                </button>
                            </td>
            );

        });

        return (
            <tr /* onChange={this.onSearch} */ style={{ height: "80%", width: "70%" }}>
                {addInputs}
            </tr >
        );
    }

    renderEditForm = () => {
        let { data, edit_ID, editTopic, headers } = this.state;
        if (!editTopic) {
            return null;
        };

        let editTopicValue = data.filter(row => {
            if(row['id'] === edit_ID){
                return true;
            }
            return false;
        })[0];
        editTopicValue['startDate'] = this.dateFormatter(editTopicValue['startDate'].toString())
        editTopicValue['endDate'] = this.dateFormatter(editTopicValue['endDate'].toString())


        let editInputs = headers.map((header, idx) => {
            // let inputId = 'inp' + header.accessor;
            let fixedValue = header.fixedValue || [];
            return (
                (header.searchType === 'input') ?
                    <td key={idx} >
                        <input type="text" className="form-control"
                            // ref={(input) => this[inputId] = input}
                            defaultValue = {editTopicValue[header.accessor]}
                            onChange={(input) => editTopicValue[header.accessor] = input.target.value}
                            style={{
                                width: (header.accessor === 'trainers' || header.accessor === 'attendees') ?
                                    (parseInt(header.width.toString().split("px")[0]) + 30) + "px" :
                                    header.width,
                                textAlign: "center"
                            }}
                            data-idx={idx}
                        />
                    </td> :
                    (header.searchType === 'list') ?
                        <td key={idx}>
                            <select className="btn btn-secondary" style={{
                                    width: header.width,
                                    height: "80%",
                                    textAlign: "center"
                                }}
                                defaultValue={editTopicValue[header.accessor]}
                                onChange={(input) => { editTopicValue[header.accessor] = input.target.value }}
                            // ref={(input) => this[inputId] = input}
                            >
                                {(header.accessor === 'duration') ?
                                    fixedValue = this.createList(0.5, 20, 0.5) :
                                    fixedValue
                                }
                                {/* <option value="">Select</option> */}
                                {fixedValue.map(val => (
                                    <option className="btn btn-light" key={val} value={val}>
                                        {val}{(header.accessor === 'duration') ? ' Hours' : ''}
                                    </option>
                                ))}
                            </select>
                        </td> :
                        (header.searchType === 'date') ?
                            <td key={idx}>
                                <input type="date" className='form-control'
                                    name={header.accessor}
                                    min="2000-01-01"
                                    defaultValue = {editTopicValue[header.accessor]}
                                    onChange={(input) => editTopicValue[header.accessor] = input.target.value}
                                    style={{
                                        width: "145px",
                                        height: "37px",
                                        fontSize: "80%",
                                    }}
                                    data-idx={idx}
                                />
                            </td> :
                            <td key={idx}>
                                <button onClick={() => this.onUpdate(editTopicValue)} className='btn btn-success'>
                                    <b>{'Update:'+this.state.edit_ID}</b>
                                </button>
                            </td>
            );

        });

        return (
            <tr /* onChange={this.onSearch} */ style={{ height: "80%", width: "70%" }}>
                {editInputs}
            </tr >
        );
    }

    onDragOver = (e) => {
        e.preventDefault();
    }

    onDragStart = (e, source) => {
        e.dataTransfer.setData('text/plain', source);
    }

    onDrop = (e, target) => {
        e.preventDefault();
        let source = e.dataTransfer.getData('text/plain');
        let headers = [...this.state.headers];
        let srcHeader = headers[source];
        let targetHeader = headers[target];

        let temp = srcHeader.index;
        srcHeader.index = targetHeader.index;
        targetHeader.index = temp;

        this.setState({
            headers
        });
    }

    onSort = (e) => {
        let data = this.state.data.slice(); // Give new array
        let dom = ReactDOM.findDOMNode(e.target);
        let colIndex = dom.parentNode.cellIndex === undefined ? dom.cellIndex : dom.parentNode.cellIndex;
        let colTitle = e.target.dataset.col;
        let descending = !this.state.descending;

        if (colTitle === 'startDate' || colTitle === 'endDate') {
            data.sort((a, b) => {
                let sortVal = 0;
                let dateA = this.dateFormatter(a[colTitle].toString());

                let dateB = this.dateFormatter(b[colTitle].toString());

                if (new Date(dateA).getTime() < new Date(dateB).getTime()) {
                    sortVal = -1;
                } else if (new Date(dateA).getTime() > new Date(dateB).getTime()) {
                    sortVal = 1;
                }
                if (descending) {
                    sortVal = sortVal * -1;
                }
                return sortVal;
            });
        } else {
            data.sort((a, b) => {
                let sortVal = 0;
                if (a[colTitle] < b[colTitle]) {
                    sortVal = -1;
                } else if (a[colTitle] > b[colTitle]) {
                    sortVal = 1;
                }
                if (descending) {
                    sortVal = sortVal * -1;
                }
                return sortVal;
            });
        }

        this.setState({
            data: data,
            pagedData: data,
            sortby: colIndex,
            descending
        }, () => {
            if (this.pagination.enabled) {
                this.onGotoPage(1);
            }
        });
    }

    onSearch = (e) => {
        let { headers } = this.state;
        // Filter the records
        let searchData = this._preSearchData.filter((row) => {
            let show = true;
            for (let i = 1; i < headers.length; i++) {
                let fieldName = headers[i].accessor;
                let fieldValue = row[fieldName];
                let inputId = 'inp' + fieldName;
                let inputText = this[inputId];

                if (fieldValue === '') {//If FieldValue Not Present                
                    show = true;
                } else {
                    if (headers[i].searchType === "list") {
                        show = (inputText.value === '' || fieldValue.toString() === inputText.value);
                    } else if (headers[i].searchType === "input") {
                        show = fieldValue.toString().toLowerCase().indexOf(inputText.value.toLowerCase()) > -1;
                    } else if (headers[i].searchType === "date") {
                        if (inputText !== '') {
                            fieldValue = this.dateFormatter(fieldValue.toString());
                            if (headers[i].accessor === 'startDate') {
                                show = new Date(fieldValue).getTime() >= new Date(inputText).getTime()
                            } else if (headers[i].accessor === 'endDate') {
                                show = new Date(fieldValue).getTime() <= new Date(inputText).getTime()
                            }
                            // show = (fieldValue.toString() === inputText);
                        }
                    }
                    if (!show) {//FieldValue Present Still no Match Then Cut the Data
                        break;
                    }
                }
            }
            return show;
        });
        // Update the state
        this.setState({
            data: searchData,
            pagedData: searchData,
            totalRecords: searchData.length
        }, () => {
            if (this.pagination.enabled) {
                this.onGotoPage(1);
            }
        });
    }

    onSave = (addTopicValue) => {
        let { headers } = this.state;
        addTopicValue['trainers'] = addTopicValue['trainers'].toString().split(",").filter(e => !(e === ''));
        addTopicValue['attendees'] = addTopicValue['attendees'].toString().split(",").filter(e => !(e === ''));

        for (let index = 1; index < headers.length; index++) {
            if (addTopicValue[headers[index].accessor].length === 0) {
                console.log(headers[index].accessor, addTopicValue[headers[index].accessor]);
                alert("Please Enter All The Fields : "+headers[index].accessor.toString());
                return;
            }
        }
        if (new Date(addTopicValue['endDate']).getTime() < new Date(addTopicValue['startDate']).getTime()) {
            alert("End Date Should Be Greater");
            return;
        }
        addTopicValue['startDate'] = this.dateFormatter(addTopicValue['startDate'].toString());

        addTopicValue['endDate'] = this.dateFormatter(addTopicValue['endDate'].toString());

        console.log("Go To DB With:", addTopicValue);
        this.props.addTopicToDB(addTopicValue);
        this.onClickAddTopic();
    }

    onUpdate = (editTopicValue) => {
        let { headers } = this.state;
        editTopicValue['trainers'] = editTopicValue['trainers'].toString().split(",").filter(e => !(e === ''));
        editTopicValue['attendees'] = editTopicValue['attendees'].toString().split(",").filter(e => !(e === ''));

        for (let index = 1; index < headers.length; index++) {
            if (editTopicValue[headers[index].accessor].length === 0) {
                console.log(headers[index].accessor, editTopicValue[headers[index].accessor]);
                alert("Please Enter All The Fields : "+headers[index].accessor.toString());
                return;
            }
        }
        if (new Date(editTopicValue['endDate']).getTime() < new Date(editTopicValue['startDate']).getTime()) {
            alert("End Date Should Be Greater");
            return;
        }
        editTopicValue['startDate'] = this.dateFormatter(editTopicValue['startDate'].toString());

        editTopicValue['endDate'] = this.dateFormatter(editTopicValue['endDate'].toString());

        console.log("Go To DB With:", editTopicValue);
        this.props.updateTopicToDB(editTopicValue);
        this.onClickEdit('');
    }


    createList = (low, high, diff) => {
        let list = [];
        for (let i = low; i <= high; i = i + diff) {
            list.push(i);
        }
        return list;
    }

    dateFormatter = (format) => {
        return (format.split("-")[2] + "-" +
        format.toString().split("-")[1] + "-" +
        format.toString().split("-")[0]).toString();
    }

    onClickSearch = (e) => {
        if (this.state.search) {
            this.setState({
                data: this._preSearchData,
                search: false
            }, () => {
                this.onGotoPage(1);
            });
            this._preSearchData = null;
            this.width = "80%";
        } else {
            this._preSearchData = this.state.data;
            // this.width = "60%";
            this.setState({
                search: true
            });
        }
    }

    onClickAddTopic = () => {
        this.setState({ addTopic: !this.state.addTopic });
    }

    onClickEdit = (edit_ID) => {
        if(edit_ID === ''){
            this.setState({ editTopic: false, edit_ID : edit_ID });
        }else{
            if(!this.state.editTopic){this.setState({ editTopic: true, edit_ID : edit_ID });}
        }
    }

    onClickCancel = () => {
        if (this.state.search) { this.onClickSearch() }
        else if (this.state.addTopic) { this.onClickAddTopic() }
        else if (this.state.editTopic) { this.onClickEdit('') }
    }

    getPagedData = (pageNo, pageLength) => {
        let startOfRecord = (pageNo - 1) * pageLength;
        let endOfRecord = startOfRecord + pageLength;

        let data = this.state.data;
        let pagedData = data.slice(startOfRecord, endOfRecord);

        return pagedData;
    }

    onPageLengthChange = (pageLength) => {
        this.setState({
            pageLength: parseInt(pageLength, 10),
            currentPage: 1
        }, () => {
            this.onGotoPage(this.state.currentPage);
        });
    }

    onGotoPage = (pageNo) => {
        let pagedData = this.getPagedData(pageNo, this.state.pageLength);
        this.setState({
            pagedData: pagedData,
            currentPage: pageNo
        });
    }

    componentDidMount() {
        if (this.pagination.enabled) {
            this.onGotoPage(this.state.currentPage);
        }
    }


    /* static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.data.length != prevState.data.length) {
            return {
                            headers: nextProps.headers,
                data: nextProps.data,
                sortby: prevState.sortby,
                descending: prevState.descending,
                search: prevState.search,
                currentPage: 1,
                pagedData: nextProps.data,
            }
        }
        return null;
    } */

    render() {
        return (
            <div className={this.props.className}>
                {this.renderToolbar()}
                {this.renderTable()}
                {this.pagination.enabled &&

                    <Pagination
                        type={this.props.pagination.type}
                        totalRecords={this.state.data.length}
                        pageLength={this.state.pageLength}
                        onPageLengthChange={this.onPageLengthChange}
                        onGotoPage={this.onGotoPage}
                        currentPage={this.state.currentPage}
                    />
                }
            </div>
        )
    }
}